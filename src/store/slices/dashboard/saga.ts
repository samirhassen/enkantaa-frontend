import { call, put, takeEvery, debounce, select } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import ApiService from "../../../services/ApiService";
import { dashboardActions } from "../../slices/dashboard";
import {
  Client,
  ChartDataPoint,
  ChartFilters,
  Statistics,
  ClientTableData,
  Building,
} from "../../../types";
import { getErrorMessage } from "../../../services/apiUtils";
import { selectDashboardFilters } from "./selector";
import { GetChartDataParams } from "./types";

function* fetchClientsSaga(action: PayloadAction<string | undefined>) {
  try {
    const response: { data: Client[] } = yield call(
      ApiService.getWithParams,
      "/api/clients",
      { searchKey: action.payload }
    );

    yield put(dashboardActions.fetchClientsSuccess(response.data));
  } catch (error: unknown) {
    console.error("Failed to fetch clients:", error);
    yield put(
      dashboardActions.fetchClientsFailure(
        getErrorMessage(error, "Failed to fetch clients")
      )
    );
  }
}

function* fetchBuildingsSaga(
  action: PayloadAction<{ clientId: string; searchKey: string }>
) {
  try {
    const { clientId, searchKey } = action.payload;

    if (!clientId) {
      yield put(dashboardActions.fetchBuildingsSuccess([]));
      return;
    }

    const response: { data: Building[] } = yield call(
      ApiService.getWithParams,
      `/api/dashboard/buildings`,
      { client: clientId, searchKey }
    );

    yield put(dashboardActions.fetchBuildingsSuccess(response?.data));
  } catch (error: unknown) {
    console.error("Failed to fetch buildings:", error);
    yield put(
      dashboardActions.fetchBuildingsFailure(
        getErrorMessage(error, "Failed to fetch buildings")
      )
    );
  }
}

function* fetchChartDataSaga(action: PayloadAction<ChartFilters>) {
  try {
    const { clientId, building, startDate, endDate } = action.payload || {};
    const selectedFilters: ChartFilters = yield select(selectDashboardFilters);
    const params: Partial<GetChartDataParams> = {};
    params.client = clientId || selectedFilters.clientId;
    params.building = building || selectedFilters.building;
    params.startDate = startDate || selectedFilters.startDate;
    params.endDate = endDate || selectedFilters.endDate;

    const response: { data: ChartDataPoint[] } = yield call(
      ApiService.getWithParams,
      "/api/dashboard",
      params
    );

    yield put(dashboardActions.fetchChartDataSuccess(response.data));
  } catch (error: unknown) {
    console.error("Failed to fetch chart data:", error);
    yield put(
      dashboardActions.fetchChartDataFailure(
        getErrorMessage(error, "Failed to fetch chart data")
      )
    );
  }
}

function* fetchStatisticsSaga() {
  try {
    const selectedFilters: ChartFilters = yield select(selectDashboardFilters);
    const response: { data: Statistics } = yield call(
      ApiService.getWithParams,
      "/api/stats",
      { client: selectedFilters.clientId, building: selectedFilters.building }
    );

    yield put(dashboardActions.fetchStatisticsSuccess(response.data));
  } catch (error: unknown) {
    console.error("Failed to fetch statistics:", error);
    yield put(
      dashboardActions.fetchStatisticsFailure(
        getErrorMessage(error, "Failed to fetch statistics")
      )
    );
  }
}

function* fetchTopPayingClientsSaga() {
  try {
    const response: { data: ClientTableData[] } = yield call(
      ApiService.get,
      "/api/dashboard/top-paying-clients"
    );

    yield put(dashboardActions.fetchTopPayingClientsSuccess(response.data));
  } catch (error: unknown) {
    console.error("Failed to fetch top paying clients:", error);
    yield put(
      dashboardActions.fetchTopPayingClientsFailure(
        getErrorMessage(error, "Failed to fetch top paying clients")
      )
    );
  }
}

function* fetchLeastPayingClientsSaga() {
  try {
    const response: { data: ClientTableData[] } = yield call(
      ApiService.get,
      "/api/dashboard/least-paying-clients"
    );

    yield put(dashboardActions.fetchLeastPayingClientsSuccess(response.data));
  } catch (error: unknown) {
    console.error("Failed to fetch least paying clients:", error);
    yield put(
      dashboardActions.fetchLeastPayingClientsFailure(
        getErrorMessage(error, "Failed to fetch least paying clients")
      )
    );
  }
}
function* updateStatisticsSaga(
  action: PayloadAction<
    Partial<Statistics> & { clientId?: string; building?: string }
  >
) {
  try {
    const { clientId, building, ...restPayload } = action.payload;
    const response: { data: Statistics } = yield call(
      ApiService.put,
      `/api/stats/${clientId}/${building}`,
      restPayload
    );

    yield put(dashboardActions.updateStatisticsSuccess(response.data));
  } catch (error: unknown) {
    console.error("Failed to update statistics:", error);
    yield put(
      dashboardActions.updateStatisticsFailure(
        getErrorMessage(error, "Failed to update statistics")
      )
    );
  }
}
export function* dashboardSaga() {
  yield debounce(300, dashboardActions.fetchClients.type, fetchClientsSaga);
  yield debounce(300, dashboardActions.fetchBuildings.type, fetchBuildingsSaga);
  yield takeEvery(dashboardActions.fetchChartData.type, fetchChartDataSaga);
  yield takeEvery(dashboardActions.fetchStatistics.type, fetchStatisticsSaga);
  yield takeEvery(dashboardActions.updateStatistics.type, updateStatisticsSaga);
  yield takeEvery(
    dashboardActions.fetchTopPayingClients.type,
    fetchTopPayingClientsSaga
  );
  yield takeEvery(
    dashboardActions.fetchLeastPayingClients.type,
    fetchLeastPayingClientsSaga
  );
}
