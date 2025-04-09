import { Invoice } from '@/lib/models';

// Define valid invoice statuses
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

// Function to determine badge color based on status
export const getStatusStyles = (status: string) => {
  const statusMap: Record<InvoiceStatus, { bg: string; color: string }> = {
    'draft': { bg: '#f1f5f9', color: '#475569' },
    'sent': { bg: '#dbeafe', color: '#1e40af' },
    'paid': { bg: '#dcfce7', color: '#166534' },
    'overdue': { bg: '#fee2e2', color: '#b91c1c' },
    'cancelled': { bg: '#f3f4f6', color: '#4b5563' },
  };
  
  const statusKey = status.toLowerCase() as InvoiceStatus;
  return statusMap[statusKey] || { bg: '#f1f5f9', color: '#475569' };
};

// Get client info from invoice
export const getClientInfo = (invoice: Invoice) => {
  return typeof invoice.client === 'object' 
    ? invoice.client 
    : { name: 'Digital Dynamics', email: '', phone: '' };
};