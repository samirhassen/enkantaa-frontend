// React import not needed with new JSX transform
import { Box, Stack, IconButton, Tooltip } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import DatePicker from "../DatePicker";
import { DateRangeProps, DatePickerProps } from "./types";

const DateRange = ({
  value = { from: undefined, to: undefined },
  onChange,
  onReset,
  startLabel = "From",
  endLabel = "To",
  startProps,
  endProps,
}: DateRangeProps) => {
  const { from, to } = value;

  const handleStartChange = (newValue: Date | null) => {
    onChange?.({ from: newValue, to });
  };

  const handleEndChange = (newValue: Date | null) => {
    onChange?.({ from, to: newValue });
  };

  return (
    <Box sx={{ minWidth: 560, display: "flex", alignItems: "center" }}>
      <Box display="flex" gap={2}>
        <Stack direction="row" spacing={2} sx={{ flex: 1 }}>
          <DatePicker
            {...(startProps as DatePickerProps)}
            value={from}
            onChange={handleStartChange}
            label={startLabel}
          />
        </Stack>

        <Stack direction="row" spacing={2} sx={{ flex: 1 }}>
          <DatePicker
            {...(endProps as DatePickerProps)}
            value={to}
            disabled={!from}
            onChange={handleEndChange}
            label={endLabel}
          />
        </Stack>
      </Box>
      {onReset && (value.from || value.to) ? (
        <Tooltip title="Reset date range" arrow>
          <IconButton
            onClick={onReset}
            aria-label="reset date range"
            sx={{ ml: 1 }}
          >
            <ClearIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ) : null}
    </Box>
  );
};

export default DateRange;
