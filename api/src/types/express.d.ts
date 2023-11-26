import { Document, Types } from "mongoose";
import { PowerMeterDocument } from "../models/meter.ts";
import { ConsumerDocument } from "../models/consumer.ts";
import { EmployeeDocument } from "../models/employee.ts";

// For the inclusion of user data in Request objects,
// add the necessary fields under the Request interface definition

declare global {
  namespace Express {
    interface Request {
      meter?: Document<PowerMeterDocument>;
      consumer?: Document<ConsumerDocument>;
      employee?: Document<EmployeeDocument>;
    }
  }
}
