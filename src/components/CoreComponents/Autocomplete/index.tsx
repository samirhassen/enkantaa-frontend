import { useCallback } from "react";
import {
  Autocomplete as MUIAutocomplete,
  TextField,
  CircularProgress,
  Tooltip,
  Box,
  AutocompleteRenderInputParams,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const AutocompleteWrapper = styled(Box)`
  min-width: 280px;
`;

const MuiSelectorsStyle = {
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
};

import { AutocompleteProps } from "./types";

const Autocomplete = ({
  loading,
  label,
  tooltipTitle,
  placeholder,
  size = "small",
  ContainerProps,
  ...rest
}: AutocompleteProps) => {
  const renderInput = useCallback(
    (params: AutocompleteRenderInputParams) => {
      return (
        <Tooltip title={tooltipTitle} arrow placement="top">
          <TextField
            {...params}
            label={label}
            variant="outlined"
            size={size}
            placeholder={placeholder}
            sx={{
              "& .MuiInputLabel-root": {
                fontWeight: 500,
                color: "#4a5568",
              },
              "& .MuiInputLabel-root.Mui-disabled": {
                color: "#94a3b8",
              },
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        </Tooltip>
      );
    },
    [label, size, placeholder, loading, tooltipTitle]
  );

  return (
    <AutocompleteWrapper flex={1} {...ContainerProps}>
      <MUIAutocomplete
        sx={MuiSelectorsStyle}
        renderInput={renderInput}
        {...rest}
      />
    </AutocompleteWrapper>
  );
};

export default Autocomplete;
