import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ICutoff {
  cutoffDate: Date;
  rate: Types.ObjectId;
}

export interface ICutoffDocument extends ICutoff, Document {}

const cutoffSchema: Schema<ICutoffDocument> = new Schema<ICutoffDocument>(
  {
    cutoffDate: {
      type: Date,
      required: true,
    },
    rate: {
      type: Schema.Types.ObjectId,
      ref: "Rate",
      required: true,
    },
  },
  { timestamps: true }
);

const CutoffModel: Model<ICutoffDocument> = mongoose.model<ICutoffDocument>(
  "Cutoff",
  cutoffSchema
);

export default CutoffModel;
