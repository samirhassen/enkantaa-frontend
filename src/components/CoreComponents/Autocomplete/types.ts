import React from "react";
import { BoxProps, Autocomplete as MUIAutocomplete } from "@mui/material";

export interface AutocompleteProps
  extends Omit<React.ComponentProps<typeof MUIAutocomplete>, "renderInput"> {
  label: string;
  tooltipTitle?: string;
  placeholder?: string;
  size?: "small" | "medium";
  ContainerProps: BoxProps;
}

export default AutocompleteProps;
