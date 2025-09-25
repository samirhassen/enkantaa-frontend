import type { Invoice, Client, PaginationParams } from "../../../types";

// possible extension if we need to detach from original type
// Type InvoiceOverwrite = Invoice & { [key: string]: any };

export interface InvoicesState {
  invoices: Invoice[];
  invoicesLoading: boolean;
  invoicesError: string | null;

  clients: Client[];
  clientsLoading: boolean;
  clientsError: string | null;
  filters: FetchInvoicesFilters;

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
export interface FetchInvoicesFilters {
  client?: string;
  startDate?: Date | null;
  endDate?: Date | null;
}

export interface FetchInvoiceClientsPayload extends Partial<PaginationParams> {
  client?: string;
}

export interface FetchInvoicesFiltersWithPagination
  extends Partial<PaginationParams>,
    FetchInvoicesFilters {}
