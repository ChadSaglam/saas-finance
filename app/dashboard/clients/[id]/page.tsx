"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { dummyClients } from '@/lib/dummy-data/clients';
import { dummyInvoices } from '@/lib/dummy-data/invoices';
import { dummyOffers } from '@/lib/dummy-data/offers';
import { Client } from '@/lib/models';
import { formatDisplayDate } from '@/lib/utils/format';
import { formatCurrency, formatDateTimeUTC } from '@/lib/utils/format';
import { EmailIcon, PrinterIcon } from '@/components/ui/Icons';
import { usePageParams } from '@/lib/hooks/usePageParams';
import StatusBadge from '@/components/ui/StatusBadge';


export default function ClientDetailPage() {
  const params = usePageParams();
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState('');
  
  // Set current date and time on client-side only
  useEffect(() => {
    setCurrentDateTime(formatDateTimeUTC(new Date()));
  }, []);
  
  // Get client data, invoices, and offers
  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      const foundClient = dummyClients.find(c => c.id === params.id);
      
      if (foundClient) {
        setClient(foundClient);
      }
      
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [params.id]);
  
  // Show not found if client doesn't exist
  if (!isLoading && !client) {
    notFound();
  }
  
  // Get invoices and offers for this client
  const clientInvoices = dummyInvoices.filter(invoice => 
    typeof invoice.client === 'object' ? 
      invoice.client.id === params.id : 
      invoice.client === params.id
  );
  
  const clientOffers = dummyOffers.filter(offer => 
    typeof offer.client === 'object' ? 
      offer.client.id === params.id : 
      offer.client === params.id
  );
  
  // Calculate client statistics
  const totalInvoices = clientInvoices.length;
  const totalPaid = clientInvoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.total, 0);
  
  const totalPending = clientInvoices
    .filter(inv => inv.status === 'sent' || inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.total, 0);
  
  const activeOffers = clientOffers.filter(offer => 
    offer.status !== 'accepted' && offer.status !== 'rejected' && offer.status !== 'expired'
  ).length;
  
  // Format address for display
  const formatAddress = (client: Client) => {
    const parts = [
      client.address,
      client.city && client.zipCode ? `${client.city}, ${client.zipCode}` : client.city || client.zipCode,
      client.state,
      client.country,
    ].filter(Boolean);
    
    return parts.join(', ');
  };
  
  // Show loading skeleton instead of spinner
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="w-full max-w-md">
            <LoadingSkeleton height="30px" width="250px" className="mb-2" />
            <LoadingSkeleton height="20px" width="180px" />
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <LoadingSkeleton height="38px" width="120px" />
            <LoadingSkeleton height="38px" width="100px" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <LoadingSkeleton key={i} height="80px" />
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <LoadingSkeleton height="300px" />
            <LoadingSkeleton height="400px" className="mt-6" />
          </div>
          <div>
            <LoadingSkeleton height="250px" />
            <LoadingSkeleton height="150px" className="mt-6" />
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      {client && (
        <AnimatedContainer animation="fade-in" duration={400}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{client.name}</h1>
              <p className="mt-1 text-sm text-gray-500">
                Client since {formatDisplayDate(client.createdAt)} • Last updated: {currentDateTime}
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto">
                <EmailIcon className="h-5 w-5 mr-1" />
                Email Client
              </Button>
              <Link href={`/dashboard/clients/${client.id}/edit`} className="w-full sm:w-auto">
                <Button variant="primary" fullWidth>
                  Edit Client
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Client Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card hoverable className="card-shadow">
              <div className="p-4">
                <h3 className="text-sm text-gray-500 font-medium">Total Invoices</h3>
                <p className="text-xl font-semibold text-gray-900 mt-1">{totalInvoices}</p>
              </div>
            </Card>
            <Card hoverable className="card-shadow">
              <div className="p-4">
                <h3 className="text-sm text-gray-500 font-medium">Total Paid</h3>
                <p className="text-xl font-semibold text-green-600 mt-1">{formatCurrency(totalPaid)}</p>
              </div>
            </Card>
            <Card hoverable className="card-shadow">
              <div className="p-4">
                <h3 className="text-sm text-gray-500 font-medium">Outstanding</h3>
                <p className="text-xl font-semibold text-blue-600 mt-1">{formatCurrency(totalPending)}</p>
              </div>
            </Card>
            <Card hoverable className="card-shadow">
              <div className="p-4">
                <h3 className="text-sm text-gray-500 font-medium">Active Offers</h3>
                <p className="text-xl font-semibold text-gray-900 mt-1">{activeOffers}</p>
              </div>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Client Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="card-shadow">
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                  <h2 className="text-lg font-medium text-gray-900">Client Details</h2>
                </div>
                <div className="p-6">
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Contact Person</dt>
                      <dd className="mt-1 text-sm text-gray-900">{client.contactPerson || "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        <a href={`mailto:${client.email}`} className="text-blue-600 hover:text-blue-900 transition-colors">
                          {client.email}
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                      <dd className="mt-1 text-sm text-gray-900">{client.phone}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Website</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {client.website ? (
                          <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-900 transition-colors">
                            {client.website.replace(/^https?:\/\/(www\.)?/, '')}
                          </a>
                        ) : "—"}
                      </dd>
                    </div>
                    <div className="md:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">Address</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formatAddress(client)}</dd>
                    </div>
                    {client.notes && (
                      <div className="md:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Notes</dt>
                        <dd className="mt-1 text-sm text-gray-900 whitespace-pre-line">{client.notes}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </Card>
              
              {/* Recent Invoices */}
              <RecentInvoicesCard invoices={clientInvoices} />
              
              {/* Recent Offers */}
              <RecentOffersCard offers={clientOffers} />
            </div>
            
            {/* Client Summary & Actions */}
            <div className="space-y-6">
              <ClientActionsCard client={client} />
              
              <Card className="card-shadow">
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                  <h2 className="text-lg font-medium text-red-900">Danger Zone</h2>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-500 mb-4">
                    Permanently delete this client and all associated data. This action cannot be undone.
                  </p>
                  <Button variant="danger">Delete Client</Button>
                </div>
              </Card>
            </div>
          </div>
        </AnimatedContainer>
      )}
    </div>
  );
}

