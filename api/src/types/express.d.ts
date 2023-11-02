import { Document, Types } from "mongoose";
import { PowerMeterDocument } from "../models/meter.ts";

// For the inclusion of user data in Request objects,
// add the necessary fields under the Request interface definition

declare global {
  namespace Express {
    interface Request {
      meter?: Document<unknown, {}, PowerMeterDocument> &
        Omit<
          PowerMeterDocument & {
            _id: Types.ObjectId;
          },
          never
        >;
    }
  }
}
