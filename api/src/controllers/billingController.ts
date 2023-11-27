import { Request, Response, NextFunction } from "express";
import ConsumerModel from "../models/consumer.js";
import ApiError from "../errors/apiError.js";
import { ErrorCode } from "../errors/errorCodes.js";
import PowerMeterModel from "../models/meter.js";
import BillingModel from "../models/billing.js";
import PowerMeterReportModel from "../models/powerMeterReport.js";
import genericOkResponse from "../common/genericOkResponse.js";

export const getInitialBilling = async (
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
