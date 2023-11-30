import { configureStore } from "@reduxjs/toolkit";

import authReducers from "./auth";

const store = configureStore({
  reducer: {
    auth: authReducers,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
