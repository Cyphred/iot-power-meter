import dotenv from "dotenv";
import ApiError from "../errors/apiError.js";
import { ErrorCode } from "../errors/errorCodes.js";
import jwt from "jsonwebtoken";
dotenv.config();

export default function createToken(
  payload: object,
  expiry: string | undefined
): string {
  const secret = process.env.JWT_SECRET;

  // Reject if JWT secret not defined in .env
  if (!secret) throw new ApiError(ErrorCode.JWT_SECRET_NOT_DEFINED);

  if (!expiry) expiry = "1d";

  return jwt.sign(payload, secret, { expiresIn: expiry });
}
