import { call, put, takeEvery, debounce } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import ApiService from "../../services/ApiService";
import { dashboardActions } from "../slices/dashboardSlice";
import {
  Client,
  ChartDataPoint,
  ChartFilters,
  Statistics,
  ClientTableData,
  Building,
} from "../../types";

function* fetchClientsSaga(action: PayloadAction<string>) {
  try {
    yield put(dashboardActions.setClientsLoading(true));

    const response: { data: Client[] } = yield call(
      ApiService.get,
      "/api/clients"
    );

    yield put(dashboardActions.fetchClientsSuccess(response.data));
  } catch (error: any) {
    console.error("Failed to fetch clients:", error);
    yield put(
      dashboardActions.fetchClientsFailure(
        error.response?.data?.message || "Failed to fetch clients"
      )
    );
  } finally {
    yield put(dashboardActions.setClientsLoading(false));
  }
}

function* fetchBuildingsSaga(
  action: PayloadAction<{ clientId: string; search: string }>
) {
  try {
    yield put(dashboardActions.setBuildingsLoading(true));

    const { clientId, search } = action.payload;

    if (!clientId) {
      yield put(dashboardActions.fetchBuildingsSuccess([]));
      return;
    }

    const response: { data: Building[] } = yield call(
      ApiService.get,
      `/api/dashboard/buildings?client=${clientId}`
    );

    yield put(
      dashboardActions.fetchBuildingsSuccess(
        response?.data?.map((item) => item?.name)
      )
    );
  } catch (error: any) {
    console.error("Failed to fetch buildings:", error);
    yield put(
      dashboardActions.fetchBuildingsFailure(
        error.response?.data?.message || "Failed to fetch buildings"
      )
    );
  } finally {
    yield put(dashboardActions.setBuildingsLoading(false));
  }
}

function* fetchChartDataSaga(action: PayloadAction<ChartFilters>) {
  try {
    yield put(dashboardActions.setChartLoading(true));

    const { clientId, building } = action.payload;
    const params = new URLSearchParams();

    // Only add params if they have values
    if (clientId) params.append("client", clientId);
    if (building) params.append("building", building);

    const response: { data: ChartDataPoint[] } = yield call(
      ApiService.get,
      `/api/dashboard/${params.toString() ? "?" + params.toString() : ""}`
    );

    console.log("Chart data response:", response.data);
    yield put(dashboardActions.fetchChartDataSuccess(response.data));
  } catch (error: any) {
    console.error("Failed to fetch chart data:", error);
    yield put(
      dashboardActions.fetchChartDataFailure(
        error.response?.data?.message || "Failed to fetch chart data"
      )
    );
  } finally {
    yield put(dashboardActions.setChartLoading(false));
  }
}

function* fetchStatisticsSaga() {
  try {
    yield put(dashboardActions.setStatisticsLoading(true));

    const response: { data: Statistics } = yield call(
      ApiService.get,
      "/api/dashboard/overall-stats"
    );

    yield put(dashboardActions.fetchStatisticsSuccess(response.data));
  } catch (error: any) {
    console.error("Failed to fetch statistics:", error);
    yield put(
      dashboardActions.fetchStatisticsFailure(
        error.response?.data?.message || "Failed to fetch statistics"
      )
    );
  } finally {
    yield put(dashboardActions.setStatisticsLoading(false));
  }
}

function* fetchTopPayingClientsSaga() {
  try {
    yield put(dashboardActions.setTopPayingClientsLoading(true));

    const response: { data: ClientTableData[] } = yield call(
      ApiService.get,
      "/api/dashboard/top-paying-clients"
    );

    yield put(dashboardActions.fetchTopPayingClientsSuccess(response.data));
  } catch (error: any) {
    console.error("Failed to fetch top paying clients:", error);
    yield put(
      dashboardActions.fetchTopPayingClientsFailure(
        error.response?.data?.message || "Failed to fetch top paying clients"
      )
    );
  } finally {
    yield put(dashboardActions.setTopPayingClientsLoading(false));
  }
}

function* fetchLeastPayingClientsSaga() {
  try {
    yield put(dashboardActions.setLeastPayingClientsLoading(true));

    const response: { data: ClientTableData[] } = yield call(
      ApiService.get,
      "/api/dashboard/least-paying-clients"
    );

    yield put(dashboardActions.fetchLeastPayingClientsSuccess(response.data));
  } catch (error: any) {
    console.error("Failed to fetch least paying clients:", error);
    yield put(
      dashboardActions.fetchLeastPayingClientsFailure(
        error.response?.data?.message || "Failed to fetch least paying clients"
      )
    );
  } finally {
    yield put(dashboardActions.setLeastPayingClientsLoading(false));
  }
}
export function* dashboardSaga() {
  yield debounce(300, dashboardActions.fetchClients.type, fetchClientsSaga);
  yield debounce(300, dashboardActions.fetchBuildings.type, fetchBuildingsSaga);
  yield takeEvery(dashboardActions.fetchChartData.type, fetchChartDataSaga);
  yield takeEvery(dashboardActions.fetchStatistics.type, fetchStatisticsSaga);
  yield takeEvery(
    dashboardActions.fetchTopPayingClients.type,
    fetchTopPayingClientsSaga
  );
  yield takeEvery(
    dashboardActions.fetchLeastPayingClients.type,
    fetchLeastPayingClientsSaga
  );
}
