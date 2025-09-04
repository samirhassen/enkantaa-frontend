import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Invoice, PaginationParams, PaginatedResponse } from '../../types';

interface InvoicesState {
  invoices: Invoice[];
  invoicesLoading: boolean;
  invoicesError: string | null;
  
  // Client filter
  clients: Client[];
  clientsLoading: boolean;
  clientsError: string | null;
  selectedClientId: string;
  
  // Pagination state
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  
  selectedInvoice: Invoice | null;
  selectedInvoiceLoading: boolean;
  selectedInvoiceError: string | null;
  
  isDetailModalOpen: boolean;
}

const initialState: InvoicesState = {
  invoices: [],
  invoicesLoading: false,
  invoicesError: null,
  
  // Client filter initial state
  clients: [],
  clientsLoading: false,
  clientsError: null,
  selectedClientId: '',
  
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
  name: 'invoices',
  initialState,
  reducers: {
    // Client filter actions
    fetchInvoiceClients: (state, action: PayloadAction<string>) => {
      state.clientsError = null;
    },
    fetchInvoiceClientsSuccess: (state, action: PayloadAction<Client[]>) => {
      state.clients = action.payload;
      state.clientsError = null;
    },
    fetchInvoiceClientsFailure: (state, action: PayloadAction<string>) => {
      state.clientsError = action.payload;
    },
    setInvoiceClientsLoading: (state, action: PayloadAction<boolean>) => {
      state.clientsLoading = action.payload;
    },
    setSelectedClientId: (state, action: PayloadAction<string>) => {
      state.selectedClientId = action.payload;
      // Reset to first page when client filter changes
      state.currentPage = 1;
    },
    resetInvoiceFilters: (state) => {
      state.selectedClientId = '';
      state.currentPage = 1;
    },

    // Fetch all invoices
    fetchInvoices: (state, action: PayloadAction<PaginationParams & { clientId?: string }>) => {
      state.invoicesError = null;
    },
    fetchInvoicesSuccess: (state, action: PayloadAction<PaginatedResponse<Invoice>>) => {
      state.invoices = action.payload.data;
      state.totalItems = action.payload.total;
      state.totalPages = Math.ceil(action.payload.total / state.itemsPerPage);
      state.hasNextPage = state.currentPage < state.totalPages;
      state.hasPrevPage = state.currentPage > 1;
      state.invoicesError = null;
    },
    fetchInvoicesFailure: (state, action: PayloadAction<string>) => {
      state.invoicesError = action.payload;
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
    fetchInvoiceById: (state, action: PayloadAction<string>) => {
      state.selectedInvoiceError = null;
    },
    fetchInvoiceByIdSuccess: (state, action: PayloadAction<Invoice>) => {
      state.selectedInvoice = action.payload;
      state.selectedInvoiceError = null;
    },
    fetchInvoiceByIdFailure: (state, action: PayloadAction<string>) => {
      state.selectedInvoiceError = action.payload;
    },
    setSelectedInvoiceLoading: (state, action: PayloadAction<boolean>) => {
      state.selectedInvoiceLoading = action.payload;
    },

    // Modal controls
    openDetailModal: (state, action: PayloadAction<string>) => {
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