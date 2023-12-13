import { Request, Response, NextFunction } from "express";
import genericOkResponse from "../common/genericOkResponse.js";
import RateModel from "../models/rate.js";
import ApiError from "../errors/apiError.js";
import { ErrorCode } from "../errors/errorCodes.js";
import CutoffModel from "../models/cutoff.js";

export const createCutoff = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cutoffDate, rate }: { cutoffDate: string; rate: string } = req.body;

    const rateData = await RateModel.findById(rate);
    if (!rate) throw new ApiError(ErrorCode.RATE_NOT_FOUND);

    const cutoff = await CutoffModel.create({
      cutoffDate: new Date(cutoffDate),
      rate: rateData._id,
    });

    return genericOkResponse(res, { cutoff });
  } catch (err) {
    next(err);
  }
};
