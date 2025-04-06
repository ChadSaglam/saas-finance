"use client";

import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { dummyClients } from '@/lib/dummy-data/clients';
import { dummyInvoices } from '@/lib/dummy-data/invoices';
import { dummyOffers } from '@/lib/dummy-data/offers';
import { formatDisplayDate } from '@/lib/utils/date-format';
import { usePageParams } from '@/lib/hooks/usePageParams';

export default function ClientDetailPage() {
  const params = usePageParams();
  const id = params.id;
  
  const client = dummyClients.find(c => c.id === id);
  
  if (!client) {
    notFound();
  }
  
  // Find invoices and offers for this client
  const clientInvoices = dummyInvoices.filter(invoice => 
    typeof invoice.client === 'object' && invoice.client.id === id
  );
  
  const clientOffers = dummyOffers.filter(offer => 
    typeof offer.client === 'object' && offer.client.id === id
  );
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">{client.name}</h1>
        <div className="space-x-2">
          <Link href={`/dashboard/clients/${client.id}/edit`}>
            <Button>Edit Client</Button>
          </Link>
          <Link href="/dashboard/clients">
            <Button variant="outline">Back to Clients</Button>
          </Link>
        </div>
      </div>
      
      {/* Client Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Client Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Company Name</h3>
              <p className="mt-1 text-sm text-gray-900">{client.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Contact Person</h3>
              <p className="mt-1 text-sm text-gray-900">{client.contactPerson}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="mt-1 text-sm text-gray-900">{client.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Phone</h3>
              <p className="mt-1 text-sm text-gray-900">{client.phone}</p>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500">Address</h3>
              <p className="mt-1 text-sm text-gray-900">{client.address}</p>
            </div>
          </div>
        </Card>
        
        <Card>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Client Summary</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Client Since</h3>
              <p className="mt-1 text-sm text-gray-900">
                {formatDisplayDate(client.createdAt)}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Invoices</h3>
              <p className="mt-1 text-sm text-gray-900">{clientInvoices.length}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Offers</h3>
              <p className="mt-1 text-sm text-gray-900">{clientOffers.length}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                ${clientInvoices.reduce((sum, inv) => sum + inv.total, 0).toFixed(2)}
              </p>
            </div>
          </div>
          <div className="mt-5 space-y-2">
            <Link href={`/dashboard/invoices/create?clientId=${client.id}`}>
              <Button fullWidth>Create Invoice</Button>
            </Link>
            <Link href={`/dashboard/offers/create?clientId=${client.id}`}>
              <Button variant="outline" fullWidth>Create Price Offer</Button>
            </Link>
          </div>
        </Card>
      </div>
      
      {/* Client Invoices */}
      <Card className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Invoices</h2>
          <Link href={`/dashboard/invoices/create?clientId=${client.id}`}>
            <Button size="sm">Create Invoice</Button>
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          {clientInvoices.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clientInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      <Link href={`/dashboard/invoices/${invoice.id}`}>{invoice.invoiceNumber}</Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDisplayDate(invoice.issueDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDisplayDate(invoice.dueDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      ${invoice.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                        invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                        invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/dashboard/invoices/${invoice.id}`} className="text-blue-600 hover:text-blue-900">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center py-4 text-gray-500">No invoices found for this client.</p>
          )}
        </div>
      </Card>
      
      {/* Client Price Offers */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Price Offers</h2>
          <Link href={`/dashboard/offers/create?clientId=${client.id}`}>
            <Button size="sm">Create Offer</Button>
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          {clientOffers.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Offer #</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid Until</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clientOffers.map((offer) => (
                  <tr key={offer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      <Link href={`/dashboard/offers/${offer.id}`}>{offer.offerNumber}</Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDisplayDate(offer.issueDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDisplayDate(offer.validUntil)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      ${offer.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        offer.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        offer.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                        offer.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/dashboard/offers/${offer.id}`} className="text-blue-600 hover:text-blue-900">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center py-4 text-gray-500">No price offers found for this client.</p>
          )}
        </div>
      </Card>
    </div>
  );
}