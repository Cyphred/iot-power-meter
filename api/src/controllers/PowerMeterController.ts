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

    console.log(req.body.reports);

    const formattedReports: PowerMeterReport[] = [];

    console.log("meter id", req.meter._id);

    for (const r of reports) {
      const newReport: PowerMeterReport = {
        reportStart: new Date(r.start.getTime() * 1000),
        reportEnd: new Date(r.end.getTime() * 1000),
        consumption: r.consumption,
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
    }: { currentNow: number; sensorError: boolean } = req.body;

    const timeNow = new Date();

    const cachedCurrent = {
      value: currentNow,
      timestamp: timeNow,
    };

    const redisClient = await getRedisClient();
    await redisClient.set(
      `currentNow:${req.meter._id}`,
      JSON.stringify(cachedCurrent)
    );
    await redisClient.quit();

    // Update when the meter was last seen
    const meter = await PowerMeterModel.findOneAndUpdate(
      { _id: req.meter._id },
      { lastSeen: timeNow },
      { new: true }
    );

    const payload = {
      subscriberDisconnect: !meter.active,
    };

    return genericOkResponse(res, payload, "Ping acknowledged");
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
