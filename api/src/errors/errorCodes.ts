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
  static readonly MISSING_AUTHENTICATION_TOKEN = new ErrorCode(
    "IOTPC0005",
    "Authentication token not provided"
  );
  static readonly MISSING_DATA_FROM_JWT = new ErrorCode(
    "IOTPC0006",
    "Expected data missing from token"
  );
  static readonly INVALID_ACCOUNT_TYPE = new ErrorCode(
    "IOTPC0007",
    "Invalid account type"
  );
  static readonly CONSUMER_NOT_FOUND = new ErrorCode(
    "IOTPC0008",
    "Consumer does not exist"
  );
  static readonly EMPLOYEE_NOT_FOUND = new ErrorCode(
    "IOTPC0009",
    "Employee does not exist"
  );
  static readonly EMAIL_ALREADY_IN_USE = new ErrorCode(
    "IOTPC0010",
    "Email already in use"
  );
  static readonly MISSING_ENV_VALUE = new ErrorCode(
    "IOTPC0011",
    "A required env variable was not set"
  );

  //to add, just increment the error code

  readonly code: string;
  readonly message: string;

  private constructor(code: string, message: string) {
    this.code = code;
    this.message = message;
  }
}
