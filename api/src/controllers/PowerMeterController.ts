import { NextFunction, Request, Response } from "express";
import bcryptjs from "bcryptjs";
import PowerMeterModel from "../models/meter.js";
import ApiError from "../errors/apiError.js";
import { ErrorCode } from "../errors/errorCodes.js";
import createToken from "../common/createToken.js";
import genericOkResponse from "../common/genericOkResponse.js";

export async function generatePowerMeterToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { meterId, secret } = req.body;
    const invalidMeterSecretError = new ApiError(
      ErrorCode.INVALID_METER_SECRET
    );

    // Fetch meter data
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
