import { NextFunction, Request, Response } from "express";
import bcryptjs from "bcryptjs";
import PowerMeterModel from "../models/meter.js";
import ApiError from "../errors/apiError.js";
import { ErrorCode } from "../errors/errorCodes.js";
import createToken from "../common/createToken.js";
import genericOkResponse from "../common/genericOkResponse.js";
import PowerMeterReportModel from "../models/powerMeterReport.js";

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
    const {
      reportStart,
      reportEnd,
      consumption,
      reportSeriesNumber,
    }: {
      reportStart: Date;
      reportEnd: Date;
      consumption: number;
      reportSeriesNumber: number;
    } = req.body;

    await PowerMeterReportModel.create({
      meter: req.meter._id,
      reportStart,
      reportEnd,
      consumption,
      reportSeriesNumber,
    });

    return genericOkResponse(res, null, "Report created");
  } catch (err) {
    next(err);
  }
}
