import { ErrorCode } from "./errorCodes.js";

export default class ApiError extends Error {
    status: number;
    code: string;

    constructor(errorCode: ErrorCode = ErrorCode.GENERIC, status: number = 422) {
        super(errorCode.message);
        this.status = status;
        this.code = errorCode.code;
    }


}