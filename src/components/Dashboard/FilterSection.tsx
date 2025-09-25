import React, { useState, useEffect, SyntheticEvent, useMemo } from "react";
import { startOfYear, endOfYear, subYears } from "date-fns";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";

import styled from "@emotion/styled";
import { RotateCcw } from "lucide-react";
import { BarChart3 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { dashboardActions } from "../../store/slices/dashboard";
import { ChartFilters, Client } from "../../types";
import Autocomplete from "../CoreComponents/Autocomplete";
import DateRange from "../CoreComponents/DateRange";
import { selectDashboardOverview } from "../../store/slices/dashboard/selector";
import { DateRangeValue } from "../CoreComponents/DateRange/types";

const FilterPaper = styled(Paper)`
  padding: 24px;
  margin-bottom: 24px;
  border-radius: 16px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid rgba(0, 163, 224, 0.08);
  box-shadow: 0 4px 20px rgba(0, 163, 224, 0.06);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 32px rgba(0, 163, 224, 0.12);
    border-color: rgba(0, 163, 224, 0.15);
  }
`;

const FilterHeader = styled(Box)`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid rgba(0, 163, 224, 0.08);
`;

const FilterControls = styled(Box)`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  align-items: center;
`;

type DateToggleValue = "lastYear" | "thisYear" | "custom";

const DateOptions: { label: string; value: DateToggleValue }[] = [
  {
    label: "Last Year",
    value: "lastYear",
  },
  {
    label: "This Year",
    value: "thisYear",
  },
  {
    label: "Custom",
    value: "custom",
  },
];

const FilterSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const { clients, clientsLoading, buildings, buildingsLoading, filters } =
    useAppSelector(selectDashboardOverview);

  const [clientSearch, setClientSearch] = useState("");
  const [buildingSearch, setBuildingSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [dateRangeFilterType, setDateRangeFilterType] =
    useState<DateToggleValue>();

  const dateRange = useMemo(
    () => ({ from: filters.startDate, to: filters.endDate }),
    [filters.startDate, filters.endDate]
  );

  useEffect(() => {
    dispatch(dashboardActions.fetchClients());
  }, [dispatch]);

  useEffect(() => {
    if (selectedClient) {
      dispatch(
        dashboardActions.fetchBuildings({
          clientId: selectedClient._id,
          searchKey: "",
        })
      );
    }
  }, [selectedClient?._id]);

  const handleClientChange = (
    _event: SyntheticEvent<Element, Event>,
    newValue: unknown
  ) => {
    setSelectedClient(newValue as Client | null);
    const newFilters = {
      clientId: (newValue as Client | null)?._id || "",
      building: "",
    };
    dispatch(dashboardActions.setFilters(newFilters));
    setBuildingSearch("");

    // Auto-apply filters when client changes
    dispatch(dashboardActions.fetchChartData(newFilters));
    dispatch(dashboardActions.fetchStatistics());
  };

  const handleBuildingChange = (
    _event: SyntheticEvent<Element, Event>,
    newValue: unknown
  ) => {
    const newFilters: ChartFilters = {
      ...filters,
      building: (newValue as string | null) || "",
    };
    dispatch(dashboardActions.setFilters(newFilters));

    // Auto-apply filters when building changes
    dispatch(dashboardActions.fetchChartData(newFilters));
    dispatch(dashboardActions.fetchStatistics());
  };

  const handleDateRangeUpdate = (values: DateRangeValue) => {
    dispatch(
      dashboardActions.setFilters({
        ...filters,
        startDate: values.from,
        endDate: values.to,
      })
    );
    dispatch(dashboardActions.fetchChartData());
  };

  const handleDateToggleChange = (newValue: DateToggleValue) => {
    setDateRangeFilterType(newValue);
    if (newValue === "custom") return;

    let startDate: Date | null = null;
    let endDate: Date | null = null;

    if (newValue === "lastYear") {
      const lastYear = subYears(new Date(), 1);
      startDate = startOfYear(lastYear);
      endDate = endOfYear(lastYear);
    } else if (newValue === "thisYear") {
      startDate = startOfYear(new Date());
      endDate = new Date();
    }
    dispatch(
      dashboardActions.setFilters({
        ...filters,
        startDate,
        endDate,
      })
    );
    dispatch(dashboardActions.fetchChartData());
  };

  const handleClientInputChange = (
    _event: SyntheticEvent<Element, Event>,
    newInputValue: string
  ) => {
    setClientSearch(newInputValue);
    dispatch(dashboardActions.fetchClients(newInputValue));
  };

  const handleBuildingInputChange = (
    _event: SyntheticEvent<Element, Event>,
    newInputValue: string
  ) => {
    setBuildingSearch(newInputValue);
    if (selectedClient)
      dispatch(
        dashboardActions.fetchBuildings({
          clientId: selectedClient._id,
          searchKey: newInputValue,
        })
      );
  };

  const handleReset = () => {
    setSelectedClient(null);
    setClientSearch("");
    setBuildingSearch("");
    dispatch(dashboardActions.resetFilters());
    // Fetch all clients again to reset the filtered list
    dispatch(dashboardActions.fetchClients());
    dispatch(dashboardActions.fetchChartData({ clientId: "", building: "" }));
    dispatch(dashboardActions.fetchStatistics());
  };

  return (
    <FilterPaper elevation={1}>
      <FilterHeader>
        <BarChart3 color="#00A3E0" size={20} style={{ marginRight: 8 }} />
        <Typography
          variant="h6"
          color="primary"
          sx={{
            fontWeight: 700,
            fontSize: "1.2rem",
            letterSpacing: "-0.02em",
          }}
        >
          Filters
        </Typography>
        <Typography
          variant="body2"
          sx={{
            ml: 2,
            color: "#64748b",
            fontWeight: 500,
            fontSize: "0.875rem",
            fontStyle: "italic",
          }}
        >
          Filter data for the stats and charts below
        </Typography>
      </FilterHeader>

      <FilterControls>
        <Autocomplete
          label="Select Client"
          options={clients}
          getOptionLabel={(option) => (option as Client).name}
          value={selectedClient}
          onChange={handleClientChange}
          onInputChange={handleClientInputChange}
          inputValue={clientSearch}
          loading={clientsLoading}
        />

        <Autocomplete
          options={buildings.map((b) => b.name)}
          value={filters.building || null}
          onChange={handleBuildingChange}
          onInputChange={handleBuildingInputChange}
          inputValue={buildingSearch}
          loading={buildingsLoading}
          label="Select Building"
          disabled={!selectedClient}
        />
        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel size="small" id="date-select-input-label">
            Date
          </InputLabel>
          <Select
            sx={{ borderColor: "rgba(0, 163, 224, 0.4)" }}
            labelId="date-select-input-label"
            label="Date"
            value={dateRangeFilterType}
            onChange={(e) =>
              handleDateToggleChange(e.target.value as DateToggleValue)
            }
            displayEmpty
            size="small"
          >
            {DateOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {dateRangeFilterType === "custom" && (
          <DateRange onChange={handleDateRangeUpdate} value={dateRange} />
        )}

        <Tooltip title="Reset all filters" arrow placement="top">
          <IconButton
            onClick={handleReset}
            sx={{
              backgroundColor: "rgba(0, 163, 224, 0.1)",
              color: "#00A3E0",
              border: "1px solid rgba(0, 163, 224, 0.2)",
              width: 44,
              height: 44,
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "rgba(0, 163, 224, 0.2)",
                borderColor: "rgba(0, 163, 224, 0.4)",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(0, 163, 224, 0.2)",
              },
            }}
          >
            <RotateCcw size={18} />
          </IconButton>
        </Tooltip>
      </FilterControls>
    </FilterPaper>
  );
};

export default FilterSection;
