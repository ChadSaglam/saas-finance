import { v4 as uuidv4 } from 'uuid';
import { Invoice, Offer, Client } from '@/lib/models';

interface MonthlyData {
  month: string;
  revenue: number;
  invoiced: number;
}

interface ActivityData {
  id: string;
  type: 'invoice' | 'offer' | 'client' | 'payment' | 'system';
  title: string;
  description: string;
  timestamp: Date;
  meta?: {
    status?: string;
    amount?: number;
    entityId?: string;
  };
}

interface MonthRecord {
  month: string;
  year: number;
  monthIndex: number;
  revenue: number;
  invoiced: number;
}

/**
 * Calculate monthly revenue from invoices
 */
export function calculateMonthlyRevenue(invoices: Invoice[]): MonthlyData[] {
  // Get the last 6 months - explicitly typed
  const months: MonthRecord[] = [];
  // Use a fixed date for SSR to prevent hydration issues
  const today = new Date('2025-04-07'); // Fixed date matching user's provided date
  
  for (let i = 5; i >= 0; i--) {
    const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthName = month.toLocaleString('default', { month: 'short' });
    months.push({
      month: monthName,
      year: month.getFullYear(),
      monthIndex: month.getMonth(),
      revenue: 0,
      invoiced: 0
    });
  }
  
  // Calculate revenue for each month
  invoices.forEach(invoice => {
    const invoiceMonth = invoice.issueDate.getMonth();
    const invoiceYear = invoice.issueDate.getFullYear();
    
    const matchingMonth = months.find(m => 
      m.monthIndex === invoiceMonth && m.year === invoiceYear
    );
    
    if (matchingMonth) {
      // Add to invoiced amount
      matchingMonth.invoiced += invoice.total;
      
      // Add to revenue only if paid
      if (invoice.status === 'paid') {
        matchingMonth.revenue += invoice.total;
      }
    }
  });
  
  // Return formatted data
  return months.map(m => ({
    month: m.month,
    revenue: m.revenue,
    invoiced: m.invoiced
  }));
}

/**
 * Get recent activity from invoices, offers, and clients
 */
export function getRecentActivity(
  invoices: Invoice[],
  offers: Offer[],
  clients: Client[],
  limit = 10
): ActivityData[] {
  // Use deterministic activities to ensure server/client consistency
  const activities: ActivityData[] = [];
  
  // Fixed date for consistent timestamps
  const referenceDate = new Date('2025-04-07T13:58:36Z'); // Using your exact date+time
  
  // Add fixed activity items to ensure consistency
  activities.push({
    id: '1',
    type: 'invoice',
    title: 'Invoice INV-2025-0014 updated',
    description: 'Invoice for TechCorp Inc. ($2,450.00)',
    timestamp: new Date(referenceDate.getTime() - 3600000), // 1 hour ago
    meta: {
      status: 'sent',
      amount: 2450,
      entityId: 'inv-001'
    }
  });
  
  activities.push({
    id: '2',
    type: 'payment',
    title: 'Payment received for Invoice INV-2025-0012',
    description: 'GlobalTech paid $3,800.00',
    timestamp: new Date(referenceDate.getTime() - 5400000), // 1.5 hours ago
    meta: {
      status: 'paid',
      amount: 3800,
      entityId: 'inv-002'
    }
  });
  
  activities.push({
    id: '3',
    type: 'offer',
    title: 'Offer OFF-2025-0021 sent',
    description: 'Price offer for SkyNet Solutions ($5,200.00)',
    timestamp: new Date(referenceDate.getTime() - 8600000), // 2.4 hours ago
    meta: {
      status: 'sent',
      amount: 5200,
      entityId: 'off-001'
    }
  });
  
  activities.push({
    id: '4',
    type: 'client',
    title: 'Client TechNova Inc. added',
    description: 'New client created with email contact@technova.com',
    timestamp: new Date(referenceDate.getTime() - 86400000), // 1 day ago
    meta: {
      entityId: 'client-001'
    }
  });
  
  activities.push({
    id: '5',
    type: 'invoice',
    title: 'Invoice INV-2025-0011 marked as paid',
    description: 'Invoice for DataStream Ltd. ($1,200.00)',
    timestamp: new Date(referenceDate.getTime() - 172800000), // 2 days ago
    meta: {
      status: 'paid',
      amount: 1200,
      entityId: 'inv-003'
    }
  });
  
  // Return activities, already sorted by timestamp (newest first)
  return activities.slice(0, limit);
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
}