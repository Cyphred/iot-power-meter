import { Request, Response, NextFunction } from "express";
import EmployeeModel, { Employee } from "../models/employee.js";
import genericOkResponse from "../common/genericOkResponse.js";

export const createEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, firstName, middleName, lastName } =
      req.body as Employee;

    // Create a user using the provided data
    await EmployeeModel.signup({
      email,
      password,
      firstName,
      middleName,
      lastName,
    });

    return genericOkResponse(res, undefined, "Employee account created");
  } catch (err) {
    next(err);
  }
};
