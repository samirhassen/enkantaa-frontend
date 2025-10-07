import React, { useCallback, useMemo } from "react";
import { Paper, Typography, Box, Alert, Skeleton } from "@mui/material";
import styled from "@emotion/styled";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useAppSelector } from "../../hooks/redux";
import { selectDashboardChart } from "../../store/slices/dashboard/selector";

const ChartPaper = styled(Paper)`
  padding: 20px;
  margin-top: 8px;
  border-radius: 16px;
  min-height: 500px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 2px solid rgba(0, 163, 224, 0.15);
  box-shadow: 0 4px 20px rgba(0, 163, 224, 0.06);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 32px rgba(0, 163, 224, 0.12);
    border-color: rgba(0, 163, 224, 0.25);
  }
`;

const ChartSkeleton = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
`;
const ChartSection: React.FC = () => {
  const { chartData, chartLoading, chartError } =
    useAppSelector(selectDashboardChart);

  const processedData = useMemo(() => {
    if (!chartData.length) return null;

    // Sort data by date and process
    const sortedData = [...chartData].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return {
      categories: sortedData.map((item) => {
        const date = new Date(item.date);
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
        });
      }),
      totalElectricCost: sortedData.map((item) =>
        Math.round(item.totalElectricCostCumulative)
      ),
      totalSupplyCost: sortedData.map((item) =>
        Math.round(item.totalSupplyCostCumulative)
      ),
      totalDeliveryCost: sortedData.map((item) =>
        Math.round(item.totalDeliveryCostCumulative)
      ),
      // New cost breakdown for stacked chart
      consumptionCost: sortedData.map((item) =>
        Math.round(item.totalConsumptionCost || 0)
      ),
      demandCost: sortedData.map((item) =>
        Math.round(item.totalDemandCost || 0)
      ),
      miscCost: sortedData.map((item) => {
        const total = item.totalElectricCost || 0;
        const consumption = item.totalConsumptionCost || 0;
        const demand = item.totalDemandCost || 0;
        console.log(item);
        return Math.round(Math.max(0, total - consumption - demand));
      }),
      // New series for demand and energy usage
      totalDemandPrimary: sortedData.map((item) =>
        Math.round(item.totalDemandPrimary)
      ),
      totalEnergyUsage: sortedData.map((item) =>
        Math.round(item.totalEnergyUsage)
      ),
    };
  }, [chartData]);

  const chartOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "bar",
        height: 400,
        stacked: true,
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
          },
        },
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 800,
        },
        fontFamily: "Quicksand, sans-serif",
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "70%",
          borderRadius: 6,
        },
      },
      stroke: {
        show: true,
        width: 0,
      },
      fill: {
        type: "solid",
        opacity: 1,
      },
      markers: { size: 0 },
      colors: ["#FF7043", "#42A5F5", "#66BB6A"], // Orange for Consumption, Blue for Demand, Green for Misc
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: true,
        position: "top",
        horizontalAlign: "left",
        offsetX: 40,
        fontFamily: "Quicksand",
        fontWeight: 500,
      },
      xaxis: {
        categories: processedData?.categories || [],
        title: {
          text: "Month",
          style: {
            colors: "#FFB366",
            fontSize: "14px",
            fontWeight: 500,
            fontFamily: "Quicksand",
          },
        },
        labels: {
          style: {
            fontFamily: "Quicksand",
          },
        },
      },
      yaxis: {
        title: {
          text: "Cost ($)",
          style: {
            color: "#00A3E0",
            fontSize: "14px",
            fontWeight: 500,
            fontFamily: "Quicksand",
          },
        },
        labels: {
          formatter: (val) => `$${Number(val).toLocaleString()}`,
          style: { colors: "#00A3E0", fontFamily: "Quicksand" },
        },
      },
      tooltip: {
        shared: true,
        intersect: false,
        theme: "light",
        style: {
          fontSize: "12px",
          fontFamily: "Quicksand",
          color: "#1a202c",
        },
        custom: function ({ series, dataPointIndex, w }) {
          const categories = w.globals.categoryLabels;
          const month = categories[dataPointIndex];

          let tooltipContent = `
          <div style="
            background: white;
            color: black;
            padding: 12px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            border: 1px solid rgba(0, 0, 0, 0.1);
            font-family: Quicksand, sans-serif;
            min-width: 200px;
          ">
            <div style="font-weight: 600; margin-bottom: 8px; font-size: 13px;">
              ${month}
            </div>
        `;

          series.forEach((seriesData: number[], index: number) => {
            const seriesName = w.globals.seriesNames[index];
            const value = seriesData[dataPointIndex];
            const color = w.globals.colors[index];

            tooltipContent += `
            <div style="display: flex; align-items: center; margin-bottom: 4px;">
              <div style="
                width: 8px; 
                height: 8px; 
                background-color: ${color}; 
                border-radius: 50%; 
                margin-right: 8px;
              "></div>
              <span style="font-size: 12px;">
                ${seriesName}: <strong>$${value.toLocaleString()}</strong>
              </span>
            </div>
          `;
          });

          tooltipContent += "</div>";
          return tooltipContent;
        },
        y: {
          formatter: (val) => `$${val.toLocaleString()}`,
        },
      },
      grid: { borderColor: "rgba(0, 163, 224, 0.1)", strokeDashArray: 5 },
    }),
    [processedData]
  );

  const series = useMemo(
    () => [
      {
        name: "Consumption",
        type: "bar",
        data: processedData?.consumptionCost || [],
      },
      {
        name: "Demand",
        type: "bar",
        data: processedData?.demandCost || [],
      },
      {
        name: "Misc",
        type: "bar",
        data: processedData?.miscCost || [],
      },
    ],
    [processedData]
  );

  const handleChartOptions: (
    id: "demand-primary" | "energy-usage",
    colors: string[],
    tooltipUnit: string
  ) => ApexOptions = useCallback(
    (id, colors, tooltipUnit) => ({
      chart: {
        id,
        toolbar: { show: false },
        animations: { enabled: true },
      },
      xaxis: {
        title: {
          text: "Month",
          style: {
            fontSize: "14px",
            fontWeight: 500,
            fontFamily: "Quicksand",
          },
        },
        categories: processedData?.categories,
      },
      stroke: { curve: "smooth" },
      markers: { size: 3 },
      yaxis: {
        title: {
          text: tooltipUnit,
          style: {
            fontSize: "14px",
            fontWeight: 500,
            fontFamily: "Quicksand",
          },
        },
        labels: { formatter: (val: number) => `${val}` },
      },
      tooltip: { y: { formatter: (val: number) => `${val} ${tooltipUnit}` } },
      colors,
      dataLabels: { enabled: false },
    }),
    [processedData]
  );

  if (chartLoading) {
    return (
      <ChartPaper elevation={1}>
        <ChartSkeleton>
          <Skeleton variant="text" width="30%" height={32} />
          <Skeleton variant="rectangular" width="100%" height={60} />
          <Skeleton variant="rectangular" width="100%" height={300} />
        </ChartSkeleton>
      </ChartPaper>
    );
  }

  if (chartError) {
    return (
      <ChartPaper elevation={1}>
        <Alert severity="error">{chartError}</Alert>
      </ChartPaper>
    );
  }

  if (!processedData || !chartData.length) {
    return (
      <ChartPaper elevation={1}>
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No Data Available
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Please select filters to view chart data
          </Typography>
        </Box>
      </ChartPaper>
    );
  }

  return (
    <ChartPaper elevation={1}>
      <Typography
        variant="h6"
        gutterBottom
        color="primary"
        sx={{ fontWeight: 600, mb: 3 }}
      >
        Energy Cost Comparison with Variance: Jan-Apr 2024 vs 2025
      </Typography>

      <Chart options={chartOptions} series={series} type="bar" height={400} />

      <Box mt={4}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }} gutterBottom>
          Electric Demand (kW)
        </Typography>
        <Chart
          options={handleChartOptions("demand-primary", ["#FF7043"], "kW")}
          series={[
            { name: "Demand (kW)", data: processedData.totalDemandPrimary },
          ]}
          type="line"
          height={200}
        />
      </Box>

      <Box mt={4}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }} gutterBottom>
          Electric Consumption (kWh)
        </Typography>
        <Chart
          options={handleChartOptions("energy-usage", ["#29B6F6"], "kWh")}
          series={[
            { name: "Energy (kWh)", data: processedData.totalEnergyUsage },
          ]}
          type="line"
          height={200}
        />
      </Box>
    </ChartPaper>
  );
};

export default ChartSection;
