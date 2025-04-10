"use client";

import { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import { dummyClients } from '@/lib/dummy-data/clients';
import { dummyInvoices } from '@/lib/dummy-data/invoices';
import { dummyOffers } from '@/lib/dummy-data/offers';
import DashboardStats from '@/components/dashboard/DashboardStats';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import ChartCard from '@/components/dashboard/ChartCard';
import QuickActions from '@/components/dashboard/QuickActions';
import StatusOverview from '@/components/dashboard/StatusOverview';
import RecentItemsTable from '@/components/dashboard/RecentItemsTable';
import MonthlyRevenueChart from '@/components/charts/MonthlyRevenueChart';
import InvoiceStatusChart from '@/components/charts/InvoiceStatusChart';
import { calculateMonthlyRevenue, getRecentActivity } from '@/lib/utils/dashboard-utils';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { useRequireAuth } from '@/lib/hooks/useRequireAuth';
import { useAuth } from '@/lib/contexts/AuthContext';

const CalendarWidget = () => (
  <Card>
    <div className="flex justify-between items-center mb-4 p-4 pb-0">
      <h2 className="text-lg font-medium text-gray-900">Calendar</h2>
      <Link href="/dashboard/calendar" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
        View all
      </Link>
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
        <button className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors">
          Add New Event
        </button>
      </div>
    </div>
  </Card>
);

const TopClients = () => (
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
                <Link href={`/dashboard/clients/${client.id}`} className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors">
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
        <Link href="/dashboard/clients" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
          View all clients
        </Link>
      </div>
    </div>
  </Card>
);

// New security status component
const SecurityStatusCard = () => {
  const { user } = useAuth();
  
  return (
    <Card>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Security Status</h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Protected
          </span>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">2FA Authentication:</span>
            <span className="font-medium text-green-600">Enabled</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Last Login IP:</span>
            <span className="font-medium">{user?.lastLoginIp || '192.168.1.1'}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Login Email:</span>
            <span className="font-medium truncate max-w-[180px]">{user?.email || 'test@example.com'}</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Link href="/account/security" className="w-full block text-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors">
            Security Settings
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default function DashboardPage() {
  // Add auth protection - will redirect if not authenticated
  const { isAuthenticated, isTwoFactorVerified } = useRequireAuth();
  // Get user info from auth context
  const { user, logout } = useAuth();
  
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
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    setCurrentDate(new Date());
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const totalClients = dummyClients.length;
      const totalInvoices = dummyInvoices.length;
      const totalOffers = dummyOffers.length;
      
      const totalRevenue = dummyInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
      const pendingRevenue = dummyInvoices
        .filter(invoice => ['sent', 'overdue'].includes(invoice.status))
        .reduce((sum, invoice) => sum + invoice.total, 0);
      
      const overdue = dummyInvoices.filter(invoice => invoice.status === 'overdue').length;
      
      // Calculate revenue for current month using the current date
      const paidThisMonth = dummyInvoices
        .filter(invoice => 
          invoice.status === 'paid' && 
          invoice.issueDate.getMonth() === currentDate.getMonth() &&
          invoice.issueDate.getFullYear() === currentDate.getFullYear()
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
    
    // Clean up timer on unmount
    return () => clearTimeout(timer);
  }, [currentDate]);
  
  // Memoize expensive calculations to prevent recalculations on re-renders
  const recentInvoices = useMemo(() => 
    [...dummyInvoices]
      .sort((a, b) => b.issueDate.getTime() - a.issueDate.getTime())
      .slice(0, 5),
    []
  );
    
  const recentOffers = useMemo(() => 
    [...dummyOffers]
      .sort((a, b) => b.issueDate.getTime() - a.issueDate.getTime())
      .slice(0, 5),
    []
  );
  
  // Memoize activity data to prevent regeneration on re-renders
  const activityItems = useMemo(() => 
    getRecentActivity(dummyInvoices, dummyOffers, dummyClients, currentDate),
    [currentDate]
  );
    
  // Memoize chart data calculations
  const monthlyRevenueData = useMemo(() => 
    calculateMonthlyRevenue(dummyInvoices, currentDate),
    [currentDate]
  );
  
  const invoiceStatusData = useMemo(() => [
    { name: 'Paid', value: dummyInvoices.filter(inv => inv.status === 'paid').length, color: '#10B981' },
    { name: 'Sent', value: dummyInvoices.filter(inv => inv.status === 'sent').length, color: '#3B82F6' },
    { name: 'Overdue', value: dummyInvoices.filter(inv => inv.status === 'overdue').length, color: '#EF4444' },
    { name: 'Draft', value: dummyInvoices.filter(inv => inv.status === 'draft').length, color: '#F59E0B' },
    { name: 'Cancelled', value: dummyInvoices.filter(inv => inv.status === 'cancelled').length, color: '#6B7280' }
  ], []);

  // Format the date for display with proper localization
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // If auth check is in progress, show minimal loading UI
  if (!isAuthenticated || !isTwoFactorVerified) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying your authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome back, {user?.name || user?.email?.split('@')[0] || 'User'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">Here's what's happening with your business today ({formattedDate})</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-2">
          <QuickActions />
          <button
            onClick={logout}
            className="py-2 px-3 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
      
      {/* Stats Overview */}
      <DashboardStats data={summaryData} isLoading={isLoading} />
      
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Charts & Tables */}
        <div className="lg:col-span-2 space-y-6">
          {/* Revenue Chart with Suspense for better loading UX */}
          <Suspense fallback={<LoadingSkeleton height="320px" />}>
            <ChartCard title="Monthly Revenue" subtitle="Revenue trends over the last 6 months">
              <div className="h-80">
                {isLoading ? 
                  <LoadingSkeleton height="100%" />
                  : <MonthlyRevenueChart data={monthlyRevenueData} />
                }
              </div>
            </ChartCard>
          </Suspense>
          
          {/* Invoice Status & Offers Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Suspense fallback={<LoadingSkeleton height="260px" />}>
              <ChartCard title="Invoice Status" subtitle="Distribution by status">
                <div className="h-64">
                  {isLoading ? 
                    <LoadingSkeleton height="100%" />
                    : <InvoiceStatusChart data={invoiceStatusData} />
                  }
                </div>
              </ChartCard>
            </Suspense>
            
            <Suspense fallback={<LoadingSkeleton height="260px" />}>
              <StatusOverview />
            </Suspense>
          </div>
          
          {/* Recent Invoices & Offers Tables */}
          <div className="space-y-6">
            <Suspense fallback={<LoadingSkeleton height="300px" />}>
              <RecentItemsTable 
                title="Recent Invoices"
                items={recentInvoices}
                type="invoice"
                createLink="/dashboard/invoices/create"
                viewAllLink="/dashboard/invoices"
              />
            </Suspense>
            
            <Suspense fallback={<LoadingSkeleton height="300px" />}>
              <RecentItemsTable 
                title="Recent Price Offers"
                items={recentOffers}
                type="offer"
                createLink="/dashboard/offers/create"
                viewAllLink="/dashboard/offers"
              />
            </Suspense>
          </div>
        </div>
        
        {/* Sidebar - Activity & Tasks */}
        <div className="space-y-6">
          {/* Security Status Card - New Component */}
          <Suspense fallback={<LoadingSkeleton height="180px" />}>
            <SecurityStatusCard />
          </Suspense>
          
          {/* Activity Feed */}
          <Suspense fallback={<LoadingSkeleton height="300px" />}>
            <ActivityFeed activities={activityItems} />
          </Suspense>
          
          {/* Upcoming Tasks / Calendar Widget */}
          <Suspense fallback={<LoadingSkeleton height="220px" />}>
            <CalendarWidget />
          </Suspense>
          
          {/* Client Health */}
          <Suspense fallback={<LoadingSkeleton height="280px" />}>
            <TopClients />
          </Suspense>
        </div>
      </div>
    </div>
  );
}