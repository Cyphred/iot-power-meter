import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Dayjs } from "dayjs";

interface MeterState {
  _id: string | null;
  lastSeen: Dayjs | null;
}

const initialState: MeterState = {
  _id: null,
  lastSeen: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMeterId: (state, action: PayloadAction<string | null>) => {
      state._id = action.payload;
    },
    setLastSeen: (state, action: PayloadAction<Dayjs | null>) => {
      state.lastSeen = action.payload;
    },
  },
});

export const { setMeterId, setLastSeen } = authSlice.actions;

export default authSlice.reducer;
