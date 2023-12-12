import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import IConsumer from "../types/Consumer";

interface StorageToken {
  token?: string;
}

interface AuthState {
  user: IConsumer | null;
  token: string | null;
  meter: string | null;
}

function getUserFromLocalStorage() {
  const existingData = localStorage.getItem("userToken");
  if (!existingData) return null;

  try {
    const parsed = JSON.parse(existingData) as StorageToken;
    if (parsed.token?.length) return parsed.token;
    else return null;
  } catch (error) {
    return null;
  }
}

const initialState: AuthState = {
  user: null,
  token: getUserFromLocalStorage(),
  meter: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IConsumer | null>) => {
      state.user = action.payload;
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    setMeter: (state, action: PayloadAction<string | null>) => {
      state.meter = action.payload;
    },
  },
});

export const { setUser, setToken, setMeter } = authSlice.actions;

export default authSlice.reducer;
