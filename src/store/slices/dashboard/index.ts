/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type * as Shared from "../../../types";
import type { DashboardState } from "./types";

const initialState: DashboardState = {
  clients: [],
  clientsLoading: false,
  clientsError: null,

  buildings: [],
  buildingsLoading: false,
  buildingsError: null,

  chartData: [],
  chartLoading: false,
  chartError: null,

  statistics: null,
  statisticsLoading: false,
  statisticsError: null,

  topPayingClients: [],
  topPayingClientsLoading: false,
  topPayingClientsError: null,

  leastPayingClients: [],
  leastPayingClientsLoading: false,
  leastPayingClientsError: null,

  filters: {
    clientId: "",
    building: "",
    startDate: undefined,
    endDate: undefined,
  },
};

const dashboard = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    // Clients
    fetchClients: (state, _action: PayloadAction<string | undefined>) => {
      state.clientsError = null;
      state.clientsLoading = true;
    },
    fetchClientsSuccess: (state, action: PayloadAction<Shared.Client[]>) => {
      state.clients = action.payload;
      state.clientsError = null;
      state.clientsLoading = false;
    },
    fetchClientsFailure: (state, action: PayloadAction<string>) => {
      state.clientsError = action.payload;
      state.clientsLoading = false;
    },
    setClientsLoading: (state, action: PayloadAction<boolean>) => {
      state.clientsLoading = action.payload;
    },

    // Buildings
    fetchBuildings: (
      state,
      _action: PayloadAction<{ clientId: string; searchKey: string }>
    ) => {
      state.buildingsError = null;
      state.buildingsLoading = true;
    },
    fetchBuildingsSuccess: (
      state,
      action: PayloadAction<Shared.Building[]>
    ) => {
      state.buildingsError = null;
      state.buildingsLoading = false;
      state.buildings = action.payload;
    },
    fetchBuildingsFailure: (state, action: PayloadAction<string>) => {
      state.buildingsError = action.payload;
      state.buildingsLoading = false;
    },
    setBuildingsLoading: (state, action: PayloadAction<boolean>) => {
      state.buildingsLoading = action.payload;
    },

    // Chart Data
    fetchChartData: (
      state,
      _action: PayloadAction<Shared.ChartFilters | undefined>
    ) => {
      state.chartError = null;
      state.chartLoading = true;
    },
    fetchChartDataSuccess: (
      state,
      action: PayloadAction<Shared.ChartDataPoint[]>
    ) => {
      state.chartData = action.payload;
      state.chartError = null;
      state.chartLoading = false;
    },
    fetchChartDataFailure: (state, action: PayloadAction<string>) => {
      state.chartError = action.payload;
      state.chartLoading = false;
    },
    setChartLoading: (state, action: PayloadAction<boolean>) => {
      state.chartLoading = action.payload;
    },

    // Statistics
    fetchStatistics: (state) => {
      state.statisticsError = null;
      state.statisticsLoading = true;
    },
    fetchStatisticsSuccess: (
      state,
      action: PayloadAction<Shared.Statistics>
    ) => {
      state.statistics = action.payload;
      state.statisticsLoading = false;
      state.statisticsError = null;
    },
    fetchStatisticsFailure: (state, action: PayloadAction<string>) => {
      state.statisticsError = action.payload;
      state.statisticsLoading = false;
    },
    setStatisticsLoading: (state, action: PayloadAction<boolean>) => {
      state.statisticsLoading = action.payload;
    },
    updateStatistics: (
      state,
      _action: PayloadAction<
        Partial<Shared.Statistics> & { clientId?: string; building?: string }
      >
    ) => {
      state.statisticsError = null;
      state.statisticsLoading = true;
    },
    updateStatisticsSuccess: (
      state,
      action: PayloadAction<Shared.Statistics>
    ) => {
      state.statistics = action.payload;
      state.statisticsLoading = false;
      state.statisticsError = null;
    },
    updateStatisticsFailure: (state, action: PayloadAction<string>) => {
      state.statisticsError = action.payload;
      state.statisticsLoading = false;
    },

    // Top Paying Clients
    fetchTopPayingClients: (state) => {
      state.topPayingClientsError = null;
      state.topPayingClientsLoading = true;
    },
    fetchTopPayingClientsSuccess: (
      state,
      action: PayloadAction<Shared.ClientTableData[]>
    ) => {
      state.topPayingClients = action.payload;
      state.topPayingClientsError = null;
      state.topPayingClientsLoading = false;
    },
    fetchTopPayingClientsFailure: (state, action: PayloadAction<string>) => {
      state.topPayingClientsError = action.payload;
      state.topPayingClientsLoading = false;
    },
    setTopPayingClientsLoading: (state, action: PayloadAction<boolean>) => {
      state.topPayingClientsLoading = action.payload;
    },

    // Least Paying Clients
    fetchLeastPayingClients: (state) => {
      state.leastPayingClientsError = null;
      state.leastPayingClientsLoading = true;
    },
    fetchLeastPayingClientsSuccess: (
      state,
      action: PayloadAction<Shared.ClientTableData[]>
    ) => {
      state.leastPayingClients = action.payload;
      state.leastPayingClientsError = null;
      state.leastPayingClientsLoading = false;
    },
    fetchLeastPayingClientsFailure: (state, action: PayloadAction<string>) => {
      state.leastPayingClientsError = action.payload;
      state.leastPayingClientsLoading = false;
    },
    setLeastPayingClientsLoading: (state, action: PayloadAction<boolean>) => {
      state.leastPayingClientsLoading = action.payload;
    },
    // Filters
    setFilters: (
      state,
      action: PayloadAction<Partial<Shared.ChartFilters>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const dashboardActions = dashboard.actions;
export default dashboard.reducer;
