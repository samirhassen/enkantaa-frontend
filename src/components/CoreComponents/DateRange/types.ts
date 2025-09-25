import { DatePickerProps as MUIDatePickerProps } from "@mui/x-date-pickers";

export interface DateRangeValue {
  from?: Date | null;
  to?: Date | null;
}

export interface DateRangeProps {
  value?: DateRangeValue;
  onChange?: (value: DateRangeValue) => void;
  onReset?: () => void;
  startLabel?: string;
  endLabel?: string;
  startProps?: Partial<MUIDatePickerProps>;
  endProps?: Partial<MUIDatePickerProps>;
}

export type DatePickerProps = MUIDatePickerProps;
