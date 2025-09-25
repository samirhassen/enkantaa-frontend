import React from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
} from "@mui/material";
import styled from "@emotion/styled";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useAppSelector } from "../../hooks/redux";
import { selectDashboardTopClients } from "../../store/slices/dashboard/selector";
import { ClientTableData } from "../../types";

const TablePaper = styled(Paper)`
  padding: 20px;
  border-radius: 16px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid rgba(0, 163, 224, 0.08);
  box-shadow: 0 4px 20px rgba(0, 163, 224, 0.06);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 32px rgba(0, 163, 224, 0.12);
    border-color: rgba(0, 163, 224, 0.15);
  }
  height: 100%;
`;

const StyledTableContainer = styled(TableContainer)`
  border-radius: 8px;
  box-shadow: none;
  border: 1px solid rgba(0, 0, 0, 0.06);
  overflow: hidden;
`;

const StyledTableHead = styled(TableHead)`
  background: linear-gradient(135deg, #00a3e0 0%, #0288d1 100%);

  & .MuiTableCell-head {
    color: #ffffff;
    font-weight: 700;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: none;
    padding: 12px 16px;
    position: relative;

    &:not(:last-child)::after {
      content: "";
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      height: 20px;
      width: 1px;
      background: rgba(255, 255, 255, 0.2);
    }
  }
`;

const StyledTableRow = styled(TableRow)`
  background-color: white;
  border-bottom: 1px solid rgba(0, 163, 224, 0.08);

  &:hover {
    background-color: rgba(0, 163, 224, 0.04);
  }

  &:last-child {
    border-bottom: none;
  }

  & .MuiTableCell-root {
    border-bottom: none;
    padding: 12px 16px;
    font-size: 0.85rem;
    vertical-align: middle;
  }
`;

const RankBadge = styled(Box)<{ color: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: ${(props) =>
    props.color === "success"
      ? "linear-gradient(135deg, #66BB6A 0%, #4CAF50 100%)"
      : "linear-gradient(135deg, #FFA726 0%, #FF9800 100%)"};
  color: white;
  font-weight: 700;
  font-size: 0.75rem;
  box-shadow: 0 2px 8px
    ${(props) =>
      props.color === "success"
        ? "rgba(102, 187, 106, 0.3)"
        : "rgba(255, 167, 38, 0.3)"};
`;
const SkeletonRow = styled(TableRow)`
  background-color: white;
  border-bottom: 1px solid rgba(0, 163, 224, 0.08);
  animation: pulse 1.5s ease-in-out infinite;

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
      background-color: rgba(248, 250, 252, 0.8);
    }
    50% {
      opacity: 0.7;
      background-color: rgba(226, 232, 240, 0.9);
    }
  }

  & .MuiTableCell-root {
    border-bottom: none;
    padding: 12px 16px;
    vertical-align: middle;
  }
