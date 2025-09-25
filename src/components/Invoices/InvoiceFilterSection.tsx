import React, { useState, useEffect, useMemo } from "react";
import { Box, Paper, Typography, IconButton, Tooltip } from "@mui/material";
import Autocomplete from "../CoreComponents/Autocomplete";
import DateRange from "../CoreComponents/DateRange";
import styled from "@emotion/styled";
import { RotateCcw, Filter } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { invoicesActions } from "../../store/slices/invoices";
import {
  selectInvoiceClients,
  selectInvoiceClientsLoading,
  selectSelectedClientId,
  selectItemsPerPage,
  selectFilterEndDate,
  selectFilterStartDate,
} from "../../store/slices/invoices/selector";
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
`;

const InvoiceFilterSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const clients = useAppSelector(selectInvoiceClients);
  const clientsLoading = useAppSelector(selectInvoiceClientsLoading);
  const selectedClientId = useAppSelector(selectSelectedClientId);
  const startDate = useAppSelector(selectFilterStartDate);
  const endDate = useAppSelector(selectFilterEndDate);
  const itemsPerPage = useAppSelector(selectItemsPerPage);

  const [clientSearch, setClientSearch] = useState("");

  useEffect(() => {
    dispatch(invoicesActions.fetchInvoiceClients({}));
  }, [dispatch]);

  const selectedClient = useMemo(
    () => clients.find((c) => c._id === selectedClientId) || null,
    [selectedClientId]
  );

  const handleClientChange = (
    _event: React.SyntheticEvent,
    newValue: Client | null
  ) => {
    const client = newValue?._id || "";

    dispatch(invoicesActions.setSelectedClientId(client));

    dispatch(
      invoicesActions.fetchInvoices({
        page: 1,
        perPage: itemsPerPage,
        client,
      })
    );
  };

  const handleClientInputChange = (
    _event: React.SyntheticEvent,
    newInputValue: string
  ) => {
    setClientSearch(newInputValue);
    dispatch(invoicesActions.fetchInvoiceClients({ client: newInputValue }));
  };

  const handleDateRangeChange = (value: {
    from?: Date | null;
    to?: Date | null;
  }) => {
    dispatch(
      invoicesActions.setFilterDates({
        startDate: value.from ?? undefined,
        endDate: value.to ?? undefined,
      })
    );

    // fetch invoices for new date range
    dispatch(
      invoicesActions.fetchInvoices({
        page: 1,
        perPage: itemsPerPage,
      })
    );
  };

  const handleReset = () => {
    // clear selection via redux
    setClientSearch("");
    dispatch(invoicesActions.resetInvoiceFilters());
    // reset selected client id to initial (empty) value
    dispatch(invoicesActions.setSelectedClientId(""));
    dispatch(invoicesActions.fetchInvoiceClients({}));
    dispatch(
      invoicesActions.fetchInvoices({
        page: 1,
        perPage: itemsPerPage,
      })
    );
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
          Filter Documents
        </Typography>
      </FilterHeader>

      <FilterControls>
        <Autocomplete
          ContainerProps={{ flex: "none" }}
          sx={{ minWidth: 250, width: 300 }}
          options={clients}
          getOptionLabel={(option) => (option as Client).name}
          value={selectedClient}
          onChange={(_e, v) => handleClientChange(_e, v as Client | null)}
          onInputChange={(_e, v) => handleClientInputChange(_e, v)}
          inputValue={clientSearch}
          loading={clientsLoading}
          label="Select Client"
        />

        <DateRange
          value={{ from: startDate, to: endDate }}
          onReset={() =>
            handleDateRangeChange({ from: undefined, to: undefined })
          }
          endProps={{ disableFuture: true }}
          startProps={{ disableFuture: true }}
          onChange={handleDateRangeChange}
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
