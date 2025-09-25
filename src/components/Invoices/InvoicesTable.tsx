import React from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
  Alert,
  TablePagination,
  IconButton,
  CircularProgress,
} from "@mui/material";
import styled from "@emotion/styled";
import { FileText, Calendar, Building, Download } from "lucide-react";
import { useAppSelector, useAppDispatch } from "../../hooks/redux";
import { invoicesActions } from "../../store/slices/invoices";
import {
  selectInvoicesList,
  selectInvoicesLoading,
  selectInvoicesError,
  selectTotalItems,
  selectItemsPerPage,
  selectSelectedClientId,
  selectCurrentPage,
} from "../../store/slices/invoices/selector";
import { Invoice } from "../../types";

const TablePaper = styled(Paper)`
  padding: 0px 16px 16px 16px;
  border-radius: 16px;
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid rgba(0, 163, 224, 0.08);
  border-top: none;
  box-shadow: 0 4px 20px rgba(0, 163, 224, 0.06);
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(0, 163, 224, 0.15);
    border-top: none;
  }
`;

const StyledTableContainer = styled(TableContainer)`
  border-radius: 8px;
  box-shadow: none;
  border: 1px solid rgba(0, 0, 0, 0.06);
  overflow: hidden;
`;

const StyledTableHead = styled(TableHead)`
  background: linear-gradient(135deg, #00a3e0 0%, #0288d1 100%);

  & .MuiTableCell-head {
    color: #ffffff;
    font-weight: 600;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    border-bottom: none;
    padding: 12px 16px;
    position: relative;

    &:not(:last-child)::after {
      content: "";
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      height: 16px;
      width: 1px;
      background: rgba(255, 255, 255, 0.2);
    }
  }
`;

const StyledTableRow = styled(TableRow)`
  background-color: white;
  border-bottom: 1px solid rgba(0, 163, 224, 0.08);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(0, 163, 224, 0.04);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 163, 224, 0.1);
  }

  &:last-child {
    border-bottom: none;
  }

  & .MuiTableCell-root {
    border-bottom: none;
    padding: 10px 16px;
    font-size: 0.8rem;
    vertical-align: middle;
  }
`;

const SkeletonRow = styled(TableRow)`
  background-color: white;
  border-bottom: 1px solid rgba(0, 163, 224, 0.08);
  animation: pulse 1.5s ease-in-out infinite;

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
      background-color: rgba(248, 250, 252, 0.8);
    }
    50% {
      opacity: 0.7;
      background-color: rgba(226, 232, 240, 0.9);
    }
  }

  & .MuiTableCell-root {
    border-bottom: none;
    padding: 10px 16px;
    vertical-align: middle;
  }
`;

const TableHeader = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 24px 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0, 163, 224, 0.12);
`;

const HeaderLeft = styled(Box)`
  display: flex;
  align-items: center;
