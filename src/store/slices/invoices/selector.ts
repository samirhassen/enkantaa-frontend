import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../index";
import { InvoicesState } from "./types";

const selectInvoicesState = (state: RootState) =>
  state.invoices as InvoicesState;

// Primitive selectors
export const selectInvoicesList = (state: RootState) =>
  selectInvoicesState(state).invoices;

export const selectInvoicesLoading = (state: RootState) =>
  selectInvoicesState(state).invoicesLoading;

export const selectInvoicesError = (state: RootState) =>
  selectInvoicesState(state).invoicesError;

export const selectInvoiceClients = (state: RootState) =>
  selectInvoicesState(state).clients;

export const selectInvoiceClientsLoading = (state: RootState) =>
  selectInvoicesState(state).clientsLoading;

export const selectInvoiceClientsError = (state: RootState) =>
  selectInvoicesState(state).clientsError;

export const selectFilters = (state: RootState) =>
  selectInvoicesState(state).filters;

export const selectFilterStartDate = (state: RootState) =>
  selectInvoicesState(state).filters?.startDate;

export const selectFilterEndDate = (state: RootState) =>
  selectInvoicesState(state).filters?.endDate;

export const selectSelectedClientId = (state: RootState) =>
  selectInvoicesState(state).filters?.client;

export const selectCurrentPage = (state: RootState) =>
  selectInvoicesState(state).currentPage;

export const selectTotalPages = (state: RootState) =>
  selectInvoicesState(state).totalPages;

export const selectTotalItems = (state: RootState) =>
  selectInvoicesState(state).totalItems;

export const selectItemsPerPage = (state: RootState) =>
  selectInvoicesState(state).itemsPerPage;

export const selectHasNextPage = (state: RootState) =>
  selectInvoicesState(state).hasNextPage;

export const selectHasPrevPage = (state: RootState) =>
  selectInvoicesState(state).hasPrevPage;

export const selectSelectedInvoice = (state: RootState) =>
  selectInvoicesState(state).selectedInvoice;

export const selectSelectedInvoiceLoading = (state: RootState) =>
  selectInvoicesState(state).selectedInvoiceLoading;

export const selectSelectedInvoiceError = (state: RootState) =>
  selectInvoicesState(state).selectedInvoiceError;

export const selectIsDetailModalOpen = (state: RootState) =>
  selectInvoicesState(state).isDetailModalOpen;

// Composed selectors (convenience)
export const selectInvoicesOverview = createSelector(
  selectInvoicesList,
  selectInvoicesLoading,
  selectInvoicesError,
  selectInvoiceClients,
  selectInvoiceClientsLoading,
  selectInvoiceClientsError,
  selectSelectedClientId,
  selectCurrentPage,
  selectTotalPages,
  selectTotalItems,
  selectItemsPerPage,
  selectHasNextPage,
  selectHasPrevPage,
  (
    invoices,
    invoicesLoading,
    invoicesError,
    clients,
    clientsLoading,
    clientsError,
    selectedClientId,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNextPage,
    hasPrevPage
  ) => ({
    invoices,
    invoicesLoading,
    invoicesError,
    clients,
    clientsLoading,
    clientsError,
    selectedClientId,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNextPage,
    hasPrevPage,
  })
);

export const selectInvoicesDetail = createSelector(
  selectSelectedInvoice,
  selectSelectedInvoiceLoading,
  selectSelectedInvoiceError,
  selectIsDetailModalOpen,
  (
    selectedInvoice,
    selectedInvoiceLoading,
    selectedInvoiceError,
    isDetailModalOpen
  ) => ({
    selectedInvoice,
    selectedInvoiceLoading,
    selectedInvoiceError,
    isDetailModalOpen,
  })
);
