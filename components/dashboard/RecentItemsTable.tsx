import React, { memo } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils/format';
import { formatDisplayDate } from '@/lib/utils/format';

interface BaseItem {
  id: string;
  total: number;
  status: string;
  issueDate: Date;
  client: { name: string } | string;
}

interface Invoice extends BaseItem {
  invoiceNumber: string;
}

interface Offer extends BaseItem {
  offerNumber: string;
}

interface RecentItemsTableProps {
  title: string;
  items: (Invoice | Offer)[];
  type: 'invoice' | 'offer';
  createLink: string;
  viewAllLink: string;
}

const StatusBadge = memo(({ status }: { status: string }) => {
  let badgeClass = '';
  
  switch (status) {
    case 'paid':
    case 'accepted':
      badgeClass = 'bg-green-100 text-green-800';
      break;
    case 'sent':
      badgeClass = 'bg-blue-100 text-blue-800';
      break;
    case 'overdue':
    case 'rejected':
      badgeClass = 'bg-red-100 text-red-800';
      break;
    case 'draft':
      badgeClass = 'bg-yellow-100 text-yellow-800';
      break;
    default:
      badgeClass = 'bg-gray-100 text-gray-800';
  }
  
  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${badgeClass}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
});

StatusBadge.displayName = 'StatusBadge';

const ItemRow = memo(({ item, type }: { item: Invoice | Offer, type: 'invoice' | 'offer' }) => {
  const itemNumber = 'invoiceNumber' in item ? item.invoiceNumber : item.offerNumber;
  const itemLink = `${type === 'invoice' ? '/dashboard/invoices/' : '/dashboard/offers/'}${item.id}`;
  const clientName = typeof item.client === 'object' ? item.client.name : 'Unknown Client';
  
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium text-blue-600">
        <Link href={itemLink}>{itemNumber}</Link>
      </td>
      <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-500">
        {clientName}
      </td>
      <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDisplayDate(item.issueDate)}
      </td>
      <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-900">
        {formatCurrency(item.total)}
      </td>
      <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
        <StatusBadge status={item.status} />
      </td>
    </tr>
  );
});

ItemRow.displayName = 'ItemRow';

const EmptyState = memo(({ type }: { type: 'invoice' | 'offer' }) => (
  <tr>
    <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
      <svg 
        className="mx-auto h-12 w-12 text-gray-400 mb-3" 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={1} 
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
      <p>No {type === 'invoice' ? 'invoices' : 'offers'} found.</p>
      <p className="mt-1">Create your first {type} to get started.</p>
    </td>
  </tr>
));

EmptyState.displayName = 'EmptyState';

const RecentItemsTable = memo<RecentItemsTableProps>(({
  title,
  items,
  type,
  createLink,
  viewAllLink
}) => {
  return (
    <Card>
      <div className="flex justify-between items-center mb-2 p-4 sm:p-5 pb-0">
        <h2 className="text-lg font-medium text-gray-900">{title}</h2>
        <Link href={viewAllLink} className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
          View all
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {type === 'invoice' ? 'Invoice #' : 'Offer #'}
              </th>
              <th scope="col" className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th scope="col" className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.length > 0 ? (
              items.map((item) => <ItemRow key={item.id} item={item} type={type} />)
            ) : (
              <EmptyState type={type} />
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 sm:p-5 pt-2 mt-2">
        <Link href={createLink}>
          <button className="w-full sm:w-auto flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
            <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create New {type === 'invoice' ? 'Invoice' : 'Offer'}
          </button>
        </Link>
      </div>
    </Card>
  );
});

RecentItemsTable.displayName = 'RecentItemsTable';

export default RecentItemsTable;