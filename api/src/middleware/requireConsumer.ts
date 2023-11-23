import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import ApiError from "../errors/apiError.js";
import { ErrorCode } from "../errors/errorCodes.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import ConsumerModel from "../models/consumer.js";

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
    // Prepare an error to throw in the event of a missing authentication token
    const missingAuthenticationTokenError = new ApiError(
      ErrorCode.MISSING_AUTHENTICATION_TOKEN
    );

    // Grab authorization data from headers
    const authorization: string = req.headers.authorization;

    // Reject if no authorization provided
    if (!authorization) throw missingAuthenticationTokenError;

    // Get Bearer token from authorization header
    const token = authorization.split(" ")[1];

    // Reject if no Bearer token found
    if (!token) throw missingAuthenticationTokenError;

    // Verify token signature and extract payload
    const jwtPayload = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    // Get power consumer _id from payload
    const { consumerId }: { consumerId: string } = jwtPayload;

    // Reject if consumer _id not in jwt payload
    if (!consumerId) throw new ApiError(ErrorCode.MISSING_DATA_FROM_JWT);

    // Fetch consumer data
    const consumer = await ConsumerModel.findById(consumerId);

    // Include consumer data in the request
    req.consumer = consumer;
    next();
  } catch (err) {
    next(err);
  }
}
