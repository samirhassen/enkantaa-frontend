import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Client, ChartDataPoint, ChartFilters, Statistics, ClientTableData, Building } from '../../types';

interface DashboardState {
  clients: Client[];
  clientsLoading: boolean;
  clientsError: string | null;
  
  buildings: Building[];
  buildingsLoading: boolean;
  buildingsError: string | null;
  
  chartData: ChartDataPoint[];
  chartLoading: boolean;
  chartError: string | null;
  
  statistics: Statistics | null;
  statisticsLoading: boolean;
  statisticsError: string | null;
  
  topPayingClients: ClientTableData[];
  topPayingClientsLoading: boolean;
  topPayingClientsError: string | null;
  
  leastPayingClients: ClientTableData[];
  leastPayingClientsLoading: boolean;
  leastPayingClientsError: string | null;
  
  filters: ChartFilters;
}

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
    clientId: '',
    building: '',
  },
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    // Clients
    fetchClients: (state, action: PayloadAction<string>) => {
      state.clientsError = null;
    },
    fetchClientsSuccess: (state, action: PayloadAction<Client[]>) => {
      state.clients = action.payload;
      state.clientsError = null;
    },
    fetchClientsFailure: (state, action: PayloadAction<string>) => {
      state.clientsError = action.payload;
    },
    setClientsLoading: (state, action: PayloadAction<boolean>) => {
      state.clientsLoading = action.payload;
    },

    // Buildings
    fetchBuildings: (state, action: PayloadAction<{ clientId: string; search: string }>) => {
      state.buildingsError = null;
    },
    fetchBuildingsSuccess: (state, action: PayloadAction<string[]>) => {
      state.buildings = action.payload.map(name => ({ name }));
      state.buildingsError = null;
    },
    fetchBuildingsFailure: (state, action: PayloadAction<string>) => {
      state.buildingsError = action.payload;
    },
    setBuildingsLoading: (state, action: PayloadAction<boolean>) => {
      state.buildingsLoading = action.payload;
    },

    // Chart Data
    fetchChartData: (state, action: PayloadAction<ChartFilters>) => {
      state.chartError = null;
    },
    fetchChartDataSuccess: (state, action: PayloadAction<ChartDataPoint[]>) => {
      state.chartData = action.payload;
      state.chartError = null;
    },
    fetchChartDataFailure: (state, action: PayloadAction<string>) => {
      state.chartError = action.payload;
    },
    setChartLoading: (state, action: PayloadAction<boolean>) => {
      state.chartLoading = action.payload;
    },

    // Statistics
    fetchStatistics: (state) => {
      state.statisticsError = null;
    },
    fetchStatisticsSuccess: (state, action: PayloadAction<Statistics>) => {
      state.statistics = action.payload;
      state.statisticsError = null;
    },
    fetchStatisticsFailure: (state, action: PayloadAction<string>) => {
      state.statisticsError = action.payload;
    },
    setStatisticsLoading: (state, action: PayloadAction<boolean>) => {
      state.statisticsLoading = action.payload;
    },

    // Top Paying Clients
    fetchTopPayingClients: (state) => {
      state.topPayingClientsError = null;
    },
    fetchTopPayingClientsSuccess: (state, action: PayloadAction<ClientTableData[]>) => {
      state.topPayingClients = action.payload;
      state.topPayingClientsError = null;
    },
    fetchTopPayingClientsFailure: (state, action: PayloadAction<string>) => {
      state.topPayingClientsError = action.payload;
    },
    setTopPayingClientsLoading: (state, action: PayloadAction<boolean>) => {
      state.topPayingClientsLoading = action.payload;
    },

    // Least Paying Clients
    fetchLeastPayingClients: (state) => {
      state.leastPayingClientsError = null;
    },
    fetchLeastPayingClientsSuccess: (state, action: PayloadAction<ClientTableData[]>) => {
      state.leastPayingClients = action.payload;
      state.leastPayingClientsError = null;
    },
    fetchLeastPayingClientsFailure: (state, action: PayloadAction<string>) => {
      state.leastPayingClientsError = action.payload;
    },
    setLeastPayingClientsLoading: (state, action: PayloadAction<boolean>) => {
      state.leastPayingClientsLoading = action.payload;
    },
    // Filters
    setFilters: (state, action: PayloadAction<Partial<ChartFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = { clientId: '', building: '' };
      state.buildings = [];
      state.chartData = [];
    },
  },
});

export const dashboardActions = dashboardSlice.actions;
export default dashboardSlice.reducer;