`;

const ClientTablesSection: React.FC = () => {
  const {
    topPayingClients,
    topPayingClientsLoading,
    topPayingClientsError,
    leastPayingClients,
    leastPayingClientsLoading,
    leastPayingClientsError,
  } = useAppSelector(selectDashboardTopClients);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const renderSkeletonRows = () => (
    <>
      {[1, 2, 3, 4, 5].map((index) => (
        <SkeletonRow key={index}>
          <TableCell>
            <Skeleton
              variant="circular"
              width={28}
              height={28}
              sx={{
                bgcolor: "rgba(0, 163, 224, 0.2)",
                animation: `wave 1.6s linear ${index * 0.2}s infinite`,
              }}
            />
          </TableCell>
          <TableCell>
            <Skeleton
              variant="text"
              width="80%"
              height={20}
              sx={{
                bgcolor: "rgba(0, 163, 224, 0.15)",
                animation: `wave 1.6s linear ${index * 0.2 + 0.1}s infinite`,
                borderRadius: "4px",
              }}
            />
          </TableCell>
          <TableCell>
            <Skeleton
              variant="text"
              width="70%"
              height={20}
              sx={{
                bgcolor: "rgba(0, 163, 224, 0.12)",
                animation: `wave 1.6s linear ${index * 0.2 + 0.2}s infinite`,
                borderRadius: "4px",
              }}
            />
          </TableCell>
          <TableCell align="right">
            <Skeleton
              variant="text"
              width="60%"
              height={20}
              sx={{
                bgcolor: "rgba(0, 163, 224, 0.18)",
                animation: `wave 1.6s linear ${index * 0.2 + 0.3}s infinite`,
                borderRadius: "4px",
              }}
            />
          </TableCell>
        </SkeletonRow>
      ))}
    </>
  );

  const renderTable = (
    data: ClientTableData[],
    title: string,
    icon: React.ReactNode,
    chipColor: "success" | "warning",
    loading: boolean,
    error: string | null
  ) => (
    <TablePaper elevation={1}>
      <Box
        display="flex"
        alignItems="center"
        mb={2}
        pb={2}
        borderBottom="2px solid rgba(0, 163, 224, 0.15)"
      >
        {icon}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: "1.1rem",
            ml: 1,
            color: "#00A3E0",
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </Typography>
      </Box>

      <StyledTableContainer>
        <Table>
          <StyledTableHead>
            <TableRow>
              <TableCell sx={{ width: "70px" }}>Rank</TableCell>
              <TableCell sx={{ width: "35%" }}>Client Name</TableCell>
              <TableCell sx={{ width: "25%" }}>Account Number</TableCell>
              <TableCell align="right" sx={{ width: "20%" }}>
                Total Amount
              </TableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {loading ? (
              renderSkeletonRows()
            ) : error ? (
              <StyledTableRow>
                <TableCell colSpan={4} align="center">
                  <Box
                    sx={{
                      py: 6,
                      px: 3,
                      backgroundColor: "rgba(244, 67, 54, 0.03)",
                      borderRadius: 2,
                      border: "2px dashed rgba(244, 67, 54, 0.15)",
                      margin: 2,
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#f44336",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                      }}
                    >
                      Error loading data
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#718096",
                        fontSize: "0.75rem",
                        mt: 0.5,
                      }}
                    >
                      {error}
                    </Typography>
                  </Box>
                </TableCell>
              </StyledTableRow>
            ) : data.length > 0 ? (
              data.map((client, index) => (
                <StyledTableRow key={client._id}>
                  <TableCell>
                    <RankBadge color={chipColor}>{index + 1}</RankBadge>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: "#2d3748",
                        fontSize: "0.875rem",
                      }}
                    >
                      {client.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#718096",
                        fontFamily:
                          '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace',
                        fontSize: "0.8rem",
                      }}
                    >
                      {client.accountNumber}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        color: chipColor === "success" ? "#66BB6A" : "#FFA726",
                        fontSize: "0.875rem",
                      }}
                    >
                      {formatCurrency(client.totalAmount)}
                    </Typography>
                  </TableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <TableCell colSpan={4} align="center">
                  <Box
                    sx={{
                      py: 6,
                      px: 3,
                      backgroundColor: "rgba(0, 163, 224, 0.03)",
                      borderRadius: 2,
                      border: "2px dashed rgba(0, 163, 224, 0.15)",
                      margin: 2,
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#00A3E0",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                      }}
                    >
                      No data available
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#718096",
                        fontSize: "0.75rem",
                        mt: 0.5,
                      }}
                    >
                      Data will appear here when available
                    </Typography>
                  </Box>
                </TableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </TablePaper>
  );

  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Box>
          {renderTable(
            topPayingClients || [],
            "Top Paying Clients",
            <TrendingUp color="#66BB6A" size={20} />,
            "success",
            topPayingClientsLoading,
            topPayingClientsError
          )}
        </Box>
        <Box>
          {renderTable(
            leastPayingClients || [],
            "Least Paying Clients",
            <TrendingDown color="#FFA726" size={20} />,
            "warning",
            leastPayingClientsLoading,
            leastPayingClientsError
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ClientTablesSection;
