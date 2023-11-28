import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import ApiError from "../errors/apiError.js";
import { ErrorCode } from "../errors/errorCodes.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import ConsumerModel from "../models/consumer.js";
import EmployeeModel from "../models/employee.js";

dotenv.config();

/**
 * Verifies that the requestor is an authenticated user.
 */
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

    // Get power consumer or employee _id from payload
    const consumerId: string = jwtPayload.consumerId;
    const employeeId: string = jwtPayload.employeeId;

    // Reject if neither consumer or employee _id not in jwt payload
    if (!consumerId && !employeeId)
      throw new ApiError(ErrorCode.MISSING_DATA_FROM_JWT);

    if (consumerId) {
      const consumer = await ConsumerModel.findById(consumerId);
      if (!consumer) throw new ApiError(ErrorCode.CONSUMER_NOT_FOUND);
      req.consumer = consumer;
    } else if (employeeId) {
      const employee = await EmployeeModel.findById(employeeId);
      if (!employee) throw new ApiError(ErrorCode.EMPLOYEE_NOT_FOUND);
      req.employee = employee;
    } else {
      throw new ApiError(ErrorCode.GENERIC);
    }

    next();
  } catch (err) {
    next(err);
  }
};
