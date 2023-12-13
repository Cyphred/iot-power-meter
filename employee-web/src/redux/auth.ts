import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import IEmployee from "../types/Employee";

interface StorageToken {
  token?: string;
}

interface AuthState {
  user: IEmployee | null;
  token: string | null;
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
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IEmployee | null>) => {
      state.user = action.payload;
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
  },
});

export const { setUser, setToken } = authSlice.actions;

export default authSlice.reducer;
