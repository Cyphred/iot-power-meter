import { Request, Response, NextFunction } from 'express';
import ApiError from './apiError.js';
import { ErrorCode } from './errorCodes.js';

export default (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let status: number = 200;
    let error: ApiError;
    if (!(err instanceof ApiError)) {
        console.error(ErrorCode.GENERIC.code, " | ", err)
        error = new ApiError(ErrorCode.GENERIC);
        status = 422;
    } else {
        error = err as ApiError;
        console.error(error.code, " | ", error.message)
    }

    return res.status(status)
        .send({ status: error.status, errorCode: error.code, message: error.message });
};

