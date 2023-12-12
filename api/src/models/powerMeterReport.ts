import mongoose, { Document, Schema, Types, Model } from "mongoose";

export interface PowerMeterReport {
  meter: Types.ObjectId;
  reportStart: Date;
  reportEnd: Date;
  /**
   * Consumption in KWH
   */
  consumption: number;
}

export interface PowerMeterReportDocument extends PowerMeterReport, Document {}

const PowerMeterReportSchema: Schema<PowerMeterReportDocument> =
  new Schema<PowerMeterReportDocument>({
    meter: {
      type: Schema.Types.ObjectId,
      ref: "PowerMeter",
      required: true,
    },
    reportStart: {
      type: Date,
      required: true,
    },
    reportEnd: {
      type: Date,
      required: true,
    },
    consumption: {
      type: Number,
      required: true,
      validate: {
        validator: function (consumption: number) {
          return consumption >= 0;
        },
        message: "Consumption cannot be negative",
      },
    },
  });

const PowerMeterReportModel: Model<PowerMeterReportDocument> =
  mongoose.model<PowerMeterReportDocument>(
    "PowerMeterReport",
    PowerMeterReportSchema
  );

export default PowerMeterReportModel;
