import mongoose, { Schema, Document, Model } from "mongoose";

interface IRateBreakdown {
  description: string;
  amount: number;
}

export interface IRate {
  breakdown: IRateBreakdown[];
  ratePerKwh: number;
}

export interface IRateDocument extends IRate, Document {}

const rateSchema: Schema<IRateDocument> = new Schema<IRateDocument>(
  {
    ratePerKwh: {
      type: Number,
      required: true,
    },
    breakdown: {
      type: [
        {
          description: {
            type: String,
            required: true,
          },
          amount: {
            type: Number,
            required: true,
          },
        },
      ],
      required: true,
      validate: {
        validator: function (breakdown: IRateBreakdown[]) {
          let total = 0;
          for (const item of breakdown) {
            total += item.amount;
          }

          return total === this.ratePerKwh;
        },
        message: "Breakdown must tally with rate",
      },
    },
  },
  { timestamps: true }
);

const RateModel: Model<IRateDocument> = mongoose.model<IRateDocument>(
  "Rate",
  rateSchema
);

export default RateModel;
