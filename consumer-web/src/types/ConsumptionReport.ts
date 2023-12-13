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
    rightNow: number;
  };
  ratePerKwh: number;
  rateBreakdown: {
    description: string;
    amount: number;
  }[];
}
