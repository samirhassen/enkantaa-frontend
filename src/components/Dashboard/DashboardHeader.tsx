import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Tabs,
  Tab,
} from "@mui/material";
import { LogOut, BarChart3, FileText } from "lucide-react";
import { useAppDispatch } from "../../hooks/redux";
import { authActions } from "../../store/slices/authSlice";

interface DashboardHeaderProps {
  currentPage?: "dashboard" | "invoices";
  onPageChange?: (page: "dashboard" | "invoices") => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  currentPage = "dashboard",
  onPageChange,
}) => {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(authActions.logout());
  };

  const handleTabChange = (
    event: React.SyntheticEvent,
    newValue: "dashboard" | "invoices"
  ) => {
    if (onPageChange) {
      onPageChange(newValue);
    }
  };

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: 600, mr: 9 }}
          >
            ConEdison
          </Typography>

          {onPageChange && (
            <Tabs
              value={currentPage}
              onChange={handleTabChange}
              sx={{
                "& .MuiTabs-indicator": {
                  backgroundColor: "white",
                  height: 3,
                  borderRadius: "3px 3px 0 0",
                },
                "& .MuiTab-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  textTransform: "none",
                  minHeight: 48,
                  "&.Mui-selected": {
                    color: "white",
                    fontWeight: 600,
                  },
                  "&:hover": {
                    color: "white",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                },
              }}
            >
              <Tab
                value="dashboard"
                label="Dashboard"
                icon={<BarChart3 size={18} />}
                iconPosition="start"
                sx={{ mr: 1 }}
              />
              <Tab
                value="invoices"
                label="Invoices"
                icon={<FileText size={18} />}
                iconPosition="start"
              />
            </Tabs>
          )}
        </Box>

        <Button
          color="inherit"
          startIcon={<LogOut size={18} />}
          onClick={handleLogout}
          sx={{
            textTransform: "none",
            fontWeight: 500,
            fontSize: "0.875rem",
            borderRadius: 2,
            px: 2,
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          Sign Out
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default DashboardHeader;
