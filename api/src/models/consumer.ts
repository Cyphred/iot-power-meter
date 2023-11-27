import mongoose, { Document, Schema, Types, Model } from "mongoose";
import ApiError from "../errors/apiError.js";
import { ErrorCode } from "../errors/errorCodes.js";
import bcryptjs from "bcryptjs";

export interface Consumer {
  email: string;
  password: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  streetAddress: string;
  barangay: string;
  city: string;
  active: boolean;
}

export interface ConsumerDocument extends Consumer, Document {}

export interface IConsumerModel extends Model<ConsumerDocument> {
  signup(args: {
    email: string;
    password: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    streetAddress: string;
    barangay: string;
    city: string;
  }): Promise<ConsumerDocument>;
}

const ConsumerSchema: Schema<ConsumerDocument, IConsumerModel> = new Schema<
  ConsumerDocument,
  IConsumerModel
>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  streetAddress: { type: String, required: true },
  barangay: { type: String, required: true },
  city: { type: String, required: true },
  active: { type: Boolean, default: false },
});

ConsumerSchema.statics.signup = async function (args: {
  email: string;
  password: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  streetAddress: string;
  barangay: string;
  city: string;
}) {
  const {
    email,
    password,
    firstName,
    middleName,
    lastName,
    streetAddress,
    barangay,
    city,
  } = args;

  // Define model
  const ConsumerModel = this as Model<ConsumerDocument>;

  // Check if the email is already in use
  const existing = await ConsumerModel.count({ email });

  // Reject if the email is already in use
  if (existing) throw new ApiError(ErrorCode.EMAIL_ALREADY_IN_USE);

  // Fetch the number of salt rounds as definde in env
  const saltRounds = parseInt(process.env.SALT_ROUNDS);

  // Reject if salt rounds definition is invalid
  if (isNaN(saltRounds)) throw new ApiError(ErrorCode.MISSING_ENV_VALUE);

  // Hash and salt password
  const salt = await bcryptjs.genSalt(saltRounds);
  const hash = await bcryptjs.hash(password, salt);

  // Create the consumer account
  const consumer = await ConsumerModel.create({
    email,
    password: hash,
    firstName,
    middleName,
    lastName,
    streetAddress,
    barangay,
    city,
  });

  return consumer;
};

export const ConsumerModel: IConsumerModel = mongoose.model<
  ConsumerDocument,
  IConsumerModel
>("Consumer", ConsumerSchema);

export default ConsumerModel;
