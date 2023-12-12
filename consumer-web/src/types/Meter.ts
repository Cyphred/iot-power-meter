import { Dayjs } from "dayjs";

export default interface IMeter {
  _id: string;
  lastSeen: Dayjs;
  active: boolean;
}
