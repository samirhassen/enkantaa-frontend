import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  DatePicker as MUIDatePicker,
  DatePickerProps,
} from "@mui/x-date-pickers";
import { useMemo } from "react";

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

const DatePicker = (props: DatePickerProps) => {
  // explicit casting to null because MUI DatePicker doesn't work well for undefined values
  const normalizedValue = useMemo(() => props.value ?? null, [props.value]);
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MUIDatePicker
        label="Select Date"
        {...props}
        value={normalizedValue}
        sx={MuiSelectorsStyle}
        slotProps={{
          textField: {
            label: props.label || "Select Date",
            variant: "outlined",
            size: "small",
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default DatePicker;
