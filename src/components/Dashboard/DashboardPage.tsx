import React, { useEffect } from "react";
import { Container } from "@mui/material";
import { useAppDispatch } from "../../hooks/redux";
import { dashboardActions } from "../../store/slices/dashboard";
import StatisticsSection from "./StatisticsSection";
import FilterSection from "./FilterSection";
import ChartSection from "./ChartSection";
import ClientTablesSection from "./ClientTablesSection";

const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Fetch initial chart data with empty filters to get all data
    dispatch(dashboardActions.fetchChartData({ clientId: "", building: "" }));
    // Also fetch initial clients
    dispatch(dashboardActions.fetchClients());
    // Fetch statistics and table data
    dispatch(dashboardActions.fetchStatistics());
    dispatch(dashboardActions.fetchTopPayingClients());
    dispatch(dashboardActions.fetchLeastPayingClients());
  }, [dispatch]);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <FilterSection />
      <StatisticsSection />
      <ChartSection />
      <ClientTablesSection />
    </Container>
  );
};

export default DashboardPage;
