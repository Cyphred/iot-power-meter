import { Response } from "express";

export default function genericOkResponse(
  res: Response,
  body: any,
  message?: string
) {
  return res
    .status(200)
    .json({ status: 200, message: message ? message : "", body });
}
