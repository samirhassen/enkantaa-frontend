import {
  Client,
  ChartDataPoint,
  ChartFilters,
  Statistics,
  ClientTableData,
  Building,
} from "../../../types";

export interface DashboardState {
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

export interface GetChartDataParams {
  client: string | null;
  building: string | null;
  startDate: Date | null;
  endDate: Date | null;
}
