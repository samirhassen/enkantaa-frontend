/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthState } from "./types";
import { LoginCredentials } from "../../../types";

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  user: null,
  loading: false,
  error: null,
  initializing: true,
};

const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, _action: PayloadAction<LoginCredentials>) => {
      state.error = null;
      state.loading = true;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ token: string; user: { name: string } }>
    ) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.error = null;
      state.loading = false;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.error = action.payload;
      state.loading = false;
    },
    logout: () => {
      // Saga will handle the actual logout
    },
    logoutSuccess: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.error = null;
    },
    initAuth: (state) => {
      // Saga will handle initialization
      state.initializing = true;
    },
    initSuccess: (state, action: PayloadAction<{ token: string }>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.initializing = false;
    },
    initComplete: (state) => {
      state.initializing = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const authActions = auth.actions;
export default auth.reducer;
