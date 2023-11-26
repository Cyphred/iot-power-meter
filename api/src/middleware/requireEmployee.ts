import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import ApiError from "../errors/apiError.js";
import { ErrorCode } from "../errors/errorCodes.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import EmployeeModel from "../models/employee.js";

dotenv.config();

export default async function requireEmployee(
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

    // Get employee _id from payload
    const employeeId: string | undefined = jwtPayload.employeeId;

    // Reject if employee _id not in jwt payload
    if (!employeeId) throw new ApiError(ErrorCode.MISSING_DATA_FROM_JWT);

    // Fetch employee data
    const employee = await EmployeeModel.findById(employeeId);

    req.employee = employee;
    next();
  } catch (err) {
    next(err);
  }
}
