import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Skeleton,
} from '@mui/material';
import styled from '@emotion/styled';
import { DollarSign, Users, Building, FileText } from 'lucide-react';
import { useAppSelector } from '../../hooks/redux';

const StatCard = styled(Box)`
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(0, 163, 224, 0.1);
  box-shadow: 0 4px 20px rgba(0, 163, 224, 0.06);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 32px rgba(0, 163, 224, 0.12);
    border-color: rgba(0, 163, 224, 0.15);
    background: rgba(255, 255, 255, 1);
  }
`;

const IconContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  margin-right: 16px;
`;

const SkeletonCard = styled(Box)`
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  border: 2px solid rgba(0, 163, 224, 0.2);
  box-shadow: 0 4px 20px rgba(0, 163, 224, 0.15);
  animation: pulse 1.5s ease-in-out infinite;
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
  }
`;

const StatisticsSection: React.FC = () => {
  const { statistics, statisticsLoading, statisticsError } = useAppSelector(
    (state) => state.dashboard
  );

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getStatItems = () => [
    {
      title: 'Total Earned',
      value: statistics ? formatCurrency(statistics.totalEarned) : '0',
      icon: DollarSign,
      color: '#66BB6A',
      bgColor: 'rgba(102, 187, 106, 0.1)',
    },
    {
      title: 'Total Clients',
      value: statistics ? formatNumber(statistics.totalClients) : '0',
      icon: Users,
      color: '#FFA726',
      bgColor: 'rgba(255, 167, 38, 0.1)',
    },
    {
      title: 'Total Buildings',
      value: statistics ? formatNumber(statistics.totalBuildings) : '0',
      icon: Building,
      color: '#42A5F5',
      bgColor: 'rgba(66, 165, 245, 0.1)',
    },
    {
      title: 'Total Invoices',
      value: statistics ? formatNumber(statistics.totalInvoices) : '0',
      icon: FileText,
      color: '#AB47BC',
      bgColor: 'rgba(171, 71, 188, 0.1)',
    },
  ];

  if (statisticsLoading || !statistics) {
    return (
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <SkeletonCard>
                <Box sx={{ mr: 2 }}>
                  <Skeleton
                    variant="rounded"
                    width={48}
                    height={48}
                    sx={{ 
                      bgcolor: 'rgba(0, 163, 224, 0.2)',
                      animation: 'wave 1.6s linear 0.5s infinite',
                      borderRadius: '12px'
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Skeleton
                    variant="text"
                    width="70%"
                    height={28}
                    sx={{ 
                      mb: 0.5,
                      bgcolor: 'rgba(0, 163, 224, 0.15)',
                      animation: 'wave 1.6s linear 0.2s infinite',
                      borderRadius: '4px'
                    }}
                  />
                  <Skeleton
                    variant="text"
                    width="85%"
                    height={16}
                    sx={{ 
                      bgcolor: 'rgba(0, 163, 224, 0.1)',
                      animation: 'wave 1.6s linear 0.8s infinite',
                      borderRadius: '4px'
                    }}
                  />
                </Box>
              </SkeletonCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (statisticsError) {
    return (
      <Box sx={{ mb: 3 }}>
        <Typography color="error" variant="body1">
          Error loading statistics: {statisticsError}
        </Typography>
      </Box>
    );
  }

  const statItems = getStatItems();

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={3}>
        {statItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <StatCard>
                <IconContainer
                  sx={{
                    backgroundColor: item.bgColor,
                  }}
                >
                  <IconComponent
                    size={24}
                    color={item.color}
                  />
                </IconContainer>
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: '#1a202c',
                      fontSize: '1.5rem',
                      lineHeight: 1.2,
                      mb: 0.5,
                    }}
                  >
                    {item.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#64748b',
                      fontWeight: 500,
                      fontSize: '0.875rem',
                    }}
                  >
                    {item.title}
                  </Typography>
                </Box>
              </StatCard>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default StatisticsSection;