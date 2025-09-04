import React, { useState, useEffect } from "react";
import {
  Box,
  Autocomplete,
  TextField,
  Paper,
  Typography,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import styled from "@emotion/styled";
import { RotateCcw, Filter } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { invoicesActions } from "../../store/slices/invoicesSlice";
import { Client } from "../../types";

const FilterPaper = styled(Paper)`
  padding: 16px 20px;
  margin-bottom: -1px;
  border-radius: 16px;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid rgba(0, 163, 224, 0.08);
  border-bottom: none;
  box-shadow: 0 4px 20px rgba(0, 163, 224, 0.06);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 32px rgba(0, 163, 224, 0.12);
    border-color: rgba(0, 163, 224, 0.15);
    border-bottom: none;
  }
`;

const FilterHeader = styled(Box)`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0, 163, 224, 0.08);
`;

const FilterControls = styled(Box)`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
  max-width: 500px;
`;

const InvoiceFilterSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const { 
    clients, 
    clientsLoading, 
    selectedClientId,
    currentPage,
    itemsPerPage 
  } = useAppSelector((state) => state.invoices);

  const [clientSearch, setClientSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  useEffect(() => {
    dispatch(invoicesActions.fetchInvoiceClients(""));
  }, [dispatch]);

  useEffect(() => {
    // Update selected client when selectedClientId changes
    const client = clients.find(c => c._id === selectedClientId);
    setSelectedClient(client || null);
  }, [selectedClientId, clients]);

  const handleClientChange = (event: any, newValue: Client | null) => {
    setSelectedClient(newValue);
    const clientId = newValue?._id || "";
    
    dispatch(invoicesActions.setSelectedClientId(clientId));
    
    // Fetch invoices with the new filter
    dispatch(invoicesActions.fetchInvoices({ 
      page: 1, 
      perPage: itemsPerPage,
      clientId 
    }));
  };

  const handleClientInputChange = (event: any, newInputValue: string) => {
    setClientSearch(newInputValue);
    dispatch(invoicesActions.fetchInvoiceClients(newInputValue));
  };

  const handleReset = () => {
    setSelectedClient(null);
    setClientSearch("");
    dispatch(invoicesActions.resetInvoiceFilters());
    dispatch(invoicesActions.fetchInvoiceClients(""));
    dispatch(invoicesActions.fetchInvoices({ 
      page: 1, 
      perPage: itemsPerPage 
    }));
  };

  return (
    <FilterPaper elevation={1}>
      <FilterHeader>
        <Filter color="#00A3E0" size={18} style={{ marginRight: 8 }} />
        <Typography
          variant="h6"
          color="primary"
          sx={{
            fontWeight: 600,
            fontSize: "1rem",
            letterSpacing: "-0.01em",
          }}
        >
          Filter Invoices
        </Typography>
        <Typography
          variant="body2"
          sx={{
            ml: 2,
            color: "#64748b",
            fontWeight: 500,
            fontSize: "0.8rem",
            fontStyle: "italic",
          }}
        >
          Filter invoices by client
        </Typography>
      </FilterHeader>

      <FilterControls>
        <Autocomplete
          sx={{
            minWidth: 250,
            width: 300,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 1)",
                "& fieldset": {
                  borderColor: "rgba(0, 163, 224, 0.4)",
                },
              },
              "&.Mui-focused": {
                backgroundColor: "rgba(255, 255, 255, 1)",
                "& fieldset": {
                  borderColor: "#00A3E0",
                  borderWidth: "2px",
                },
              },
            },
          }}
          options={clients}
          getOptionLabel={(option) => option.name}
          value={selectedClient}
          onChange={handleClientChange}
          onInputChange={handleClientInputChange}
          inputValue={clientSearch}
          loading={clientsLoading}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Client"
              variant="outlined"
              size="small"
              sx={{
                "& .MuiInputLabel-root": {
                  fontWeight: 500,
                  color: "#4a5568",
                },
              }}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {clientsLoading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />

        <Tooltip title="Reset filters" arrow placement="top">
          <IconButton
            onClick={handleReset}
            sx={{
              backgroundColor: "rgba(0, 163, 224, 0.1)",
              color: "#00A3E0",
              border: "1px solid rgba(0, 163, 224, 0.2)",
              width: 36,
              height: 36,
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "rgba(0, 163, 224, 0.2)",
                borderColor: "rgba(0, 163, 224, 0.4)",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(0, 163, 224, 0.2)",
              },
            }}
          >
            <RotateCcw size={14} />
          </IconButton>
        </Tooltip>
      </FilterControls>
    </FilterPaper>
  );
};

export default InvoiceFilterSection;