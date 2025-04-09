"use client";

import { useState } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import IconButton from '@/components/ui/IconButton';
import { dummyInvoices } from '@/lib/dummy-data/invoices';
import { Invoice } from '@/lib/models';
import { formatDisplayDate } from '@/lib/utils/date-format';
import { formatCurrency } from '@/lib/utils/format';

export default function InvoicesPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof Invoice>('issueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  
  // Filter invoices by status and search term
  const filteredInvoices = dummyInvoices.filter((invoice) => {
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    if (!searchTerm) return matchesStatus;
    
    const searchLower = searchTerm.toLowerCase();
    const clientName = typeof invoice.client === 'object' ? invoice.client.name.toLowerCase() : '';
    
    return matchesStatus && (
      invoice.invoiceNumber.toLowerCase().includes(searchLower) ||
      clientName.includes(searchLower) ||
      invoice.status.toLowerCase().includes(searchLower)
    );
  });
  
  // Sort invoices
  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    if (sortField === 'issueDate' || sortField === 'dueDate') {
      const dateA = new Date(a[sortField]).getTime();
      const dateB = new Date(b[sortField]).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    } else if (sortField === 'total') {
      return sortDirection === 'asc' 
        ? a.total - b.total 
        : b.total - a.total;
    } else if (sortField === 'invoiceNumber') {
      return sortDirection === 'asc'
        ? a.invoiceNumber.localeCompare(b.invoiceNumber)
        : b.invoiceNumber.localeCompare(a.invoiceNumber);
    }
    return 0;
  });
  
  // Toggle sort direction
  const handleSort = (field: keyof Invoice) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Get sort indicator
  const getSortIndicator = (field: keyof Invoice) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };
  
  // Status badge styling
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800'; // draft
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4 sm:mb-0">Invoices</h1>
        <Link href="/dashboard/invoices/create">
          <Button>Create Invoice</Button>
        </Link>
      </div>
      
      <Card>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-4">
          <div className="relative w-full sm:max-w-md">
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            <div className="border rounded-md flex">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
                title="List view"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M2 2.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5H2zM3 3H2v1h1V3z"/>
                  <path d="M5 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM5.5 7a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 4a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9z"/>
                  <path fillRule="evenodd" d="M2 6.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V7a.5.5 0 0 0-.5-.5H2zm1 .5H2v1h1V7z"/>
                  <path fillRule="evenodd" d="M2 10.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5H2zm1 .5H2v1h1v-1z"/>
                </svg>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                title="Grid view"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {viewMode === 'list' ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('invoiceNumber')}
                  >
                    Invoice # {getSortIndicator('invoiceNumber')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('issueDate')}
                  >
                    Issue Date {getSortIndicator('issueDate')}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('dueDate')}
                  >
                    Due Date {getSortIndicator('dueDate')}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('total')}
                  >
                    Amount {getSortIndicator('total')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedInvoices.length > 0 ? (
                  sortedInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link href={`/dashboard/invoices/${invoice.id}`} className="text-blue-600 hover:text-blue-900 font-medium">
                          {invoice.invoiceNumber}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {typeof invoice.client === 'object' && (
                          <Link href={`/dashboard/clients/${invoice.client.id}`} className="text-blue-600 hover:text-blue-900">
                            {invoice.client.name}
                          </Link>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDisplayDate(invoice.issueDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDisplayDate(invoice.dueDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(invoice.total)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(invoice.status)}`}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link href={`/dashboard/invoices/${invoice.id}`} className="text-blue-600 hover:text-blue-900">
                            View
                          </Link>
                          <Link href={`/dashboard/invoices/${invoice.id}/edit`} className="text-indigo-600 hover:text-indigo-900">
                            Edit
                          </Link>
                          <button className="text-red-600 hover:text-red-900">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                      No invoices found. Create your first invoice to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedInvoices.length > 0 ? (
              sortedInvoices.map((invoice) => (
                <div key={invoice.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="bg-gray-50 px-4 py-3 border-b">
                    <div className="flex justify-between items-center">
                      <Link href={`/dashboard/invoices/${invoice.id}`} className="text-blue-600 hover:text-blue-900 font-medium">
                        {invoice.invoiceNumber}
                      </Link>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(invoice.status)}`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-900">
                        {typeof invoice.client === 'object' && invoice.client.name}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">Issue Date:</p>
                        <p>{formatDisplayDate(invoice.issueDate)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Due Date:</p>
                        <p>{formatDisplayDate(invoice.dueDate)}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-500">Amount:</p>
                        <p className="font-medium text-gray-900">{formatCurrency(invoice.total)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 border-t">
                    <div className="flex justify-between">
                      <Link href={`/dashboard/invoices/${invoice.id}`} className="text-blue-600 hover:text-blue-900 text-sm">
                        View
                      </Link>
                      <Link href={`/dashboard/invoices/${invoice.id}/edit`} className="text-indigo-600 hover:text-indigo-900 text-sm">
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                No invoices found. Create your first invoice to get started.
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}