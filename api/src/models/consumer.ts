import mongoose, { Document, Schema, Types, Model } from "mongoose";

export interface Consumer {
  username: string;
  password: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  streetAddress: string;
  barangay: string;
  city: string;
}

export interface ConsumerDocument extends Consumer, Document {}

const ConsumerSchema: Schema<ConsumerDocument> = new Schema<ConsumerDocument>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  streetAddress: { type: String, required: true },
  barangay: { type: String, required: true },
  city: { type: String, required: true },
});

export const ConsumerModel: Model<ConsumerDocument> =
  mongoose.model<ConsumerDocument>("Consumer", ConsumerSchema);

export default ConsumerModel;
