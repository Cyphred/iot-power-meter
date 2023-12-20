export default interface IRate {
  ratePerKwh: number;
  breakdown: {
    description: string;
    amount: number;
    _id: string;
  }[];
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
