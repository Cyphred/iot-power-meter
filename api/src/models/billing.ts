import mongoose, { Document, Schema, Model, Types } from "mongoose";

interface IBillingBreakdown {
  description: string;
  amount: number;
}

interface IBilling {
  start: Date;
  end: Date;
  consumption: number;
  rate: number;
  breakdown: IBillingBreakdown[];
  consumer: Types.ObjectId;
  dueDate: Date;
  disconnectionDate: Date;
}

export interface IBillingDocument extends IBilling, Document {}

const BillingSchema: Schema<IBillingDocument> = new Schema<IBillingDocument>(
  {
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
    consumption: {
      type: Number,
      required: true,
    },
    rate: {
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
      default: [],
    },
    consumer: {
      type: Schema.Types.ObjectId,
      ref: "Consumer",
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    disconnectionDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const BillingModel: Model<IBillingDocument> = mongoose.model<IBillingDocument>(
  "Billing",
  BillingSchema
);

export default BillingModel;
