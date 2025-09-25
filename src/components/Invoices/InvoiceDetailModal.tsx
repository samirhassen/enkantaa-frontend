import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
} from "@mui/material";
import styled from "@emotion/styled";
import {
  Calendar,
  Building,
  User,
  Zap,
  DollarSign,
  X,
  Download,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "../../hooks/redux";
import { selectInvoicesDetail } from "../../store/slices/invoices/selector";
import { invoicesActions } from "../../store/slices/invoices";

const StyledDialog = styled(Dialog)`
  & .MuiDialog-paper {
    border-radius: 16px;
    max-width: 1200px;
    width: 100%;
    margin: 16px;
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    box-shadow: 0 20px 60px rgba(0, 163, 224, 0.15);
  }
`;

const StyledDialogTitle = styled(DialogTitle)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-bottom: 1px solid rgba(0, 163, 224, 0.2);
  background: linear-gradient(135deg, #00a3e0 0%, #0288d1 100%);
  color: white;

  & .MuiTypography-root {
    color: white;
  }
`;

const StyledDialogContent = styled(DialogContent)`
  padding: 20px;
  padding-top: 20px;
  background: white;
`;

const InfoCard = styled(Box)`
  background: rgba(0, 163, 224, 0.03);
  border: 1px solid rgba(0, 163, 224, 0.1);
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 163, 224, 0.05);
    border-color: rgba(0, 163, 224, 0.2);
  }
`;

const MetricBox = styled(Box)`
  text-align: center;
  padding: 12px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 8px;
  border: 1px solid rgba(0, 163, 224, 0.1);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 163, 224, 0.1);
    border-color: rgba(0, 163, 224, 0.2);
  }
`;

const CostGrid = styled(Box)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 16px;
`;

const CostColumn = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CostItem = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: rgba(0, 163, 224, 0.02);
  border: 1px solid rgba(0, 163, 224, 0.08);
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 163, 224, 0.04);
    border-color: rgba(0, 163, 224, 0.12);
  }
`;

const TotalCostCard = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(135deg, #00a3e0 0%, #0288d1 100%);
  border-radius: 8px;
  color: white;
  margin-bottom: 16px;
`;

const LoadingContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
`;

const InvoiceDetailModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    isDetailModalOpen,
    selectedInvoice,
    selectedInvoiceLoading,
    selectedInvoiceError,
  } = useAppSelector(selectInvoicesDetail);

  const [isDownloading, setIsDownloading] = React.useState(false);

  const handleClose = () => {
    dispatch(invoicesActions.closeDetailModal());
  };

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
      month: "long",
      day: "numeric",
    });
  };

  const handleDownload = async () => {
    if (!selectedInvoice) return;

    setIsDownloading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/invoices/download/${
          selectedInvoice._id
        }`,
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
      let filename = `invoice-${selectedInvoice._id}.pdf`;

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
      setIsDownloading(false);
    }
  };

  const renderContent = () => {
    if (selectedInvoiceLoading) {
      return (
        <LoadingContainer>
          <CircularProgress
            size={48}
            sx={{
              color: "#00A3E0",
              mb: 3,
            }}
          />
          <Typography
            variant="h6"
            sx={{
              color: "#4a5568",
              fontWeight: 600,
              mb: 1,
            }}
          >
            Loading Invoice Details
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#718096",
              fontSize: "0.875rem",
            }}
          >
            Please wait while we fetch the invoice information...
          </Typography>
        </LoadingContainer>
      );
    }

    if (selectedInvoiceError) {
      return (
        <Box sx={{ p: 3 }}>
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            {selectedInvoiceError}
          </Alert>
        </Box>
      );
    }

    if (!selectedInvoice) {
      return (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="body1" color="textSecondary">
            No invoice data available
          </Typography>
        </Box>
      );
    }

    return (
      <StyledDialogContent>
        {/* Spacing between header and first card */}
        <Box sx={{ mb: 3 }} />

        {/* Client Information */}
        <InfoCard>
          <Box display="flex" alignItems="center" mb={1.5}>
            <User size={20} color="#00A3E0" style={{ marginRight: 8 }} />
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: "#2d3748", fontSize: "1rem" }}
            >
              Client Information
            </Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={7}>
              <Typography
                variant="body1"
                sx={{ fontWeight: 600, color: "#2d3748", mb: 0.5 }}
              >
                {selectedInvoice.client.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#718096", fontSize: "0.85rem" }}
              >
                Account: {selectedInvoice.client.accountNumber}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={5}>
              <Box display="flex" alignItems="center">
                <Building
                  size={16}
                  color="#64748b"
                  style={{ marginRight: 6 }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: "#4a5568", fontWeight: 500, fontSize: "0.9rem" }}
                >
                  {selectedInvoice.building}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </InfoCard>

        {/* Billing Period */}
        <InfoCard>
          <Box display="flex" alignItems="center" mb={1.5}>
            <Calendar size={20} color="#00A3E0" style={{ marginRight: 8 }} />
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: "#2d3748", fontSize: "1rem" }}
            >
              Billing Period
            </Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Typography
                variant="body2"
                sx={{ color: "#718096", mb: 0.5, fontSize: "0.8rem" }}
              >
                Start Date
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontWeight: 600, color: "#2d3748", fontSize: "0.9rem" }}
              >
                {formatDate(selectedInvoice.billingPeriod.startDate)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography
                variant="body2"
                sx={{ color: "#718096", mb: 0.5, fontSize: "0.8rem" }}
              >
                End Date
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontWeight: 600, color: "#2d3748", fontSize: "0.9rem" }}
              >
                {formatDate(selectedInvoice.billingPeriod.endDate)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography
                variant="body2"
                sx={{ color: "#718096", mb: 0.5, fontSize: "0.8rem" }}
              >
                Duration
              </Typography>
              <Chip
                label={`${selectedInvoice.billingPeriod.days} days`}
                size="small"
                sx={{
                  backgroundColor: "rgba(0, 163, 224, 0.1)",
                  color: "#00A3E0",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  height: 24,
                }}
              />
            </Grid>
          </Grid>
        </InfoCard>

        {/* Usage & Demand Metrics */}
        <Box display="flex" alignItems="center" sx={{ mb: 1.5, mt: 2 }}>
          <Zap size={20} color="#00A3E0" style={{ marginRight: 8 }} />
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "#2d3748", fontSize: "1rem" }}
          >
            Usage & Demand
          </Typography>
        </Box>
        <Grid container spacing={3} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={4}>
            <MetricBox>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: "#00A3E0",
                  mb: 0.5,
                  fontSize: "1.4rem",
                }}
              >
                {selectedInvoice.energyUsage.toLocaleString()}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#718096", fontWeight: 500, fontSize: "0.8rem" }}
              >
                Energy Usage (kWh)
              </Typography>
            </MetricBox>
          </Grid>
          <Grid item xs={12} sm={4}>
            <MetricBox>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: "#FFA726",
                  mb: 0.5,
                  fontSize: "1.4rem",
                }}
              >
                {selectedInvoice.demandPrimary}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#718096", fontWeight: 500, fontSize: "0.8rem" }}
              >
                Demand Primary (kW)
              </Typography>
            </MetricBox>
          </Grid>
          <Grid item xs={12} sm={4}>
            <MetricBox>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: "#66BB6A",
                  mb: 0.5,
                  fontSize: "1.4rem",
                }}
              >
                {formatCurrency(selectedInvoice.demandSupplyCost)}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#718096", fontWeight: 500, fontSize: "0.8rem" }}
              >
                Demand Supply Cost
              </Typography>
            </MetricBox>
          </Grid>
        </Grid>

        {/* Cost Breakdown */}
        <Box display="flex" alignItems="center" sx={{ mb: 1.5 }}>
          <DollarSign size={20} color="#00A3E0" style={{ marginRight: 8 }} />
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "#2d3748", fontSize: "1rem" }}
          >
            Cost Breakdown
          </Typography>
        </Box>

        <CostGrid>
          <CostColumn>
            <CostItem>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, color: "#4a5568", fontSize: "0.85rem" }}
              >
                Supply Cost
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontWeight: 600, color: "#42A5F5", fontSize: "0.9rem" }}
              >
                {formatCurrency(selectedInvoice.totalSupplyCost)}
              </Typography>
            </CostItem>

            <CostItem>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, color: "#4a5568", fontSize: "0.85rem" }}
              >
                Delivery Cost
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontWeight: 600, color: "#AB47BC", fontSize: "0.9rem" }}
              >
                {formatCurrency(selectedInvoice.totalDeliveryCost)}
              </Typography>
            </CostItem>
          </CostColumn>

          <CostColumn>
            <CostItem>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, color: "#4a5568", fontSize: "0.85rem" }}
              >
                Demand Supply
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontWeight: 600, color: "#66BB6A", fontSize: "0.9rem" }}
              >
                {formatCurrency(selectedInvoice.demandSupplyCost)}
              </Typography>
            </CostItem>

            <CostItem>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, color: "#4a5568", fontSize: "0.85rem" }}
              >
                Demand Delivery
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontWeight: 600, color: "#FFA726", fontSize: "0.9rem" }}
              >
                {formatCurrency(selectedInvoice.demandDeliveryCost)}
              </Typography>
            </CostItem>
          </CostColumn>

          <CostColumn>
            <CostItem>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, color: "#4a5568", fontSize: "0.85rem" }}
              >
                Energy Delivery
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontWeight: 600, color: "#4a5568", fontSize: "0.9rem" }}
              >
                {formatCurrency(selectedInvoice.energyDeliveryCost)}
              </Typography>
            </CostItem>

            <CostItem>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, color: "#4a5568", fontSize: "0.85rem" }}
              >
                System Benefit Charge
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontWeight: 600, color: "#4a5568", fontSize: "0.9rem" }}
              >
                {formatCurrency(selectedInvoice.systemBenefitChargeCost)}
              </Typography>
            </CostItem>
          </CostColumn>
        </CostGrid>

        {/* Total Cost */}
        <TotalCostCard>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1.1rem" }}>
            Total Electric Cost
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, fontSize: "1.5rem" }}>
            {formatCurrency(selectedInvoice.totalElectricCost)}
          </Typography>
        </TotalCostCard>
      </StyledDialogContent>
    );
  };

  return (
    <StyledDialog
      open={isDetailModalOpen}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <StyledDialogTitle>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 500,
            fontSize: "1rem",
            color: "white",
          }}
        >
          Invoice Details
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            onClick={handleDownload}
            disabled={isDownloading || !selectedInvoice}
            size="small"
            sx={{
              width: 32,
              height: 32,
              color: "white",
              "&:hover:not(:disabled)": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "white",
              },
              "&:disabled": {
                color: "rgba(255, 255, 255, 0.5)",
              },
            }}
          >
            {isDownloading ? (
              <CircularProgress
                size={16}
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                }}
              />
            ) : (
              <Download size={16} />
            )}
          </IconButton>
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{
              width: 32,
              height: 32,
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "white",
              },
            }}
          >
            <X size={16} />
          </IconButton>
        </Box>
      </StyledDialogTitle>

      {renderContent()}
    </StyledDialog>
  );
};

export default InvoiceDetailModal;
