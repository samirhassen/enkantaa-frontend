import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LoginCredentials } from '../../types';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: { name: string } | null;
  loading: boolean;
  error: string | null;
  initializing: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  user: null,
  loading: false,
  error: null,
  initializing: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<LoginCredentials>) => {
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ token: string; user: { name: string } }>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.error = action.payload;
    },
    logout: (state) => {
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

export const authActions = authSlice.actions;
export default authSlice.reducer;