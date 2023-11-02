export class ErrorCode {
  static readonly GENERIC = new ErrorCode("IOTPC9999", "Something went wrong");
  static readonly UNAUTHORIZED = new ErrorCode(
    "IOTPC0001",
    "User is not permitted to perform action"
  );
  static readonly METER_NOT_FOUND = new ErrorCode(
    "IOTPC0002",
    "Power meter does not exist"
  );
  static readonly INVALID_METER_SECRET = new ErrorCode(
    "IOTPC0003",
    "Power meter secret is invalid"
  );
  static readonly JWT_SECRET_NOT_DEFINED = new ErrorCode(
    "IOTPC0004",
    "JWT secret is not defined in local .env"
  );

  //to add, just increment the error code

  readonly code: string;
  readonly message: string;

  private constructor(code: string, message: string) {
    this.code = code;
    this.message = message;
  }
}
