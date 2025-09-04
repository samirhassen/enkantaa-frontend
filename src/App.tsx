import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, CircularProgress, Typography } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './store';
import { theme } from './theme';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { authActions } from './store/slices/authSlice';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/Dashboard/DashboardPage';
import InvoicesPage from './components/Invoices/InvoicesPage';
import DashboardHeader from './components/Dashboard/DashboardHeader';

const LoadingScreen: React.FC = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #00A3E0 0%, #0288D1 100%)',
    }}
  >
    <img 
      src="/image.png" 
      alt="ConEdison" 
      style={{ 
        height: '48px', 
        marginBottom: '24px',
        filter: 'brightness(0) invert(1)'
      }}
    />
    <CircularProgress 
      size={40} 
      sx={{ 
        color: 'white',
        mb: 2
      }} 
    />
    <Typography 
      variant="body1" 
      sx={{ 
        color: 'white',
        fontWeight: 500
      }}
    >
      Loading Dashboard...
    </Typography>
  </Box>
);

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, initializing } = useAppSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'invoices'>('dashboard');

  useEffect(() => {
    dispatch(authActions.initAuth());
  }, [dispatch]);

  const handlePageChange = (page: 'dashboard' | 'invoices') => {
    setCurrentPage(page);
  };

  if (initializing) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <DashboardHeader 
          currentPage={currentPage} 
          onPageChange={handlePageChange} 
        />
        
        {currentPage === 'dashboard' ? (
          <DashboardPage />
        ) : (
          <InvoicesPage />
        )}
      </Box>
    </>
  );
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
}

export default App;