import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import ApiError from "../errors/apiError.js";
import { ErrorCode } from "../errors/errorCodes.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import PowerMeterModel from "../models/meter.js";

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

    // Grab authorization from headers
    const authorization: string = req.headers.authorization;

    // Reject if no auth provided
    if (!authorization) throw missingAuthenticationTokenError;

    // Get token from bearer auth
    const token = authorization.split(" ")[1];

    // Reject if no token found
    if (!token) throw missingAuthenticationTokenError;

    // Verify token signature and extract payload
    const jwtPayload = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    // Get power meter _id from payload
    const meterId: string | undefined = jwtPayload.powerMeterId;

    // Reject if meter _id not in jwt payload
    if (!meterId) throw new ApiError(ErrorCode.MISSING_DATA_FROM_JWT);

    // Fetch meter data
    const meter = await PowerMeterModel.findById(meterId);

    req.meter = meter;
    next();
  } catch (err) {
    next(err);
  }
}
