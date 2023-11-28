import { Request, Response, NextFunction } from "express";
import ConsumerModel from "../models/consumer.js";
import ApiError from "../errors/apiError.js";
import { ErrorCode } from "../errors/errorCodes.js";
import PowerMeterModel from "../models/meter.js";
import BillingModel from "../models/billing.js";
import PowerMeterReportModel from "../models/powerMeterReport.js";
import genericOkResponse from "../common/genericOkResponse.js";

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
