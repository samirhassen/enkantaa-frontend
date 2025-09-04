import React, { useEffect } from 'react';
import { Container, Box } from '@mui/material';
import { useAppDispatch } from '../../hooks/redux';
import { invoicesActions } from '../../store/slices/invoicesSlice';
import InvoiceFilterSection from './InvoiceFilterSection';
import InvoicesTable from './InvoicesTable';
import InvoiceDetailModal from './InvoiceDetailModal';

const InvoicesPage: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Fetch first page with 10 items per page
    dispatch(invoicesActions.fetchInvoices({ page: 1, perPage: 10 }));
  }, [dispatch]);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <InvoiceFilterSection />
      <InvoicesTable />
      <InvoiceDetailModal />
    </Container>
  );
};

export default InvoicesPage;