/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  FetchInvoicesFiltersWithPagination,
  InvoicesState,
  FetchInvoicesFilters,
  FetchInvoiceClientsPayload,
} from "./types";
import { Client, Invoice, PaginatedResponse } from "../../../types";

const initialState: InvoicesState = {
  invoices: [],
  invoicesLoading: false,
  invoicesError: null,

  // Client filter initial state
  clients: [],
  clientsLoading: false,
  clientsError: null,
  filters: { client: undefined, endDate: undefined, startDate: undefined },

  // Pagination initial state
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  itemsPerPage: 10,
  hasNextPage: false,
  hasPrevPage: false,

  selectedInvoice: null,
  selectedInvoiceLoading: false,
  selectedInvoiceError: null,

  isDetailModalOpen: false,
};

const invoicesSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    // Client filter actions
    fetchInvoiceClients: (
      state,
      _action: PayloadAction<FetchInvoiceClientsPayload | undefined>
    ) => {
      state.clientsError = null;
      state.clientsLoading = true;
    },
    fetchInvoiceClientsSuccess: (state, action: PayloadAction<Client[]>) => {
      state.clients = action.payload;
      state.clientsError = null;
      state.clientsLoading = false;
    },
    fetchInvoiceClientsFailure: (state, action: PayloadAction<string>) => {
      state.clientsError = action.payload;
      state.clientsLoading = false;
    },
    setInvoiceClientsLoading: (state, action: PayloadAction<boolean>) => {
      state.clientsLoading = action.payload;
    },
    setFilter: (state, action: PayloadAction<FetchInvoicesFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
      // Reset to first page when filter changes
      state.currentPage = 1;
    },
    setFilterDates: (
      state,
      action: PayloadAction<{ startDate?: Date | null; endDate?: Date | null }>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1;
    },
    setSelectedClientId: (state, action: PayloadAction<string>) => {
      state.filters.client = action.payload;
      state.currentPage = 1;
    },
    resetInvoiceFilters: (state) => {
      state.filters = initialState.filters;
      state.currentPage = 1;
    },

    // Fetch all invoices
    fetchInvoices: (
      state,
      _action: PayloadAction<FetchInvoicesFiltersWithPagination | undefined>
    ) => {
      state.invoicesError = null;
      state.invoicesLoading = true;
    },
    fetchInvoicesSuccess: (
      state,
      action: PayloadAction<PaginatedResponse<Invoice>>
    ) => {
      state.invoices = action.payload.data;
      state.totalItems = action.payload.total;
      state.totalPages = Math.ceil(action.payload.total / state.itemsPerPage);
      state.hasNextPage = state.currentPage < state.totalPages;
      state.hasPrevPage = state.currentPage > 1;
      state.invoicesError = null;
      state.invoicesLoading = false;
    },
    fetchInvoicesFailure: (state, action: PayloadAction<string>) => {
      state.invoicesError = action.payload;
      state.invoicesLoading = false;
    },
    setInvoicesLoading: (state, action: PayloadAction<boolean>) => {
      state.invoicesLoading = action.payload;
    },

    // Pagination actions
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
      state.hasNextPage = action.payload < state.totalPages;
      state.hasPrevPage = action.payload > 1;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
      state.totalPages = Math.ceil(state.totalItems / action.payload);
      state.hasNextPage = state.currentPage < state.totalPages;
      state.hasPrevPage = state.currentPage > 1;
    },

    // Fetch single invoice
    fetchInvoiceById: (state, _action: PayloadAction<string>) => {
      state.selectedInvoiceError = null;
      state.selectedInvoiceLoading = true;
    },
    fetchInvoiceByIdSuccess: (state, action: PayloadAction<Invoice>) => {
      state.selectedInvoice = action.payload;
      state.selectedInvoiceError = null;
      state.selectedInvoiceLoading = false;
    },
    fetchInvoiceByIdFailure: (state, action: PayloadAction<string>) => {
      state.selectedInvoiceError = action.payload;
      state.selectedInvoiceLoading = false;
    },
    setSelectedInvoiceLoading: (state, action: PayloadAction<boolean>) => {
      state.selectedInvoiceLoading = action.payload;
    },

    // Modal controls
    openDetailModal: (state, _action: PayloadAction<string>) => {
      state.isDetailModalOpen = true;
    },
    closeDetailModal: (state) => {
      state.isDetailModalOpen = false;
      state.selectedInvoice = null;
      state.selectedInvoiceError = null;
    },
  },
});

export const invoicesActions = invoicesSlice.actions;
export default invoicesSlice.reducer;
