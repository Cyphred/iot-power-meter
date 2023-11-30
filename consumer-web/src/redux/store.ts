import { configureStore } from "@reduxjs/toolkit";

import authReducers from "./auth";
import statsReducers from "./stats";

const store = configureStore({
  reducer: {
    auth: authReducers,
    stats: statsReducers,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
