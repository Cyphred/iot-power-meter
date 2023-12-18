export interface IBillingBreakdown {
  description: string;
  amount: number;
}

export default interface IBilling {
  start: string;
  end: string;
  consumption: number;
  rate: number;
  breakdown: IBillingBreakdown[];
  consumer: string;
  dueDate: string;
  disconnectionDate: string;
}
