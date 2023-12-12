import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import ApiError from "../errors/apiError.js";
import { ErrorCode } from "../errors/errorCodes.js";
import PowerMeterModel from "../models/meter.js";
import bcryptjs from "bcryptjs";

dotenv.config();

export default async function requireMeter(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const missingAuthenticationTokenError = new ApiError(
      ErrorCode.MISSING_AUTHENTICATION_TOKEN
    );

    const meterNotFoundError = new ApiError(ErrorCode.METER_NOT_FOUND);

    // Grab authorization from headers
    const authorization: string = req.headers.authorization;

    // Reject if no auth provided
    if (!authorization) throw missingAuthenticationTokenError;

    // Get meter id and secret from authoziation header
    // Looks like this:
    // <meter_id>:<meter_secret>
    // For example, meter1:1t95tr34g
    console.log(authorization);
    const [meterId, meterSecret] = authorization.split(":");

    console.log("meterid", meterId, "metersecret", meterSecret);

    // Reject if no token found
    if (!meterId || !meterSecret) throw missingAuthenticationTokenError;

    // Fetch meter data
    const meter = await PowerMeterModel.findOne({ secret: meterSecret });

    // Reject if meter _id has no match
    if (!meter) throw meterNotFoundError;

    req.meter = meter;
    next();
  } catch (err) {
    next(err);
  }
}
