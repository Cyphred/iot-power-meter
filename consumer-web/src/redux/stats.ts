import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import IConsumptionReport from "../types/ConsumptionReport";

interface StatsState {
  consumption: IConsumptionReport | null;
}

const initialState: StatsState = {
  consumption: null,
};

export const statsSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {
    setConsumption: (
      state,
      action: PayloadAction<IConsumptionReport | null>
    ) => {
      state.consumption = action.payload;
    },
  },
});

export const { setConsumption } = statsSlice.actions;

export default statsSlice.reducer;
