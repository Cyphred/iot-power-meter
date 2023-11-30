import { Request, Response, NextFunction } from "express";
import ConsumerModel, { Consumer } from "../models/consumer.js";
import genericOkResponse from "../common/genericOkResponse.js";

export const createConsumer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      email,
      password,
      firstName,
      middleName,
      lastName,
      streetAddress,
      barangay,
      city,
    } = req.body as Omit<Consumer, "active">;

    // Create a user using the provided data
    const consumer = await ConsumerModel.signup({
      email,
      password,
      firstName,
      middleName,
      lastName,
      streetAddress,
      barangay,
      city,
    });

    return genericOkResponse(res, undefined, "Consumer account created");
  } catch (err) {
    next(err);
  }
};
