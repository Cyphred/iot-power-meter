export default interface IApiResponse {
  status: number;
  message: string;
  errorCode?: string;
  body: unknown;
}
