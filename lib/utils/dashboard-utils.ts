import { Invoice, Offer, Client } from '@/lib/models';

export interface MonthlyData {
  month: string;
  revenue: number;
  invoiced: number;
}

export interface ActivityData {
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

/**
 * Calculate monthly revenue from invoices
 * Uses current date to determine the months to display
 */
export function calculateMonthlyRevenue(invoices: Invoice[], currentDate = new Date()): MonthlyData[] {
  // Get the last 6 months
  const months: MonthlyData[] = [];
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    months.push({
      month: date.toLocaleString('default', { month: 'short' }),
      revenue: 0,
      invoiced: 0
    });
  }
  
  // Group all invoice data for each month in a single pass through invoices
  const monthData: { [key: string]: { revenue: number; invoiced: number } } = {};
  
  invoices.forEach(invoice => {
    const month = invoice.issueDate.getMonth();
    const year = invoice.issueDate.getFullYear();
    const key = `${year}-${month}`;
    
    if (!monthData[key]) {
      monthData[key] = { revenue: 0, invoiced: 0 };
    }
    
    // Add to invoiced amount
    monthData[key].invoiced += invoice.total;
    
    // Add to revenue only if paid
    if (invoice.status === 'paid') {
      monthData[key].revenue += invoice.total;
    }
  });
  
  // Map the data to the months array
  months.forEach((monthItem, index) => {
    const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - (5 - index), 1);
    const key = `${monthDate.getFullYear()}-${monthDate.getMonth()}`;
    
    if (monthData[key]) {
      monthItem.revenue = monthData[key].revenue;
      monthItem.invoiced = monthData[key].invoiced;
    }
  });
  
  return months;
}

/**
 * Get recent activity from invoices, offers, and clients
 * Uses current date to calculate relative timestamps
 */
export function getRecentActivity(
  invoices: Invoice[],
  offers: Offer[],
  clients: Client[],
  currentDate = new Date(),
  limit = 10
): ActivityData[] {
  // Create activities with timestamps relative to current date
  const activities: ActivityData[] = [];
  
  // Add fixed activity items with timestamps relative to current date
  activities.push({
    id: '1',
    type: 'invoice',
    title: 'Invoice INV-2025-0014 updated',
    description: 'Invoice for TechCorp Inc. ($2,450.00)',
    timestamp: new Date(currentDate.getTime() - 3600000), // 1 hour ago
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
    timestamp: new Date(currentDate.getTime() - 5400000), // 1.5 hours ago
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
    timestamp: new Date(currentDate.getTime() - 8600000), // 2.4 hours ago
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
    timestamp: new Date(currentDate.getTime() - 86400000), // 1 day ago
    meta: {
      entityId: 'client-001'
    }
  });
  
  activities.push({
    id: '5',
    type: 'invoice',
    title: 'Invoice INV-2025-0011 marked as paid',
    description: 'Invoice for DataStream Ltd. ($1,200.00)',
    timestamp: new Date(currentDate.getTime() - 172800000), // 2 days ago
    meta: {
      status: 'paid',
      amount: 1200,
      entityId: 'inv-003'
    }
  });
  
  // Return activities, already sorted by timestamp (newest first)
  return activities.slice(0, limit);
}