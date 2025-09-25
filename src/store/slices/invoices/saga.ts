import { call, put, takeEvery, select } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import ApiService from "../../../services/ApiService";
import { invoicesActions } from "../../slices/invoices";
import { selectFilters } from "./selector";
import { Invoice, PaginatedResponse, Client } from "../../../types";
import { getErrorMessage } from "../../../services/apiUtils";
import {
  FetchInvoiceClientsPayload,
  FetchInvoicesFiltersWithPagination,
} from "./types";

function* fetchInvoiceClientsSaga(
  action: PayloadAction<FetchInvoiceClientsPayload>
) {
  try {
    const { page, perPage, client } = action.payload;
    const response: { data: Client[] } = yield call(
      ApiService.getWithParams,
      "/api/clients",
      { page, perPage, client }
    );

    yield put(invoicesActions.fetchInvoiceClientsSuccess(response.data));
  } catch (error: unknown) {
    console.error("Failed to fetch invoice clients:", error);
    yield put(
      invoicesActions.fetchInvoiceClientsFailure(
        getErrorMessage(error, "Failed to fetch clients")
      )
    );
  }
}

function* fetchInvoicesSaga(
  action: PayloadAction<FetchInvoicesFiltersWithPagination>
) {
  try {
    const { page, perPage, client, endDate, startDate } = action.payload;
    // read filter state from redux (preferred source-of-truth)
    const filters: ReturnType<typeof selectFilters> = yield select(
      selectFilters
    );
    const startDateFilter = startDate || filters?.startDate;

    const params: Record<string, string | number | Date | null | undefined> = {
      page,
      perPage,
      client: client || filters?.client,
      startDate: startDateFilter,
      endDate: endDate || filters?.endDate || (startDateFilter && new Date()),
    };

    const response: { data: PaginatedResponse<Invoice> } = yield call(
      ApiService.getWithParams,
      "/api/invoices",
      params
    );

    yield put(invoicesActions.fetchInvoicesSuccess(response.data));
  } catch (error: unknown) {
    console.error("Failed to fetch invoices:", error);
    yield put(
      invoicesActions.fetchInvoicesFailure(
        getErrorMessage(error, "Failed to fetch invoices")
      )
    );
  }
}

function* fetchInvoiceByIdSaga(action: PayloadAction<string>) {
  try {
    const response: { data: Invoice } = yield call(
      ApiService.get,
      `/api/invoices/${action.payload}`
    );

    yield put(invoicesActions.fetchInvoiceByIdSuccess(response.data));
  } catch (error: unknown) {
    console.error("Failed to fetch invoice:", error);
    yield put(
      invoicesActions.fetchInvoiceByIdFailure(
        getErrorMessage(error, "Failed to fetch invoice details")
      )
    );
  }
}

function* openDetailModalSaga(action: PayloadAction<string>) {
  yield put(invoicesActions.fetchInvoiceById(action.payload));
}

export function* invoicesSaga() {
  yield takeEvery(
    invoicesActions.fetchInvoiceClients.type,
    fetchInvoiceClientsSaga
  );
  yield takeEvery(invoicesActions.fetchInvoices.type, fetchInvoicesSaga);
  yield takeEvery(invoicesActions.fetchInvoiceById.type, fetchInvoiceByIdSaga);
  yield takeEvery(invoicesActions.openDetailModal.type, openDetailModalSaga);
}
