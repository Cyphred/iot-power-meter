import { Request, Response, NextFunction } from "express";
import ConsumerModel, { ConsumerDocument } from "../models/consumer.js";
import ApiError from "../errors/apiError.js";
import { ErrorCode } from "../errors/errorCodes.js";
import PowerMeterModel from "../models/meter.js";
import BillingModel, { IBillingDocument } from "../models/billing.js";
import PowerMeterReportModel from "../models/powerMeterReport.js";
import genericOkResponse from "../common/genericOkResponse.js";
import CutoffModel, { ICutoffDocument } from "../models/cutoff.js";
import RateModel, { IRateBreakdown, IRateDocument } from "../models/rate.js";
import dayjs from "dayjs";

export const getPartialBilling = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { consumerId } = req.query;

    // Fetch consumer data
    const consumer = await ConsumerModel.findOne({
      _id: consumerId,
      active: true,
    });

    // Reject if consumer does not exist
    if (!consumer) throw new ApiError(ErrorCode.CONSUMER_NOT_FOUND);

    // Fetch the consumer's meter
    const meter = await PowerMeterModel.findOne({ consumer: consumer._id });

    // Reject if consumer's meter does not exist
    if (!meter) throw new ApiError(ErrorCode.METER_NOT_FOUND);

    // Record the date and time now
    const now = new Date();

    // Get the latest billing record
    const latestBilling = await BillingModel.findOne({ end: { $lt: now } });

    // Fetch all reports between the end of the latest billing and now
    const reports = await PowerMeterReportModel.find({
      reportStart: { $lt: now, $gt: latestBilling.start },
      reportEnd: { $lte: now },
    });

    // Get the total consumption
    let totalConsumption: number = 0;
    for (const report of reports) {
      totalConsumption += report.consumption;
    }

    // Prepare the payload response
    const payload = {
      consumer,
      meter,
      start: latestBilling.end,
      end: now,
      consumption: totalConsumption,
    };

    return genericOkResponse(res, payload);
  } catch (err) {
    next(err);
  }
};

export const getBill = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { consumerId } = req.query;

    // Parse the month, day, and year from the query params as numbers
    const month = parseInt(req.query.month as string);
    const year = parseInt(req.query.year as string);
    const day = parseInt(req.query.day as string);

    // Reject if month and year params are invalid or not provided
    if (
      isNaN(month) ||
      isNaN(year) ||
      isNaN(day) ||
      month < 1 ||
      month > 12 ||
      day < 1 ||
      day > 31
    )
      throw new ApiError(ErrorCode.INVALID_QUERY_PARAMS);

    // Fetch consumer data
    const consumer = await ConsumerModel.findOne({
      _id: consumerId,
      active: true,
    });

    // Reject if consumer does not exist
    if (!consumer) throw new ApiError(ErrorCode.CONSUMER_NOT_FOUND);

    // Define target month as a Date object
    const targetDate = new Date();
    targetDate.setFullYear(year, month - 1, day);

    // Find the matching bill
    const bill = await BillingModel.findOne({
      start: { $lte: targetDate },
      end: { $gte: targetDate },
    });

    // Reject if a bill was not found
    if (!bill) throw new ApiError(ErrorCode.BILL_NOT_FOUND);

    return genericOkResponse(res, bill);
  } catch (err) {
    next(err);
  }
};

export const getPendingBill = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { consumerId } = req.params;

    const consumer = await ConsumerModel.findOne({
      _id: consumerId,
    });

    if (!consumer) throw new ApiError(ErrorCode.CONSUMER_NOT_FOUND);

    const bill = await BillingModel.findOne({}).sort({ dueDate: -1 }).limit(1);

    return genericOkResponse(res, { bill: bill ?? null });
  } catch (err) {
    next(err);
  }
};

export const generateBillsForAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { breakdown }: { breakdown: IRateBreakdown[] } = req.body;
    const dateToday = new Date();

    // Create a new rate record
    let ratePerKwh = 0;
    for (const item of breakdown) {
      ratePerKwh += item.amount;
    }
    const rate = await RateModel.create({ breakdown, ratePerKwh });

    // Create a new cutoff record
    const newCutoff = await CutoffModel.create({
      cutoffDate: dateToday,
      rate: rate._id,
    });

    const activeConsumers = await ConsumerModel.find({
      active: true,
    });

    // Stop if there are no active consumers
    if (!activeConsumers.length)
      return genericOkResponse(
        res,
        activeConsumers,
        "No consumers to generate bills for"
      );

    // Get the last cutoff
    const lastCutoff = await CutoffModel.findOne({
      cutoffDate: { $lt: dateToday },
    });
    if (!lastCutoff) throw new ApiError(ErrorCode.CUTOFF_NOT_FOUND);

    const billsCreated: IBillingDocument[] = [];

    for (const consumer of activeConsumers) {
      const result = await createBill(consumer, rate, lastCutoff, newCutoff);
      if (result) billsCreated.push(result);
    }

    return genericOkResponse(res, { billsCreated, rate, cutoff: newCutoff });
  } catch (err) {
    next(err);
  }
};

const createBill = async (
  consumer: ConsumerDocument,
  rate: IRateDocument,
  lastCutoff: ICutoffDocument,
  newCutoff: ICutoffDocument
) => {
  const dueDate = dayjs(newCutoff.cutoffDate).add(7, "days");
  const disconnectionDate = dueDate.add(3, "days");

  const bill = await BillingModel.create({
    start: lastCutoff.cutoffDate,
    end: newCutoff.cutoffDate,
    consumption: 0,
    rate: rate.ratePerKwh,
    breakdown: rate.breakdown.map((item) => {
      return { description: item.description, amount: item.amount };
    }),
    consumer: consumer._id,
    dueDate: dueDate,
    disconnectionDate,
  });

  return bill;
};