`;

const HeaderRight = styled(Box)`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const InvoicesTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const invoices = useAppSelector(selectInvoicesList);
  const invoicesLoading = useAppSelector(selectInvoicesLoading);
  const invoicesError = useAppSelector(selectInvoicesError);
  const totalItems = useAppSelector(selectTotalItems);
  const itemsPerPage = useAppSelector(selectItemsPerPage);
  const selectedClientId = useAppSelector(selectSelectedClientId);
  const currentPage = useAppSelector(selectCurrentPage);

  const [downloadingIds, setDownloadingIds] = React.useState<Set<string>>(
    new Set()
  );

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleRowClick = (invoice: Invoice) => {
    dispatch(invoicesActions.openDetailModal(invoice._id));
  };

  const handleDownload = async (invoiceId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent row click when download button is clicked

    // Add invoice ID to downloading set
    setDownloadingIds((prev) => new Set(prev).add(invoiceId));

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/invoices/download/${invoiceId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Download failed");
      }

      // Get the filename from the response headers or use a default
      const contentDisposition = response.headers.get("content-disposition");
      let filename = `invoice-${invoiceId}.pdf`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      // You could add a toast notification here for better UX
    } finally {
      // Remove invoice ID from downloading set
      setDownloadingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(invoiceId);
        return newSet;
      });
    }
  };
  const handlePageChange = (_event: unknown, newPage: number) => {
    const page = newPage + 1; // Material-UI uses 0-based indexing, but our API uses 1-based
    dispatch(invoicesActions.setCurrentPage(page));
    dispatch(
      invoicesActions.fetchInvoices({
        page,
        perPage: itemsPerPage,
        clientId: selectedClientId,
      })
    );
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newPerPage = parseInt(event.target.value, 10);
    dispatch(invoicesActions.setItemsPerPage(newPerPage));
    dispatch(invoicesActions.setCurrentPage(1)); // Reset to first page
    dispatch(
      invoicesActions.fetchInvoices({
        page: 1,
        perPage: newPerPage,
        clientId: selectedClientId,
      })
    );
  };

  const renderSkeletonRows = () => (
    <>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((index) => (
        <SkeletonRow key={index}>
          <TableCell>
            <Skeleton
              variant="text"
              width="80%"
              height={20}
              sx={{
                bgcolor: "rgba(0, 163, 224, 0.15)",
                animation: `wave 1.6s linear ${index * 0.1}s infinite`,
                borderRadius: "4px",
              }}
            />
          </TableCell>
          <TableCell>
            <Skeleton
              variant="text"
              width="90%"
              height={20}
              sx={{
                bgcolor: "rgba(0, 163, 224, 0.12)",
                animation: `wave 1.6s linear ${index * 0.1 + 0.1}s infinite`,
                borderRadius: "4px",
              }}
            />
          </TableCell>
          <TableCell>
            <Skeleton
              variant="text"
              width="70%"
              height={20}
              sx={{
                bgcolor: "rgba(0, 163, 224, 0.18)",
                animation: `wave 1.6s linear ${index * 0.1 + 0.2}s infinite`,
                borderRadius: "4px",
              }}
            />
          </TableCell>
          <TableCell>
            <Skeleton
              variant="text"
              width="85%"
              height={20}
              sx={{
                bgcolor: "rgba(0, 163, 224, 0.1)",
                animation: `wave 1.6s linear ${index * 0.1 + 0.3}s infinite`,
                borderRadius: "4px",
              }}
            />
          </TableCell>
          <TableCell align="right">
            <Skeleton
              variant="text"
              width="60%"
              height={20}
              sx={{
                bgcolor: "rgba(0, 163, 224, 0.2)",
                animation: `wave 1.6s linear ${index * 0.1 + 0.4}s infinite`,
                borderRadius: "4px",
              }}
            />
          </TableCell>
          <TableCell align="center">
            <Skeleton
              variant="circular"
              width={32}
              height={32}
              sx={{
                bgcolor: "rgba(0, 163, 224, 0.15)",
                animation: `wave 1.6s linear ${index * 0.1 + 0.5}s infinite`,
              }}
            />
          </TableCell>
        </SkeletonRow>
      ))}
    </>
  );

  if (invoicesError) {
    return (
      <TablePaper elevation={1}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {invoicesError}
        </Alert>
      </TablePaper>
    );
  }

  return (
    <TablePaper elevation={1}>
      <TableHeader>
        <HeaderLeft>
          <FileText color="#00A3E0" size={20} style={{ marginRight: 8 }} />
          <Typography
            variant="h6"
            color="primary"
            sx={{
              fontWeight: 600,
              fontSize: "1.1rem",
              letterSpacing: "-0.01em",
            }}
          >
            Documents
          </Typography>
        </HeaderLeft>
        <HeaderRight>
          <Typography
            variant="body2"
            sx={{
              color: "#64748b",
              fontWeight: 500,
              fontSize: "0.8rem",
            }}
          >
            {invoicesLoading ? "Loading..." : `${totalItems} total`}
          </Typography>
        </HeaderRight>
      </TableHeader>

      <StyledTableContainer>
        <Table>
          <StyledTableHead>
            <TableRow>
              <TableCell>Client</TableCell>
              <TableCell>Building</TableCell>
              <TableCell>Billing Period</TableCell>
              <TableCell>Energy Usage</TableCell>
              <TableCell align="right">Total Cost</TableCell>
              <TableCell align="center">Download</TableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {invoicesLoading ? (
              renderSkeletonRows()
            ) : invoices.length > 0 ? (
              invoices.map((invoice) => (
                <StyledTableRow
                  key={invoice._id}
                  onClick={() => handleRowClick(invoice)}
                >
                  <TableCell>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: "#2d3748",
                          fontSize: "0.8rem",
                          mb: 0.5,
                        }}
                      >
                        {invoice.client.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#718096",
                          fontFamily:
                            '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace',
                          fontSize: "0.7rem",
                        }}
                      >
                        {invoice.client.accountNumber}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Building
                        size={14}
                        color="#64748b"
                        style={{ marginRight: 6 }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#4a5568",
                          fontSize: "0.8rem",
                          fontWeight: 500,
                        }}
                      >
                        {invoice.building}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Calendar
                        size={14}
                        color="#64748b"
                        style={{ marginRight: 6 }}
                      />
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#4a5568",
                            fontSize: "0.8rem",
                            fontWeight: 500,
                          }}
                        >
                          {formatDate(invoice.billingPeriod.startDate)} -{" "}
                          {formatDate(invoice.billingPeriod.endDate)}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#718096",
                            fontSize: "0.7rem",
                          }}
                        >
                          {invoice.billingPeriod.days} days
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: "#2d3748",
                        fontSize: "0.8rem",
                      }}
                    >
                      {invoice.energyUsage.toLocaleString()} kWh
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        color: "#00A3E0",
                        fontSize: "0.85rem",
                      }}
                    >
                      {formatCurrency(invoice.totalElectricCost)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={(e) => handleDownload(invoice._id, e)}
                      disabled={downloadingIds.has(invoice._id)}
                      size="small"
                      sx={{
                        backgroundColor: "rgba(0, 163, 224, 0.1)",
                        color: "#00A3E0",
                        border: "1px solid rgba(0, 163, 224, 0.2)",
                        width: 32,
                        height: 32,
                        transition: "all 0.2s ease",
                        "&:hover:not(:disabled)": {
                          backgroundColor: "rgba(0, 163, 224, 0.2)",
                          borderColor: "rgba(0, 163, 224, 0.4)",
                          transform: "translateY(-1px)",
                          boxShadow: "0 4px 12px rgba(0, 163, 224, 0.2)",
                        },
                        "&:disabled": {
                          backgroundColor: "rgba(0, 163, 224, 0.05)",
                          color: "rgba(0, 163, 224, 0.5)",
                          borderColor: "rgba(0, 163, 224, 0.1)",
                        },
                      }}
                    >
                      {downloadingIds.has(invoice._id) ? (
                        <CircularProgress
                          size={14}
                          sx={{
                            color: "rgba(0, 163, 224, 0.7)",
                          }}
                        />
                      ) : (
                        <Download size={14} />
                      )}
                    </IconButton>
                  </TableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <TableCell colSpan={6} align="center">
                  <Box
                    sx={{
                      py: 8,
                      px: 3,
                      backgroundColor: "rgba(0, 163, 224, 0.03)",
                      borderRadius: 2,
                      border: "2px dashed rgba(0, 163, 224, 0.15)",
                      margin: 2,
                    }}
                  >
                    <FileText
                      size={48}
                      color="rgba(0, 163, 224, 0.3)"
                      style={{ marginBottom: 16 }}
                    />
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#00A3E0",
                        fontWeight: 600,
                        fontSize: "1rem",
                        mb: 1,
                      }}
                    >
                      No invoices found
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#718096",
                        fontSize: "0.8rem",
                      }}
                    >
                      Documents will appear here when available
                    </Typography>
                  </Box>
                </TableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>

      {!invoicesLoading && !invoicesError && totalItems > 0 && (
        <Box sx={{ mt: 1.5 }}>
          <TablePagination
            component="div"
            count={totalItems}
            page={currentPage - 1} // Material-UI uses 0-based indexing
            onPageChange={handlePageChange}
            rowsPerPage={itemsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Documents per page:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
            }
            sx={{
              "& .MuiTablePagination-toolbar": {
                paddingLeft: 0,
                paddingRight: 0,
                minHeight: 48,
              },
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                {
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  color: "#4a5568",
                },
              "& .MuiTablePagination-select": {
                fontSize: "0.8rem",
                fontWeight: 500,
              },
              "& .MuiTablePagination-actions": {
                "& .MuiIconButton-root": {
                  color: "#00A3E0",
                  "&:hover": {
                    backgroundColor: "rgba(0, 163, 224, 0.1)",
                  },
                  "&.Mui-disabled": {
                    color: "#cbd5e0",
                  },
                },
              },
            }}
          />
        </Box>
      )}
    </TablePaper>
  );
};

export default InvoicesTable;
