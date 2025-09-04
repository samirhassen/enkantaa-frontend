import { call, put, takeEvery } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import ApiService from "../../services/ApiService";
import { invoicesActions } from "../slices/invoicesSlice";
import { Invoice, PaginationParams, PaginatedResponse, Client } from "../../types";

function* fetchInvoiceClientsSaga(action: PayloadAction<string>) {
  try {
    yield put(invoicesActions.setInvoiceClientsLoading(true));

    const response: { data: Client[] } = yield call(
      ApiService.get,
      "/api/clients"
    );

    yield put(invoicesActions.fetchInvoiceClientsSuccess(response.data));
  } catch (error: any) {
    console.error("Failed to fetch invoice clients:", error);
    yield put(
      invoicesActions.fetchInvoiceClientsFailure(
        error.response?.data?.message || "Failed to fetch clients"
      )
    );
  } finally {
    yield put(invoicesActions.setInvoiceClientsLoading(false));
  }
}

function* fetchInvoicesSaga(action: PayloadAction<PaginationParams & { clientId?: string }>) {
  try {
    yield put(invoicesActions.setInvoicesLoading(true));

    const { page, perPage, clientId } = action.payload;
    const params = new URLSearchParams({
      page: page.toString(),
      perPage: perPage.toString(),
    });
    
    if (clientId) {
      params.append("client", clientId);
    }

    const response: { data: PaginatedResponse<Invoice> } = yield call(
      ApiService.get,
      `/api/invoices?${params.toString()}`
    );

    yield put(invoicesActions.fetchInvoicesSuccess(response.data));
  } catch (error: any) {
    console.error("Failed to fetch invoices:", error);
    yield put(
      invoicesActions.fetchInvoicesFailure(
        error.response?.data?.message || "Failed to fetch invoices"
      )
    );
  } finally {
    yield put(invoicesActions.setInvoicesLoading(false));
  }
}

function* fetchInvoiceByIdSaga(action: PayloadAction<string>) {
  try {
    yield put(invoicesActions.setSelectedInvoiceLoading(true));

    const response: { data: Invoice } = yield call(
      ApiService.get,
      `/api/invoices/${action.payload}`
    );

    yield put(invoicesActions.fetchInvoiceByIdSuccess(response.data));
  } catch (error: any) {
    console.error("Failed to fetch invoice:", error);
    yield put(
      invoicesActions.fetchInvoiceByIdFailure(
        error.response?.data?.message || "Failed to fetch invoice details"
      )
    );
  } finally {
    yield put(invoicesActions.setSelectedInvoiceLoading(false));
  }
}

function* openDetailModalSaga(action: PayloadAction<string>) {
  yield put(invoicesActions.fetchInvoiceById(action.payload));
}

export function* invoicesSaga() {
  yield takeEvery(invoicesActions.fetchInvoiceClients.type, fetchInvoiceClientsSaga);
  yield takeEvery(invoicesActions.fetchInvoices.type, fetchInvoicesSaga);
  yield takeEvery(invoicesActions.fetchInvoiceById.type, fetchInvoiceByIdSaga);
  yield takeEvery(invoicesActions.openDetailModal.type, openDetailModalSaga);
}