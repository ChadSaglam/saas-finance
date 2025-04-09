import React from 'react';
import Card from '@/components/ui/Card';
import { dummyInvoices } from '@/lib/dummy-data/invoices';
import { formatCurrency } from '@/lib/utils/format';

const StatusOverview: React.FC = () => {
  // Calculate statistics
  const totalPaid = dummyInvoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.total, 0);
  
  const totalPending = dummyInvoices
    .filter(inv => inv.status === 'sent')
    .reduce((sum, inv) => sum + inv.total, 0);
  
  const totalOverdue = dummyInvoices
    .filter(inv => inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.total, 0);
  
  // Status data
  const statusData = [
    { name: 'Paid', value: totalPaid, color: 'bg-green-500', lightColor: 'bg-green-100' },
    { name: 'Pending', value: totalPending, color: 'bg-blue-500', lightColor: 'bg-blue-100' },
    { name: 'Overdue', value: totalOverdue, color: 'bg-red-500', lightColor: 'bg-red-100' }
  ];
  
  const total = totalPaid + totalPending + totalOverdue;
  
  return (
    <Card title="Financial Overview">
      <div className="p-5">
        <h2 className="text-lg font-medium text-gray-900 mb-2">Financial Overview</h2>
        <p className="text-sm text-gray-500 mb-4">Invoice Status Amounts</p>
        
        <div className="space-y-4">
          {statusData.map((status) => {
            const percentage = total > 0 ? (status.value / total) * 100 : 0;
            
            return (
              <div key={status.name}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">{status.name}</span>
                  <span className="text-sm text-gray-700">{formatCurrency(status.value)}</span>
                </div>
                <div className={`w-full h-2 ${status.lightColor} rounded-full`}>
                  <div
                    className={`h-2 ${status.color} rounded-full`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Total</span>
            <span className="text-base font-semibold text-gray-900">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StatusOverview;