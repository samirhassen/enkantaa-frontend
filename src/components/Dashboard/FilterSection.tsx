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
import { RotateCcw } from "lucide-react";
import { BarChart3 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { dashboardActions } from "../../store/slices/dashboardSlice";
import { Client } from "../../types";

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

const FilterSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const { clients, clientsLoading, buildings, buildingsLoading, filters } =
    useAppSelector((state) => state.dashboard);

  const [clientSearch, setClientSearch] = useState("");
  const [buildingSearch, setBuildingSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  useEffect(() => {
    dispatch(dashboardActions.fetchClients(""));
  }, [dispatch]);

  useEffect(() => {
    if (selectedClient) {
      dispatch(
        dashboardActions.fetchBuildings({
          clientId: selectedClient._id,
          search: "",
        })
      );
    }
  }, [selectedClient?._id, dispatch]);

  const handleClientChange = (event: any, newValue: Client | null) => {
    setSelectedClient(newValue);
    const newFilters = {
      clientId: newValue?._id || "",
      building: "",
    };
    dispatch(dashboardActions.setFilters(newFilters));
    setBuildingSearch("");

    // Auto-apply filters when client changes
    dispatch(dashboardActions.fetchChartData(newFilters));
  };

  const handleBuildingChange = (event: any, newValue: string | null) => {
    const newFilters = {
      ...filters,
      building: newValue || "",
    };
    dispatch(dashboardActions.setFilters(newFilters));

    // Auto-apply filters when building changes
    dispatch(dashboardActions.fetchChartData(newFilters));
  };

  const handleClientInputChange = (event: any, newInputValue: string) => {
    setClientSearch(newInputValue);
    dispatch(dashboardActions.fetchClients(newInputValue));
  };

  const handleBuildingInputChange = (event: any, newInputValue: string) => {
    setBuildingSearch(newInputValue);
  };

  const handleReset = () => {
    setSelectedClient(null);
    setClientSearch("");
    setBuildingSearch("");
    dispatch(dashboardActions.resetFilters());
    // Fetch all clients again to reset the filtered list
    dispatch(dashboardActions.fetchClients(""));
    dispatch(dashboardActions.fetchChartData({ clientId: "", building: "" }));
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
          Chart Filters
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
          Filter data for the electric cost analysis chart below
        </Typography>
      </FilterHeader>

      <FilterControls>
        <Autocomplete
          sx={{
            minWidth: 280,
            flex: 1,
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

        <Autocomplete
          sx={{
            minWidth: 280,
            flex: 1,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              transition: "all 0.2s ease",
              "&:hover:not(.Mui-disabled)": {
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
              "&.Mui-disabled": {
                backgroundColor: "rgba(248, 250, 252, 0.6)",
                "& fieldset": {
                  borderColor: "rgba(0, 163, 224, 0.1)",
                },
              },
            },
          }}
          options={buildings.map((b) => b.name)}
          value={filters.building || null}
          onChange={handleBuildingChange}
          onInputChange={handleBuildingInputChange}
          inputValue={buildingSearch}
          loading={buildingsLoading}
          disabled={!selectedClient}
          data-testid="building-autocomplete"
          renderInput={(params) => (
            <Tooltip
              title={!selectedClient ? "Please select a client first" : ""}
              arrow
              placement="top"
            >
              <div>
                <TextField
                  {...params}
                  label="Select Building"
                  variant="outlined"
                  size="small"
                  sx={{
                    "& .MuiInputLabel-root.Mui-disabled": {
                      color: "#94a3b8",
                    },
                    "& .MuiInputLabel-root": {
                      fontWeight: 500,
                      color: "#4a5568",
                    },
                  }}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {buildingsLoading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              </div>
            </Tooltip>
          )}
        />

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
