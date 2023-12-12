import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import IMeter from "../types/Meter";

interface MeterState {
  meter: IMeter | null;
}

const initialState: MeterState = {
  meter: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMeter: (state, action: PayloadAction<IMeter | null>) => {
      state.meter = action.payload;
    },
  },
});

export const { setMeter } = authSlice.actions;

export default authSlice.reducer;
