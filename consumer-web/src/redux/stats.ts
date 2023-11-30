import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface StatsState {
  currentConsumption: number;
  currentLoad: number;
  averageLoad: number;
  estimatedRate: number;
  estimatedBill: number;
}

const initialState: StatsState = {
  currentLoad: 0,
  averageLoad: 0,
  currentConsumption: 0,
  estimatedBill: 0,
  estimatedRate: 0,
};

export const statsSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {
    setStats: (state, action: PayloadAction<StatsState>) => {
      const {
        currentLoad,
        averageLoad,
        currentConsumption,
        estimatedBill,
        estimatedRate,
      } = action.payload;

      state.currentConsumption = currentConsumption;
      state.currentLoad = currentLoad;
      state.averageLoad = averageLoad;
      state.estimatedBill = estimatedBill;
      state.estimatedRate = estimatedRate;
    },
  },
});

export const { setStats } = statsSlice.actions;

export default statsSlice.reducer;
