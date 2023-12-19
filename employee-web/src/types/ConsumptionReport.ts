export default interface IConsumptionReport {
  lastCutoff: string;
  meter: {
    _id: string;
    lastSeen: string;
    active: boolean;
  };
  consumption: {
    sinceCutoff: number;
    averageDaily: number;
    rightNow?: {
      value: number;
      timestamp: string;
    };
  };
  ratePerKwh: number;
  rateBreakdown: IRateBreakdown[];
}

export interface IRateBreakdown {
  description: string;
  amount: number;
}
