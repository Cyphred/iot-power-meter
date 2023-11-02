import mongoose, { Document, Schema, Types, Model } from "mongoose";

export interface Employee {
  username: string;
  password: string;
  firstName: string;
  middleName?: string;
  lastName: string;
}

export interface EmployeeDocument extends Employee, Document {}

const EmployeeSchema: Schema<EmployeeDocument> = new Schema<EmployeeDocument>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
});

export const EmployeeModel: Model<EmployeeDocument> =
  mongoose.model<EmployeeDocument>("Employee", EmployeeSchema);

export default EmployeeModel;
