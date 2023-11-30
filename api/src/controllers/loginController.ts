import { Request, Response, NextFunction } from "express";
import accountTypes from "../lib/accountTypes.js";
import ApiError from "../errors/apiError.js";
import { ErrorCode } from "../errors/errorCodes.js";
import ConsumerModel, { ConsumerDocument } from "../models/consumer.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import EmployeeModel, { EmployeeDocument } from "../models/employee.js";
import genericOkResponse from "../common/genericOkResponse.js";
import PowerMeterModel from "../models/meter.js";

/**
 * Creates an authentication token from an id
 * @param id is the id to generate a token for
 * @returns the token
 */
export function createToken(
  payload: object,
  expiry: string | undefined
): string {
  // Fetch secret from env
  const secret = process.env.JWT_SECRET;

  // Reject if jwt secret is not in env
  if (!secret) throw new ApiError(ErrorCode.MISSING_ENV_VALUE);

  // Defaults to 1 day if not defined
  if (!expiry) {
    expiry = "1d";
  }

  return jwt.sign(payload, secret, { expiresIn: expiry });
}

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { type } = req.query;
    const { email, password } = req.body;

    // Prepare invalid account type error
    const invalidAccountTypeError = new ApiError(
      ErrorCode.INVALID_ACCOUNT_TYPE
    );

    // Reject if no type was provided
    if (!type) throw invalidAccountTypeError;

    // Parse the type as string and match it to the valid account types
    const _type = (type as string).toUpperCase();

    if (_type === accountTypes.CONSUMER) {
      const token = await authenticateConsumer(email, password);
      const consumer = await ConsumerModel.findOne({ email });

      // Fetch the consumer's power meter
      const meter = await PowerMeterModel.findOne({ consumer: consumer._id });

      return genericOkResponse(res, {
        token,
        consumer,
        meter: meter ? { _id: meter._id } : undefined,
      });
    } else if (_type === accountTypes.EMPLOYEE) {
      const token = await authenticateEmployee(email, password);
      const employee = await EmployeeModel.findOne({ email });

      return genericOkResponse(res, { token, employee });
    }

    throw invalidAccountTypeError;
  } catch (err) {
    next(err);
  }
};

const authenticateConsumer = async (email: string, password: string) => {
  // Fetch consumer data
  const consumer = await ConsumerModel.findOne(
    { email },
    { email: 1, password: 1 }
  );

  const invalidCredentialsError = new ApiError(ErrorCode.INVALID_CREDENTIALS);

  // Reject if the email does not match a consumer
  if (!consumer) throw invalidCredentialsError;

  // Check if the provided and the stored passwords match
  const match = await bcryptjs.compare(password, consumer.password);

  // Reject if passwords do not match
  if (!match) throw invalidCredentialsError;

  // Generate a jwt
  const token = createToken(
    { consumerId: consumer._id.toString() },
    process.env.USER_TOKEN_VALIDITY as string
  );

  return token;
};

const authenticateEmployee = async (email: string, password: string) => {
  // Fetch employee data
  const employee = await EmployeeModel.findOne(
    { email },
    { email: 1, password: 1 }
  );

  const invalidCredentialsError = new ApiError(ErrorCode.INVALID_CREDENTIALS);

  // Reject if the email does not match an employee
  if (!employee) throw invalidCredentialsError;

  // Check if the provided and the stored passwords match
  const match = await bcryptjs.compare(password, employee.password);

  // Reject if passwords do not match
  if (!match) throw invalidCredentialsError;

  // Generate a jwt
  const token = createToken(
    { employeeId: employee._id.toString() },
    process.env.USER_TOKEN_VALIDITY as string
  );

  return token;
};
