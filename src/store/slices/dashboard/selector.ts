import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../index";
import { DashboardState } from "./types";

const selectDashboardState = (state: RootState) =>
  state.dashboard as DashboardState;

// ----------------------
// Primitive selectors
// ----------------------
// Export small, single-field selectors so components can subscribe to exactly what they need.
export const selectDashboardClients = (state: RootState) =>
  selectDashboardState(state).clients;

export const selectDashboardClientsLoading = (state: RootState) =>
  selectDashboardState(state).clientsLoading;

export const selectDashboardBuildings = (state: RootState) =>
  selectDashboardState(state).buildings;

export const selectDashboardBuildingsLoading = (state: RootState) =>
  selectDashboardState(state).buildingsLoading;

export const selectDashboardFilters = (state: RootState) =>
  selectDashboardState(state).filters;

export const selectDashboardChartData = (state: RootState) =>
  selectDashboardState(state).chartData;

export const selectDashboardChartLoading = (state: RootState) =>
  selectDashboardState(state).chartLoading;

export const selectDashboardChartError = (state: RootState) =>
  selectDashboardState(state).chartError;

export const selectDashboardTopPayingClients = (state: RootState) =>
  selectDashboardState(state).topPayingClients;

export const selectDashboardTopPayingClientsLoading = (state: RootState) =>
  selectDashboardState(state).topPayingClientsLoading;

export const selectDashboardTopPayingClientsError = (state: RootState) =>
  selectDashboardState(state).topPayingClientsError;

export const selectDashboardLeastPayingClients = (state: RootState) =>
  selectDashboardState(state).leastPayingClients;

export const selectDashboardLeastPayingClientsLoading = (state: RootState) =>
  selectDashboardState(state).leastPayingClientsLoading;

export const selectDashboardLeastPayingClientsError = (state: RootState) =>
  selectDashboardState(state).leastPayingClientsError;

export const selectDashboardStatistics = (state: RootState) =>
  selectDashboardState(state).statistics;

export const selectDashboardStatisticsLoading = (state: RootState) =>
  selectDashboardState(state).statisticsLoading;

export const selectDashboardStatisticsError = (state: RootState) =>
  selectDashboardState(state).statisticsError;

// ----------------------
// Composed (memoized) selectors
// ----------------------
// Keep a small set of convenience composed selectors built from the primitives.
// These are safe to use in components that need multiple fields at once.

export const selectDashboardOverview = createSelector(
  selectDashboardClients,
  selectDashboardClientsLoading,
  selectDashboardBuildings,
  selectDashboardBuildingsLoading,
  selectDashboardFilters,
  (clients, clientsLoading, buildings, buildingsLoading, filters) => ({
    clients,
    clientsLoading,
    buildings,
    buildingsLoading,
    filters,
  })
);

export const selectDashboardChart = createSelector(
  selectDashboardChartData,
  selectDashboardChartLoading,
  selectDashboardChartError,
  (chartData, chartLoading, chartError) => ({
    chartData,
    chartLoading,
    chartError,
  })
);

export const selectDashboardTopClients = createSelector(
  selectDashboardTopPayingClients,
  selectDashboardTopPayingClientsLoading,
  selectDashboardTopPayingClientsError,
  selectDashboardLeastPayingClients,
  selectDashboardLeastPayingClientsLoading,
  selectDashboardLeastPayingClientsError,
  (
    topPayingClients,
    topPayingClientsLoading,
    topPayingClientsError,
    leastPayingClients,
    leastPayingClientsLoading,
    leastPayingClientsError
  ) => ({
    topPayingClients,
    topPayingClientsLoading,
    topPayingClientsError,
    leastPayingClients,
    leastPayingClientsLoading,
    leastPayingClientsError,
  })
);

export const selectDashboardStats = createSelector(
  selectDashboardStatistics,
  selectDashboardStatisticsLoading,
  selectDashboardStatisticsError,
  (statistics, statisticsLoading, statisticsError) => ({
    statistics,
    statisticsLoading,
    statisticsError,
  })
);
