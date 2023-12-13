import mongoose, { Document, Schema, Types, Model } from "mongoose";
import bcryptjs from "bcryptjs";
import ApiError from "../errors/apiError.js";
import { ErrorCode } from "../errors/errorCodes.js";

export interface Employee {
  email: string;
  password: string;
  firstName: string;
  middleName?: string;
  lastName: string;
}

export interface EmployeeDocument extends Employee, Document {}

export interface IEmployeeModel extends Model<EmployeeDocument> {
  signup(args: {
    email: string;
    password: string;
    firstName: string;
    middleName?: string;
    lastName: string;
  }): Promise<EmployeeDocument>;
}

const EmployeeSchema: Schema<EmployeeDocument, IEmployeeModel> = new Schema<
  EmployeeDocument,
  IEmployeeModel
>({
  email: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
});

EmployeeSchema.statics.signup = async function (args: {
  email: string;
  password: string;
  firstName: string;
  middleName?: string;
  lastName: string;
}) {
  const { email, password, firstName, middleName, lastName } = args;

  // Define model
  const EmployeeModel = this as Model<EmployeeDocument>;

  // Check if the email is already in use
  const existing = await EmployeeModel.countDocuments({ email });

  // Reject if the email is already in use
  if (existing) throw new ApiError(ErrorCode.EMAIL_ALREADY_IN_USE);

  // Fetch the number of salt rounds as definde in env
  const saltRounds = parseInt(process.env.SALT_ROUNDS);

  // Reject if salt rounds definition is invalid
  if (isNaN(saltRounds)) throw new ApiError(ErrorCode.MISSING_ENV_VALUE);

  // Hash and salt password
  const salt = await bcryptjs.genSalt(saltRounds);
  const hash = await bcryptjs.hash(password, salt);

  // Create the employee account
  const employee = await EmployeeModel.create({
    email,
    password: hash,
    firstName,
    middleName,
    lastName,
  });

  return employee;
};

export const EmployeeModel: IEmployeeModel = mongoose.model<
  EmployeeDocument,
  IEmployeeModel
>("Employee", EmployeeSchema);

export default EmployeeModel;
