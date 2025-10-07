export interface Client {
  _id: string;
  name: string;
  accountNumber: string;
}

export interface LoginCredentials {
  name: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    name: string;
  };
}

export interface ChartFilters {
  clientId: string;
  building: string;
  startDate?: Date | null;
  endDate?: Date | null;
}

export interface ChartDataPoint {
  date: string;
  totalSupplyCostCumulative: number;
  totalDeliveryCostCumulative: number;
  totalElectricCostCumulative: number;
  totalSupplyCost: number;
  totalDeliveryCost: number;
  totalElectricCost: number;
  totalDemandCost: number;
  totalConsumptionCost: number;
  totalDemandPrimary: number;
  totalEnergyUsage: number;
}

export interface Building {
  name: string;
}
export interface Statistics {
  totalEarnings?: number;
  totalSavings?: number;
  energyScore?: number;
}

export interface ClientTableData {
  totalAmount: number;
  _id: string;
  name: string;
  accountNumber: string;
}

export interface PaginationParams {
  page: number;
  perPage: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

export interface Invoice {
  _id: string;
  driveFileId: string;
  billingPeriod: {
    startDate: string;
    endDate: string;
    days: number;
  };
  demandPrimary: number;
  demandSupplyCost: number;
  energyUsage: number;
  demandDeliveryCost: number;
  energyDeliveryCost: number;
  systemBenefitChargeCost: number;
  totalDeliveryCost: number;
  totalSupplyCost: number;
  totalElectricCost: number;
  building: string;
  client: {
    _id: string;
    name: string;
    accountNumber: string;
  };
  createdAt: string;
  updatedAt: string;
}
