import { Request, Response, NextFunction } from "express";
import ConsumerModel, {
  Consumer,
  ConsumerDocument,
} from "../models/consumer.js";
import genericOkResponse from "../common/genericOkResponse.js";
import PowerMeterModel, { PowerMeterDocument } from "../models/meter.js";
import { Types } from "mongoose";
import ApiError from "../errors/apiError.js";
import { ErrorCode } from "../errors/errorCodes.js";

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

export const getConsumers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Fetch all meters
    const meters = await PowerMeterModel.find({});

    // Fetch all consumers with meters
    const withMeters = await ConsumerModel.find({
      _id: { $in: meters.map((meter) => meter.consumer) },
    });

    // Fetch all consumers without meters
    const withoutMeters = await ConsumerModel.find({
      _id: { $nin: withMeters.map((consumer) => consumer._id) },
    });

    let result: { consumer: ConsumerDocument; meter: PowerMeterDocument }[] =
      [];

    for (const consumer of withMeters) {
      result.push({
        consumer,
        meter: meters.find(
          (meter) => meter.consumer._id.toString() === consumer._id.toString()
        ),
      });
    }

    for (const consumer of withoutMeters) {
      result.push({
        consumer,
        meter: null,
      });
    }

    return genericOkResponse(res, { consumers: result });
  } catch (err) {
    next(err);
  }
};

export const getConsumerById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { consumerId } = req.params;

    const consumer = await ConsumerModel.findOne({ _id: consumerId });
    if (!consumer) throw new ApiError(ErrorCode.CONSUMER_NOT_FOUND);

    const meter = await PowerMeterModel.findOne({ consumer: consumer._id });

    return genericOkResponse(res, { consumer, meter });
  } catch (err) {
    next(err);
  }
};
