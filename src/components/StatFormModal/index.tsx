import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";

type Props = {
  open: boolean;
  initial?: {
    totalEarnings?: number;
    totalSavings?: number;
    energyScore?: number;
  };
  onClose: () => void;
  onSave: (payload: {
    totalEarnings: number;
    totalSavings: number;
    energyScore: number;
  }) => void;
};

const StatFormModal: React.FC<Props> = ({ open, initial, onClose, onSave }) => {
  const [totalEarnings, setTotalEarnings] = useState<number>(
    initial?.totalEarnings ?? 0
  );
  const [totalSavings, setTotalSavings] = useState<number>(
    initial?.totalEarnings ?? 0
  );
  const [energyScore, setEnergyScore] = useState<number>(
    initial?.totalEarnings ?? 0
  );

  const handleSave = () => {
    onSave({ totalEarnings, totalSavings, energyScore });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Statistics</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Total Earnings"
            type="number"
            value={totalEarnings}
            onChange={(e) => setTotalEarnings(Number(e.target.value || 0))}
            InputProps={{ inputProps: { min: 0, step: 0.01 } }}
            fullWidth
            required
          />

          <TextField
            label="Total Savings"
            type="number"
            value={totalSavings}
            onChange={(e) => setTotalSavings(Number(e.target.value || 0))}
            InputProps={{ inputProps: { min: 0, step: 0.01 } }}
            fullWidth
            required
          />

          <TextField
            label="Energy Score"
            type="number"
            value={energyScore}
            onChange={(e) => setEnergyScore(Number(e.target.value || 0))}
            InputProps={{ inputProps: { min: 0, max: 100, step: 0.1 } }}
            fullWidth
            required
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StatFormModal;
