import { Request, Response, NextFunction } from "express";
import genericOkResponse from "../common/genericOkResponse.js";
import ConsumerModel from "../models/consumer.js";
import ApiError from "../errors/apiError.js";
import { ErrorCode } from "../errors/errorCodes.js";
import PowerMeterModel from "../models/meter.js";
import CutoffModel from "../models/cutoff.js";
import RateModel from "../models/rate.js";
import PowerMeterReportModel, {
  PowerMeterReportDocument,
} from "../models/powerMeterReport.js";
import getRedisClient from "../common/getRedisClient.js";

export const getConsumptionReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { consumerId } = req.params;

    const dateToday = new Date();

    const consumer = await ConsumerModel.findById(consumerId);
    if (!consumer) throw new ApiError(ErrorCode.CONSUMER_NOT_FOUND);

    const meter = await PowerMeterModel.findOne(
      { consumer: consumer._id },
      { consumer: 0 }
    );
    if (!meter) throw new ApiError(ErrorCode.METER_NOT_FOUND);

    const lastCutoff = await CutoffModel.findOne({
      cutoffDate: { $lt: dateToday },
    })
      .sort({ cutoffDate: -1 })
      .limit(1);
    if (!lastCutoff) throw new ApiError(ErrorCode.CUTOFF_NOT_FOUND);

    const rate = await RateModel.findOne({ _id: lastCutoff.rate });
    if (!rate) throw new ApiError(ErrorCode.RATE_NOT_FOUND);

    // Get all reports that are between the last cutoff and today
    const reports = await PowerMeterReportModel.find({
      meter: meter._id,
      /*
      reportStart: { $gte: lastCutoff.cutoffDate },
      reportEnd: { $lte: dateToday },
      */
    }).sort({ reportStart: 1 });

    let consumptionSinceCutoff: number = 0;
    let millisecondsSinceCutoff: number = 0;
    for (const report of reports) {
      // Accumulate consumption values
      consumptionSinceCutoff += report.consumption;

      // Accumultae time values
      millisecondsSinceCutoff +=
        report.reportEnd.getTime() - report.reportStart.getTime();
    }

    // Convert the watthours since cutoff
    const whSinceCutoff =
      (consumptionSinceCutoff * millisecondsSinceCutoff) / 3600000;

    const redisClient = await getRedisClient();
    const wattageRightNowString = await redisClient.get(
      `wattageNow:${meter._id}`
    );
    await redisClient.quit();
    const wattageRightNow = JSON.parse(wattageRightNowString) as {
      value: number;
      timestamp: Date;
    };

    const payload = {
      lastCutoff: lastCutoff ? lastCutoff.cutoffDate : undefined,
      meter,
      consumption: {
        sinceCutoff: whSinceCutoff,
        averageDaily: await getDailyAverage(reports),
        rightNow: !wattageRightNow ? undefined : wattageRightNow,
      },
      ratePerKwh: rate.ratePerKwh,
      rateBreakdown: rate.breakdown,
    };

    return genericOkResponse(res, payload);
  } catch (err) {
    next(err);
  }
};

const getDailyAverage = async (reports: PowerMeterReportDocument[]) => {
  const result: { averageConsumption: number; date: Date }[] =
    await PowerMeterReportModel.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$reportStart" },
            month: { $month: "$reportStart" },
            day: { $dayOfMonth: "$reportStart" },
          },
          averageConsumption: { $avg: "$consumption" },
        },
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateFromParts: {
              year: "$_id.year",
              month: "$_id.month",
              day: "$_id.day",
            },
          },
          averageConsumption: 1,
        },
      },
      {
        $sort: { date: 1 },
      },
    ]);

  if (!result.length) return;

  return result[0].averageConsumption;
};
