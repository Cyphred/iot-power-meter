import { NextFunction, Request, Response } from "express";
import bcryptjs from "bcryptjs";
import PowerMeterModel from "../models/meter.js";
import ApiError from "../errors/apiError.js";
import { ErrorCode } from "../errors/errorCodes.js";
import createToken from "../common/createToken.js";
import genericOkResponse from "../common/genericOkResponse.js";
import PowerMeterReportModel, {
  PowerMeterReport,
} from "../models/powerMeterReport.js";
import IConsumptionFrame from "../types/ConsumptionFrame.js";
import { Types } from "mongoose";
import getRedisClient from "../common/getRedisClient.js";
import ConsumerModel from "../models/consumer.js";
import CutoffModel from "../models/cutoff.js";
import RateModel from "../models/rate.js";

/**
 * Generates a token for validating data coming from a power meter.
 * This is equivalent to a user logging in with a username/password.
 */
export async function generatePowerMeterToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // For a more logical understanding of what's going on here,
    // think of the meterId as the `username` and the `secret` as the password.
    const { meterId, secret } = req.body;

    // Prepare the error to throw in the event the meter secret is invalid.
    const invalidMeterSecretError = new ApiError(
      ErrorCode.INVALID_METER_SECRET
    );

    // Fetch meter data using id
    const meter = await PowerMeterModel.findById(meterId);

    // If provided meter _id does not match any record
    if (!meter) throw invalidMeterSecretError;

    // Check if the provided password matches the encrypted one
    const match = await bcryptjs.compare(secret, meter.secret);

    // If meter secret does not match
    if (!match) throw invalidMeterSecretError;

    // Generate a token
    const token = createToken({ powerMeterId: meter._id });

    return genericOkResponse(res, { token });
  } catch (err) {
    next(err);
  }
}

/**
 * Used by the power meters for creating a consumption report
 * for a certain timeframe.
 */
export async function createPowerMeterReport(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Extract the data sent by the meter
    const reports = req.body.reports as IConsumptionFrame[];

    const formattedReports: PowerMeterReport[] = [];

    for (const r of reports) {
      const newReport: PowerMeterReport = {
        reportStart: new Date(r.start.getTime() * 1000),
        reportEnd: new Date(r.end.getTime() * 1000),
        consumption: r.consumption / 1000, // Data arrives as watthour
        // FIXME Very hacky, check why this is complaining about
        // being a document
        meter: req.meter._id as unknown as Types.ObjectId,
      };

      formattedReports.push(newReport);
    }

    await PowerMeterReportModel.insertMany(formattedReports);

    // Update when the meter was last seen
    await PowerMeterModel.findOneAndUpdate(
      { _id: req.meter._id },
      { lastSeen: new Date() }
    );

    return genericOkResponse(res, null, "Reports created");
  } catch (err) {
    next(err);
  }
}

export const ping = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      currentNow,
      sensorError,
      watthourNow,
    }: { currentNow: number; sensorError: boolean; watthourNow: number } =
      req.body;

    const timeNow = new Date();

    console.log("ping", req.body);

    const cachedCurrent = {
      // value: currentNow,
      value: watthourNow / 220,
      timestamp: timeNow,
    };

    await PowerMeterReportModel.create({
      reportStart: timeNow,
      reportEnd: timeNow,
      consumption: watthourNow,
      meter: req.meter._id,
    });

    const redisClient = await getRedisClient();
    await redisClient.set(
      `currentNow:${req.meter._id}`,
      JSON.stringify(cachedCurrent)
    );

    // Update when the meter was last seen
    const meter = await PowerMeterModel.findOneAndUpdate(
      { _id: req.meter._id },
      { lastSeen: timeNow },
      { new: true }
    );
    if (!meter) throw new ApiError(ErrorCode.METER_NOT_FOUND);

    const consumer = await ConsumerModel.find({ _id: meter.consumer });
    if (!consumer) throw new ApiError(ErrorCode.CONSUMER_NOT_FOUND);

    const dateToday = new Date();

    const lastCutoff = await CutoffModel.findOne({
      cutoffDate: { $lt: dateToday },
    })
      .sort({ cutoffDate: -1 })
      .limit(1);
    if (!lastCutoff) throw new ApiError(ErrorCode.CUTOFF_NOT_FOUND);

    const rate = await RateModel.findOne({ _id: lastCutoff.rate });
    if (!rate) throw new ApiError(ErrorCode.RATE_NOT_FOUND);

    // Get all reports that are between the last cutoff and today
    const reports = await PowerMeterReportModel.find({
      meter: meter._id,
      reportStart: { $gte: lastCutoff.cutoffDate },
      reportEnd: { $lte: dateToday },
    }).sort({ reportStart: 1 });

    let consumptionSinceCutoff: number = 0;
    let millisecondsSinceCutoff: number = 0;

    if (reports.length > 1) {
      millisecondsSinceCutoff =
        reports[reports.length - 1].reportEnd.getTime() -
        reports[0].reportEnd.getTime();
    }
    if (reports.length === 1) {
      millisecondsSinceCutoff =
        timeNow.getTime() - reports[0].reportEnd.getTime();
    }

    for (const report of reports) {
      // Accumulate consumption values
      consumptionSinceCutoff += report.consumption;
    }

    // Convert the watthours since cutoff
    const whSinceCutoff =
      (consumptionSinceCutoff * millisecondsSinceCutoff) / 3600000;

    await redisClient.quit();

    const payload = {
      subscriberDisconnect: !meter.active,
      kwhSinceCutoff: parseFloat((whSinceCutoff / 1000).toFixed(4)),
    };

    // return genericOkResponse(res, payload, "Ping acknowledged");

    return res.status(200).json(payload);
  } catch (err) {
    next(err);
  }
};

export const switchMeter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { meterId } = req.params;
    const { state }: { state: boolean } = req.body;

    const meter = await PowerMeterModel.findOneAndUpdate(
      { _id: meterId },
      { active: state },
      { new: true }
    );

    if (!meter) throw new ApiError(ErrorCode.METER_NOT_FOUND);

    return genericOkResponse(res, { meter });
  } catch (err) {
    next(err);
  }
};
