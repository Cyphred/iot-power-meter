export class ErrorCode {
  static readonly GENERIC = new ErrorCode("PT9999", "Something went wrong");
  static readonly UNAUTHORIZED = new ErrorCode(
    "IOTPC0001",
    "User is not permitted to perform action"
  );

  //to add, just increment the error code

  readonly code: string;
  readonly message: string;

  private constructor(code: string, message: string) {
    this.code = code;
    this.message = message;
  }
}
