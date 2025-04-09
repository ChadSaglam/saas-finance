"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import { dummyClients } from '@/lib/dummy-data/clients';
import { dummyInvoices } from '@/lib/dummy-data/invoices';
import { dummyOffers } from '@/lib/dummy-data/offers';
import { formatCurrency } from '@/lib/utils/format';
import { formatDisplayDate } from '@/lib/utils/date-format';
import DashboardStats from '@/components/dashboard/DashboardStats';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import ChartCard from '@/components/dashboard/ChartCard';
import QuickActions from '@/components/dashboard/QuickActions';
import StatusOverview from '@/components/dashboard/StatusOverview';
import RecentItemsTable from '@/components/dashboard/RecentItemsTable';
import MonthlyRevenueChart from '@/components/charts/MonthlyRevenueChart';
import InvoiceStatusChart from '@/components/charts/InvoiceStatusChart';
import { calculateMonthlyRevenue, getRecentActivity } from '@/lib/utils/dashboard-utils';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [summaryData, setSummaryData] = useState({
    totalClients: 0,
    totalInvoices: 0,
    totalOffers: 0,
    totalRevenue: 0,
    pendingRevenue: 0,
    overdue: 0,
    paidThisMonth: 0,
    conversionRate: 0
  });

  // Use a fixed reference date for calculations to prevent hydration issues
  const referenceDate = new Date('2025-04-07T13:52:04Z'); // Using the date provided by user
  const userLogin = "ChadSaglam"; // Using the login provided by user

  // Calculate statistics
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      const totalClients = dummyClients.length;
      const totalInvoices = dummyInvoices.length;
      const totalOffers = dummyOffers.length;
      
      const totalRevenue = dummyInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
      const pendingRevenue = dummyInvoices
        .filter(invoice => ['sent', 'overdue'].includes(invoice.status))
        .reduce((sum, invoice) => sum + invoice.total, 0);
      
      const overdue = dummyInvoices.filter(invoice => invoice.status === 'overdue').length;
      
      // Calculate revenue for current month using reference date
      const paidThisMonth = dummyInvoices
        .filter(invoice => 
          invoice.status === 'paid' && 
          invoice.issueDate.getMonth() === referenceDate.getMonth() &&
          invoice.issueDate.getFullYear() === referenceDate.getFullYear()
        )
        .reduce((sum, invoice) => sum + invoice.total, 0);
      
      // Calculate offer to invoice conversion rate
      const acceptedOffers = dummyOffers.filter(offer => offer.status === 'accepted').length;
      const conversionRate = totalOffers > 0 ? (acceptedOffers / totalOffers) * 100 : 0;
      
      setSummaryData({
        totalClients,
        totalInvoices,
        totalOffers,
        totalRevenue,
        pendingRevenue,
        overdue,
        paidThisMonth,
        conversionRate
      });
      
      setIsLoading(false);
    }, 500);
  }, []);
  
  // Get recent items
  const recentInvoices = [...dummyInvoices]
    .sort((a, b) => b.issueDate.getTime() - a.issueDate.getTime())
    .slice(0, 5);
    
  const recentOffers = [...dummyOffers]
    .sort((a, b) => b.issueDate.getTime() - a.issueDate.getTime())
    .slice(0, 5);
  
  // Get activity data with fixed timestamps for SSR consistency
  const activityItems = getRecentActivity(dummyInvoices, dummyOffers, dummyClients);
    
  // Prepare chart data with fixed reference date
  const monthlyRevenueData = calculateMonthlyRevenue(dummyInvoices);
  
  const invoiceStatusData = [
    { name: 'Paid', value: dummyInvoices.filter(inv => inv.status === 'paid').length, color: '#10B981' },
    { name: 'Sent', value: dummyInvoices.filter(inv => inv.status === 'sent').length, color: '#3B82F6' },
    { name: 'Overdue', value: dummyInvoices.filter(inv => inv.status === 'overdue').length, color: '#EF4444' },
    { name: 'Draft', value: dummyInvoices.filter(inv => inv.status === 'draft').length, color: '#F59E0B' },
    { name: 'Cancelled', value: dummyInvoices.filter(inv => inv.status === 'cancelled').length, color: '#6B7280' }
  ];

  // Format the date for display
  const formattedDate = referenceDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Welcome back, {userLogin}</h1>
          <p className="mt-1 text-sm text-gray-500">Here's what's happening with your business today ({formattedDate})</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <QuickActions />
        </div>
      </div>
      
      {/* Stats Overview */}
      <DashboardStats data={summaryData} isLoading={isLoading} />
      
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Charts & Tables */}
        <div className="lg:col-span-2 space-y-6">
          {/* Revenue Chart */}
          <ChartCard title="Monthly Revenue" subtitle="Revenue trends over the last 6 months">
            <div className="h-80">
              <MonthlyRevenueChart data={monthlyRevenueData} />
            </div>
          </ChartCard>
          
          {/* Invoice Status & Offers Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartCard title="Invoice Status" subtitle="Distribution by status">
              <div className="h-64">
                <InvoiceStatusChart data={invoiceStatusData} />
              </div>
            </ChartCard>
            
            <StatusOverview />
          </div>
          
          {/* Recent Invoices & Offers Tables */}
          <div className="space-y-6">
            <RecentItemsTable 
              title="Recent Invoices"
              items={recentInvoices}
              type="invoice"
              createLink="/dashboard/invoices/create"
              viewAllLink="/dashboard/invoices"
            />
            
            <RecentItemsTable 
              title="Recent Price Offers"
              items={recentOffers}
              type="offer"
              createLink="/dashboard/offers/create"
              viewAllLink="/dashboard/offers"
            />
          </div>
        </div>
        
        {/* Sidebar - Activity & Tasks */}
        <div className="space-y-6">
          {/* Activity Feed */}
          <ActivityFeed activities={activityItems} />
          
          {/* Upcoming Tasks / Calendar Widget */}
          <Card>
            <div className="flex justify-between items-center mb-4 p-4 pb-0">
              <h2 className="text-lg font-medium text-gray-900">Calendar</h2>
              <button className="text-sm text-blue-600 hover:text-blue-800">View all</button>
            </div>
            
            <div className="p-4">
              <div className="space-y-3">
                <div className="flex border-l-4 border-blue-500 pl-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium">Invoice #INV-2025-0014 due</p>
                    <p className="text-xs text-gray-500">Tomorrow</p>
                  </div>
                  <div className="text-xs font-medium text-gray-500">
                    $5,420.00
                  </div>
                </div>
                <div className="flex border-l-4 border-green-500 pl-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium">Meeting with TechNova Inc.</p>
                    <p className="text-xs text-gray-500">April 10, 2025 • 10:00 AM</p>
                  </div>
                </div>
                <div className="flex border-l-4 border-yellow-500 pl-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium">Follow up on Offer #OFF-2025-0021</p>
                    <p className="text-xs text-gray-500">April 12, 2025</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100">
                  Add New Event
                </button>
              </div>
            </div>
          </Card>
          
          {/* Client Health */}
          <Card>
            <div className="p-4">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Top Clients</h2>
              <div className="space-y-4">
                {dummyClients.slice(0, 4).map((client) => (
                  <div key={client.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="font-medium text-gray-600">{client.name.charAt(0)}</span>
                      </div>
                      <div className="ml-3">
                        <Link href={`/dashboard/clients/${client.id}`} className="text-sm font-medium text-gray-900">
                          {client.name}
                        </Link>
                        <p className="text-xs text-gray-500">Last invoice: 14 days ago</p>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900">$2,450.00</div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Link href="/dashboard/clients" className="text-sm text-blue-600 hover:text-blue-800">
                  View all clients
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}