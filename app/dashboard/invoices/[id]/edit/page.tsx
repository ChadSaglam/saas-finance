"use client";

import React, { useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { dummyInvoices } from '@/lib/dummy-data/invoices';
import { dummyClients } from '@/lib/dummy-data/clients';
import { usePageParams } from '@/lib/hooks/usePageParams';
import { formatInputDate } from '@/lib/utils/date-format';
import LineItemsEditor from '@/components/invoices/LineItemsEditor';
import { addDays } from '@/lib/utils/date-format';
import { Invoice, LineItem, Client } from '@/lib/models';
import { useRouter } from 'next/navigation';

export default function EditInvoicePage() {
  const params = usePageParams();
  const id = params.id;
  const router = useRouter();
  
  // Find the invoice to edit
  const existingInvoice = dummyInvoices.find(inv => inv.id === id);
  
  if (!existingInvoice) {
    notFound();
  }
  
  // Get client info
  const clientId = typeof existingInvoice.client === 'object' 
    ? existingInvoice.client.id 
    : existingInvoice.client;
  
  // State for invoice form
  const [invoiceNumber, setInvoiceNumber] = useState(existingInvoice.invoiceNumber);
  const [selectedClientId, setSelectedClientId] = useState(clientId);
  const [issueDate, setIssueDate] = useState(existingInvoice.issueDate);
  const [dueDate, setDueDate] = useState(existingInvoice.dueDate);
  const [items, setItems] = useState<LineItem[]>(existingInvoice.items);
  const [notes, setNotes] = useState(existingInvoice.notes || '');
  const [status, setStatus] = useState(existingInvoice.status);
  const [taxRate, setTaxRate] = useState(existingInvoice.taxRate);
  
  // Calculate totals
  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;
    
    return { subtotal, taxAmount, total };
  };
  
  const { subtotal, taxAmount, total } = calculateTotals();
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedClient = dummyClients.find(c => c.id === selectedClientId) as Client;
    
    const updatedInvoice: Invoice = {
      ...existingInvoice,
      invoiceNumber,
      client: selectedClient,
      issueDate,
      dueDate,
      items,
      notes,
      status,
      taxRate,
      subtotal,
      taxAmount,
      total,
      updatedAt: new Date()
    };
    
    console.log('Saving invoice:', updatedInvoice);
    // In a real app, you would save this to your database
    
    // Navigate back to the invoice detail page
    router.push(`/dashboard/invoices/${id}`);
  };
  
  // Update due date when issue date changes
  const handleIssueDateChange = (date: string) => {
    const newIssueDate = new Date(date);
    setIssueDate(newIssueDate);
    
    // Auto-update due date to issue date + 14 days
    setDueDate(addDays(newIssueDate, 14));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Edit Invoice</h1>
        <div className="flex space-x-2">
          <Link href={`/dashboard/invoices/${id}`}>
            <Button variant="outline">Cancel</Button>
          </Link>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Invoice Details */}
          <Card className="lg:col-span-2">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Invoice Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Number
                </label>
                <input
                  type="text"
                  id="invoiceNumber"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Invoice['status'])}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-1">
                  Client
                </label>
                <select
                  id="client"
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                >
                  <option value="">Select Client</option>
                  {dummyClients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Issue Date
                </label>
                <input
                  type="date"
                  id="issueDate"
                  value={formatInputDate(issueDate)}
                  onChange={(e) => handleIssueDateChange(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  id="dueDate"
                  value={formatInputDate(dueDate)}
                  onChange={(e) => setDueDate(new Date(e.target.value))}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700 mb-1">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  id="taxRate"
                  value={taxRate}
                  onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                  step="0.01"
                  min="0"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 mb-4">Line Items</h3>
            
            <LineItemsEditor 
              items={items} 
              onChange={setItems} 
            />
            
            <div className="mt-6">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Add any notes or payment instructions..."
              />
            </div>
          </Card>
          
          {/* Summary */}
          <Card>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Summary</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Subtotal</h3>
                <p className="mt-1 text-sm text-gray-900">${subtotal.toFixed(2)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Tax ({taxRate}%)</h3>
                <p className="mt-1 text-sm text-gray-900">${taxAmount.toFixed(2)}</p>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
                <p className="mt-1 text-lg font-semibold text-blue-600">${total.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="space-y-4">
                <Button type="submit" variant="primary">
                  Save Changes
                </Button>
                <Link href={`/dashboard/invoices/${id}`}>
                  <Button variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
}