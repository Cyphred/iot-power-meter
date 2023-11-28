import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import ApiError from "../errors/apiError.js";
import { ErrorCode } from "../errors/errorCodes.js";

dotenv.config();

/**
 * Verifies that the requestor is a Consumer.
 * Used for protecting specific routes that are exclusive to consumers.
 */
export default async function requireConsumer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Reject if the request does not have a consumer object
    if (!req.consumer) throw new ApiError(ErrorCode.UNAUTHORIZED);

    next();
  } catch (err) {
    next(err);
  }
}
