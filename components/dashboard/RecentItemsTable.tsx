import React from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import { Invoice, Offer } from '@/lib/models';
import { formatCurrency } from '@/lib/utils/format';
import { formatDisplayDate } from '@/lib/utils/date-format';

interface RecentItemsTableProps {
  title: string;
  items: (Invoice | Offer)[];
  type: 'invoice' | 'offer';
  createLink: string;
  viewAllLink: string;
}

const RecentItemsTable: React.FC<RecentItemsTableProps> = ({
  title,
  items,
  type,
  createLink,
  viewAllLink
}) => {
  const getItemNumber = (item: Invoice | Offer): string => {
    return 'invoiceNumber' in item ? item.invoiceNumber : item.offerNumber;
  };
  
  const getItemLink = (item: Invoice | Offer): string => {
    const baseUrl = type === 'invoice' ? '/dashboard/invoices/' : '/dashboard/offers/';
    return baseUrl + item.id;
  };
  
  const getItemDate = (item: Invoice | Offer): Date => {
    return item.issueDate;
  };
  
  const getClientName = (item: Invoice | Offer): string => {
    return typeof item.client === 'object' ? item.client.name : 'Unknown Client';
  };
  
  const getStatusBadgeClass = (status: string): string => {
    switch (status) {
      case 'paid':
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <Card>
      <div className="flex justify-between items-center mb-4 p-5 pb-0">
        <h2 className="text-lg font-medium text-gray-900">{title}</h2>
        <Link href={viewAllLink} className="text-sm text-blue-600 hover:text-blue-800">
          View all
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {type === 'invoice' ? 'Invoice #' : 'Offer #'}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.length > 0 ? (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    <Link href={getItemLink(item)}>{getItemNumber(item)}</Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getClientName(item)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDisplayDate(getItemDate(item))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(item.total)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(item.status)}`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  No {type === 'invoice' ? 'invoices' : 'offers'} found. Create your first {type} to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-5 pt-0 mt-4">
        <Link href={createLink}>
          <button className="w-full sm:w-auto flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Create New {type === 'invoice' ? 'Invoice' : 'Offer'}
          </button>
        </Link>
      </div>
    </Card>
  );
};

export default RecentItemsTable;