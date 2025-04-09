"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import StatusBadge from '@/components/ui/StatusBadge';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { dummyInvoices } from '@/lib/dummy-data/invoices';
import { Invoice } from '@/lib/models';
import { formatDisplayDate, formatCurrency, formatDateTimeUTC } from '@/lib/utils/format';
import { 
  SearchIcon, 
  ViewListIcon, 
  ViewGridIcon, 
  PlusIcon,
  TrashIcon,
  EyeIcon,
  PencilIcon
} from '@/components/ui/Icons';

export default function InvoicesPage() {
  // UI state
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof Invoice>('issueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [isLoading, setIsLoading] = useState(true);
  
  // Fixed date/time and user for consistency
  const currentDateTime = "2025-04-09 10:46:02";
  const currentUser = "ChadSaglam";

  // Status options for filter
  const STATUS_OPTIONS = [
    { value: 'all', label: 'All Statuses' },
    { value: 'draft', label: 'Draft' },
    { value: 'sent', label: 'Sent' },
    { value: 'paid', label: 'Paid' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'cancelled', label: 'Cancelled' },
  ];
  
  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
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

  // Handle delete action
  const handleDelete = (id: string) => {
    alert(`Delete invoice ${id} (This would connect to your API in production)`);
  };

  return (
    <AnimatedContainer animation="fade-in" duration={400}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Invoices</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your invoices • {currentDateTime} • {currentUser}
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link href="/dashboard/invoices/create">
            <Button variant="primary">
              <PlusIcon className="h-5 w-5 mr-1" />
              Create Invoice
            </Button>
          </Link>
        </div>
      </div>
      
      <Card className="card-shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div className="relative w-full md:max-w-xs">
              <div className="relative">
                <Input
                  label=""
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 mb-0"
                  aria-label="Search invoices"
                />
                <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
            
            <div className="flex space-x-2 w-full md:w-auto justify-between md:justify-start">
              <Select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={STATUS_OPTIONS}
                className="w-40"
                label=""
              />
              
              <div className="border rounded-md flex">
                {/* Use Button component instead of HTML button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('list')} 
                  className={`p-2 rounded-none ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
                  title="List view"
                  aria-pressed={viewMode === 'list'}
                >
                  <ViewListIcon className="h-5 w-5 text-gray-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('grid')} 
                  className={`p-2 rounded-none ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                  title="Grid view"
                  aria-pressed={viewMode === 'grid'}
                >
                  <ViewGridIcon className="h-5 w-5 text-gray-500" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="p-4">
            {viewMode === 'list' ? (
              <LoadingSkeleton height="400px" />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <LoadingSkeleton key={i} height="200px" />
                ))}
              </div>
            )}
          </div>
        ) : (
          <AnimatedContainer animation="fade-in" duration={300}>
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
                      sortedInvoices.map((invoice, index) => (
                        <tr key={invoice.id} className="hover:bg-gray-50 animate-slide-in-up" 
                            style={{animationDelay: `${index * 50}ms`}}>
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
                            <StatusBadge status={invoice.status} type="invoice" />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <Link href={`/dashboard/invoices/${invoice.id}`}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-blue-600 hover:text-blue-900 p-1 h-auto"
                                >
                                  <EyeIcon className="h-4 w-4" />
                                  <span className="sr-only">View</span>
                                </Button>
                              </Link>
                              <Link href={`/dashboard/invoices/${invoice.id}/edit`}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-indigo-600 hover:text-indigo-900 p-1 h-auto"
                                >
                                  <PencilIcon className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-900 p-1 h-auto"
                                onClick={() => handleDelete(invoice.id)}
                              >
                                <TrashIcon className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                          No invoices found matching your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedInvoices.length > 0 ? (
                  sortedInvoices.map((invoice, index) => (
                    <AnimatedContainer 
                      key={invoice.id} 
                      animation="slide-in-up" 
                      duration={300} 
                      delay={index * 50}
                    >
                      <Card className="card-shadow h-full">
                        <div className="bg-gray-50 px-4 py-3 border-b">
                          <div className="flex justify-between items-center">
                            <Link href={`/dashboard/invoices/${invoice.id}`} className="text-blue-600 hover:text-blue-900 font-medium">
                              {invoice.invoiceNumber}
                            </Link>
                            <StatusBadge status={invoice.status} type="invoice" />
                          </div>
                        </div>
                        <div className="p-4 flex flex-col h-full">
                          <div className="mb-3">
                            <p className="text-sm font-medium text-gray-900">
                              {typeof invoice.client === 'object' && (
                                <Link href={`/dashboard/clients/${invoice.client.id}`} className="text-blue-600 hover:text-blue-900">
                                  {invoice.client.name}
                                </Link>
                              )}
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
                            <div className="col-span-2 mt-2">
                              <p className="text-gray-500">Amount:</p>
                              <p className="font-medium text-gray-900">{formatCurrency(invoice.total)}</p>
                            </div>
                          </div>
                          <div className="mt-auto pt-4 flex justify-between">
                            <Link href={`/dashboard/invoices/${invoice.id}`}>
                              <Button 
                                variant="ghost"
                                size="sm"
                                className="text-blue-600 hover:text-blue-900 p-1 h-auto"
                              >
                                View
                              </Button>
                            </Link>
                            <Link href={`/dashboard/invoices/${invoice.id}/edit`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-indigo-600 hover:text-indigo-900 p-1 h-auto"
                              >
                                Edit
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </Card>
                    </AnimatedContainer>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    No invoices found matching your filters. Try different criteria or create your first invoice.
                  </div>
                )}
              </div>
            )}
            
            {/* No results message when there are no invoices at all */}
            {sortedInvoices.length === 0 && dummyInvoices.length === 0 && (
              <AnimatedContainer animation="fade-in" duration={400}>
                <div className="p-8 text-center">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
                    <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No invoices yet</h3>
                  <p className="text-gray-500 mb-4">
                    Create your first invoice to get started
                  </p>
                  <Link href="/dashboard/invoices/create">
                    <Button variant="primary" size="md">
                      <PlusIcon className="h-5 w-5 mr-1" />
                      Create Invoice
                    </Button>
                  </Link>
                </div>
              </AnimatedContainer>
            )}
          </AnimatedContainer>
        )}
      </Card>
    </AnimatedContainer>
  );
}