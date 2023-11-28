import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import ApiError from "../errors/apiError.js";
import { ErrorCode } from "../errors/errorCodes.js";

dotenv.config();

/**
 * Verifies that the requestor is a Employee.
 * Used for protecting specific routes that are exclusive to employees.
 */
export default async function requireEmployee(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Reject if the request does not have an employee object
    if (!req.employee) throw new ApiError(ErrorCode.EMPLOYEE_NOT_FOUND);

    next();
  } catch (err) {
    next(err);
  }
}
