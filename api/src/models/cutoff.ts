import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICutoff {
  cutoffDate: Date;
}

export interface ICutoffDocument extends ICutoff, Document {}

const cutoffSchema: Schema<ICutoffDocument> = new Schema<ICutoffDocument>(
  {
    cutoffDate: {
      type: Date,
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
