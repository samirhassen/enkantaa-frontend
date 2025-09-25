import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../index";
import { AuthState } from "./types";

const selectAuthState = (state: RootState) => state.auth as AuthState;

// Primitive selectors
export const selectAuthIsAuthenticated = (state: RootState) =>
  selectAuthState(state).isAuthenticated;

export const selectAuthInitializing = (state: RootState) =>
  selectAuthState(state).initializing;

export const selectAuthLoading = (state: RootState) =>
  selectAuthState(state).loading;

export const selectAuthError = (state: RootState) =>
  selectAuthState(state).error;

// Composed selector (convenience)
export const selectAuth = createSelector(
  selectAuthIsAuthenticated,
  selectAuthInitializing,
  selectAuthLoading,
  selectAuthError,
  (isAuthenticated, initializing, loading, error) => ({
    isAuthenticated,
    initializing,
    loading,
    error,
  })
);