// Extract components for better organization

interface RecentInvoicesCardProps {
  invoices: any[];
}

const RecentInvoicesCard: React.FC<RecentInvoicesCardProps> = ({ invoices }) => {
  return (
    <Card className="card-shadow">
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Recent Invoices</h2>
        <Link href="/dashboard/invoices/create" className="text-sm text-blue-600 hover:text-blue-900 transition-colors">
          Create Invoice
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invoice #
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Issue Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices.length > 0 ? (
              invoices.slice(0, 5).map((invoice, index) => (
                <tr key={invoice.id} className="hover:bg-gray-50 animate-slide-in-up" 
                    style={{animationDelay: `${index * 50}ms`}}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    <Link href={`/dashboard/invoices/${invoice.id}`} className="hover:underline transition-colors">
                      {invoice.invoiceNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDisplayDate(invoice.issueDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDisplayDate(invoice.dueDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(invoice.total)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={invoice.status} type="invoice" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/dashboard/invoices/${invoice.id}`} className="text-blue-600 hover:text-blue-900 transition-colors">
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  No invoices found for this client.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {invoices.length > 5 && (
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <Link href="/dashboard/invoices" className="text-sm text-blue-600 hover:text-blue-900 transition-colors">
            View all invoices
          </Link>
        </div>
      )}
    </Card>
  );
};

interface RecentOffersCardProps {
  offers: any[];
}

const RecentOffersCard: React.FC<RecentOffersCardProps> = ({ offers }) => {
  return (
    <Card className="card-shadow">
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Price Offers</h2>
        <Link href="/dashboard/offers/create" className="text-sm text-blue-600 hover:text-blue-900 transition-colors">
          Create Offer
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Offer #
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Issue Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valid Until
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {offers.length > 0 ? (
              offers.slice(0, 5).map((offer, index) => (
                <tr key={offer.id} className="hover:bg-gray-50 animate-slide-in-up" 
                    style={{animationDelay: `${index * 50}ms`}}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    <Link href={`/dashboard/offers/${offer.id}`} className="hover:underline transition-colors">
                      {offer.offerNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDisplayDate(offer.issueDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDisplayDate(offer.validUntil)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(offer.total)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={offer.status} type="offer" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/dashboard/offers/${offer.id}`} className="text-blue-600 hover:text-blue-900 transition-colors">
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  No offers found for this client.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {offers.length > 5 && (
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <Link href="/dashboard/offers" className="text-sm text-blue-600 hover:text-blue-900 transition-colors">
            View all offers
          </Link>
        </div>
      )}
    </Card>
  );
};

interface ClientActionsCardProps {
  client: Client;
}

const ClientActionsCard: React.FC<ClientActionsCardProps> = ({ client }) => {
  return (
    <Card className="card-shadow">
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
        <h2 className="text-lg font-medium text-gray-900">Actions</h2>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          <Link href={`/dashboard/invoices/create?client=${client.id}`} className="block w-full">
            <Button variant="primary" fullWidth>Create Invoice</Button>
          </Link>
          <Link href={`/dashboard/offers/create?client=${client.id}`} className="block w-full">
            <Button variant="outline" fullWidth>Create Price Offer</Button>
          </Link>
          <Button variant="outline" fullWidth>
            <PrinterIcon className="h-5 w-5 mr-1" />
            Print Client Details
          </Button>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Related Information</h3>
          
          <dl className="grid grid-cols-1 gap-y-3">
            <div>
              <dt className="text-xs text-gray-500">Client ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{client.id}</dd>
            </div>
            
            <div>
              <dt className="text-xs text-gray-500">Created On</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatDisplayDate(client.createdAt)}</dd>
            </div>
            
            <div>
              <dt className="text-xs text-gray-500">Last Updated</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatDisplayDate(client.updatedAt)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </Card>
  );
};