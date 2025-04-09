import React from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils/format';
import { TrendingUpIcon, TrendingDownIcon, UsersIcon, DocumentIcon, TagIcon, CashIcon, ExclamationIcon, CheckCircleIcon } from '@/components/ui/Icons';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number;
  colorClass?: string;
  isLoading?: boolean;
}

const StatsCard = React.memo<StatsCardProps>(({ 
  title, 
  value, 
  icon, 
  change, 
  colorClass = "bg-blue-500",
  isLoading = false
}) => {
  const showChange = change !== undefined;
  const isPositive = change && change > 0;
  
  return (
    <Card className="bg-white overflow-hidden">
      <div className="p-4 sm:p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md ${colorClass} p-2 sm:p-3`}>
            {icon}
          </div>
          <div className="ml-3 sm:ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                {isLoading ? (
                  <div className="h-6 w-24 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-base sm:text-lg font-medium text-gray-900"
                  >
                    {value}
                  </motion.div>
                )}
                
                {showChange && !isLoading && (
                  <span className={`ml-2 text-xs font-semibold flex items-center ${
                    isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {isPositive ? <TrendingUpIcon className="h-3 w-3 mr-1" /> : <TrendingDownIcon className="h-3 w-3 mr-1" />}
                    {Math.abs(change)}%
                  </span>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </Card>
  );
});

StatsCard.displayName = 'StatsCard';

interface DashboardStatsProps {
  data: {
    totalClients: number;
    totalInvoices: number;
    totalOffers: number;
    totalRevenue: number;
    pendingRevenue: number;
    overdue: number;
    paidThisMonth: number;
    conversionRate: number;
  };
  isLoading?: boolean;
}

const DashboardStats = React.memo<DashboardStatsProps>(({ data, isLoading = false }) => {
  return (
    <div className="mt-6 grid gap-4 sm:gap-5 grid-cols-1 xs:grid-cols-2 lg:grid-cols-4">
      <StatsCard 
        title="Total Clients"
        value={data.totalClients}
        icon={<UsersIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />}
        change={5.3}
        colorClass="bg-blue-500"
        isLoading={isLoading}
      />
      
      <StatsCard 
        title="Total Revenue"
        value={formatCurrency(data.totalRevenue)}
        icon={<CashIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />}
        change={12.5}
        colorClass="bg-green-500"
        isLoading={isLoading}
      />
      
      <StatsCard 
        title="Pending Revenue"
        value={formatCurrency(data.pendingRevenue)}
        icon={<ExclamationIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />}
        colorClass="bg-yellow-500"
        isLoading={isLoading}
      />
      
      <StatsCard 
        title="Conversion Rate"
        value={`${data.conversionRate.toFixed(1)}%`}
        icon={<CheckCircleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />}
        change={-2.3}
        colorClass="bg-purple-500"
        isLoading={isLoading}
      />
    </div>
  );
});

DashboardStats.displayName = 'DashboardStats';

export default DashboardStats;