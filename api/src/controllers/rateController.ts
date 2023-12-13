import { Request, Response, NextFunction } from "express";
import RateModel, { IRateBreakdown } from "../models/rate.js";
import genericOkResponse from "../common/genericOkResponse.js";

export const createRate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const breakdown = req.body.breakdown as IRateBreakdown[];

    let ratePerKwh: number = 0;

    for (const item of breakdown) {
      ratePerKwh += item.amount;
    }

    const rate = await RateModel.create({ breakdown, ratePerKwh });

    return genericOkResponse(res, { rate });
  } catch (err) {
    next(err);
  }
};
