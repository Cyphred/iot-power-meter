import mongoose, { Document, Schema, Types, Model } from "mongoose";

export interface PowerMeter {
  secret: string;
  consumer: Types.ObjectId;
  lastSeen: Date;
  active: boolean;
}

export interface PowerMeterDocument extends PowerMeter, Document {}

const PowerMeterSchema: Schema<PowerMeterDocument> =
  new Schema<PowerMeterDocument>({
    secret: {
      type: String,
      required: true,
      select: false,
    },
    consumer: {
      type: Schema.Types.ObjectId,
      ref: "Consumer",
      required: true,
    },
    lastSeen: {
      type: Date,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
  });

const PowerMeterModel: Model<PowerMeterDocument> =
  mongoose.model<PowerMeterDocument>("PowerMeter", PowerMeterSchema);

export default PowerMeterModel;
