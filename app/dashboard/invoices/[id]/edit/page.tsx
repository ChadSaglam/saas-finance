"use client";

import React, { useReducer, useEffect, useMemo, useCallback } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/TextArea';
import Select from '@/components/ui/Select';
import { dummyInvoices } from '@/lib/dummy-data/invoices';
import { dummyClients } from '@/lib/dummy-data/clients';
import { usePageParams } from '@/lib/hooks/usePageParams';
import { formatInputDate, addDays } from '@/lib/utils/format';
import LineItemsEditor from '@/components/invoices/LineItemsEditor';
import { Invoice, LineItem, Client } from '@/lib/models';

type FormAction =
  | { type: 'SET_INVOICE_NUMBER'; payload: string }
  | { type: 'SET_CLIENT'; payload: string }
  | { type: 'SET_ISSUE_DATE'; payload: Date }
  | { type: 'SET_DUE_DATE'; payload: Date }
  | { type: 'SET_ITEMS'; payload: LineItem[] }
  | { type: 'SET_NOTES'; payload: string }
  | { type: 'SET_STATUS'; payload: Invoice['status'] }
  | { type: 'SET_TAX_RATE'; payload: number };

interface FormState {
  invoiceNumber: string;
  selectedClientId: string;
  issueDate: Date;
  dueDate: Date;
  items: LineItem[];
  notes: string;
  status: Invoice['status'];
  taxRate: number;
}

export default function EditInvoicePage() {
  const params = usePageParams();
  const id = params.id;
  const router = useRouter();
  
  // Performance monitoring
  useEffect(() => {
    const startTime = performance.now();
    return () => {
      console.log(`Edit page render time: ${Math.round(performance.now() - startTime)}ms`);
    };
  }, []);
  
  // Find the invoice to edit
  const existingInvoice = useMemo(() => {
    return dummyInvoices.find(inv => inv.id === id);
  }, [id]);
  
  // Return 404 if invoice not found
  if (!existingInvoice) {
    notFound();
  }
  
  // Get client info
  const clientId = useMemo(() => {
    return typeof existingInvoice.client === 'object' 
      ? existingInvoice.client.id 
      : existingInvoice.client;
  }, [existingInvoice]);
  
  // Form reducer for better state management
  const formReducer = (state: FormState, action: FormAction): FormState => {
    switch (action.type) {
      case 'SET_INVOICE_NUMBER':
        return { ...state, invoiceNumber: action.payload };
      case 'SET_CLIENT':
        return { ...state, selectedClientId: action.payload };
      case 'SET_ISSUE_DATE':
        return { ...state, issueDate: action.payload };
      case 'SET_DUE_DATE':
        return { ...state, dueDate: action.payload };
      case 'SET_ITEMS':
        return { ...state, items: action.payload };
      case 'SET_NOTES':
        return { ...state, notes: action.payload };
      case 'SET_STATUS':
        return { ...state, status: action.payload };
      case 'SET_TAX_RATE':
        return { ...state, taxRate: action.payload };
      default:
        return state;
    }
  };
  
  const [formState, dispatch] = useReducer(formReducer, {
    invoiceNumber: existingInvoice.invoiceNumber,
    selectedClientId: clientId,
    issueDate: new Date(existingInvoice.issueDate),
    dueDate: new Date(existingInvoice.dueDate),
    items: existingInvoice.items,
    notes: existingInvoice.notes || '',
    status: existingInvoice.status,
    taxRate: existingInvoice.taxRate
  });
  
  const totals = useMemo(() => {
    const subtotal = formState.items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = subtotal * (formState.taxRate / 100);
    const total = subtotal + taxAmount;
    
    return { subtotal, taxAmount, total };
  }, [formState.items, formState.taxRate]);
  
  const handleIssueDateChange = useCallback((date: string) => {
    const newIssueDate = new Date(date);
    dispatch({ type: 'SET_ISSUE_DATE', payload: newIssueDate });
    
    dispatch({ type: 'SET_DUE_DATE', payload: addDays(newIssueDate, 14) });
  }, []);
  
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedClient = dummyClients.find(c => c.id === formState.selectedClientId) as Client;
    
    const updatedInvoice: Invoice = {
      ...existingInvoice,
      invoiceNumber: formState.invoiceNumber,
      client: selectedClient,
      issueDate: formState.issueDate,
      dueDate: formState.dueDate,
      items: formState.items,
      notes: formState.notes,
      status: formState.status,
      taxRate: formState.taxRate,
      subtotal: totals.subtotal,
      taxAmount: totals.taxAmount,
      total: totals.total,
      updatedAt: new Date()
    };
    
    console.log('Saving invoice:', updatedInvoice);

    router.push(`/dashboard/invoices/${id}`);
  }, [existingInvoice, formState, totals, router, id]);

  // Options for the status dropdown
  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'sent', label: 'Sent' },
    { value: 'paid', label: 'Paid' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  // Options for the client dropdown
  const clientOptions = [
    { value: '', label: 'Select Client' },
    ...dummyClients.map(client => ({ 
      value: client.id, 
      label: client.name 
    }))
  ];

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
              <Input
                label="Invoice Number"
                id="invoiceNumber"
                value={formState.invoiceNumber}
                onChange={(e) => dispatch({ 
                  type: 'SET_INVOICE_NUMBER', 
                  payload: e.target.value 
                })}
                required
              />
              
              <Select
                label="Status"
                id="status"
                value={formState.status}
                options={statusOptions}
                onChange={(e) => dispatch({
                  type: 'SET_STATUS',
                  payload: e.target.value as Invoice['status']
                })}
                helpText="Current invoice status"
              />
              
              <Select
                label="Client"
                id="client"
                value={formState.selectedClientId}
                options={clientOptions}
                onChange={(e) => dispatch({
                  type: 'SET_CLIENT',
                  payload: e.target.value
                })}
                required
                error={formState.selectedClientId ? '' : 'Please select a client'}
              />
              
              <Input
                type="date"
                label="Issue Date"
                id="issueDate"
                value={formatInputDate(formState.issueDate)}
                onChange={(e) => handleIssueDateChange(e.target.value)}
                required
              />
              
              <Input
                type="date"
                label="Due Date"
                id="dueDate"
                value={formatInputDate(formState.dueDate)}
                onChange={(e) => dispatch({
                  type: 'SET_DUE_DATE',
                  payload: new Date(e.target.value)
                })}
                required
              />
              
              <Input
                type="number"
                label="Tax Rate (%)"
                id="taxRate"
                value={formState.taxRate.toString()}
                onChange={(e) => dispatch({
                  type: 'SET_TAX_RATE',
                  payload: parseFloat(e.target.value) || 0
                })}
                step="0.01"
                min="0"
                helpText="Applied to subtotal"
              />
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 mb-4">Line Items</h3>
            
            <LineItemsEditor 
              items={formState.items} 
              onChange={(updatedItems: LineItem[]) => dispatch({
                type: 'SET_ITEMS',
                payload: updatedItems
              })} 
            />
            
            <div className="mt-6">
              <Textarea
                label="Notes"
                id="notes"
                value={formState.notes}
                onChange={(e) => dispatch({
                  type: 'SET_NOTES',
                  payload: e.target.value
                })}
                rows={4}
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
                <p className="mt-1 text-sm text-gray-900">${totals.subtotal.toFixed(2)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Tax ({formState.taxRate}%)</h3>
                <p className="mt-1 text-sm text-gray-900">${totals.taxAmount.toFixed(2)}</p>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
                <p className="mt-1 text-lg font-semibold text-blue-600">${totals.total.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="space-y-4">
                <Button type="submit" variant="primary" fullWidth>
                  Save Changes
                </Button>
                <Link href={`/dashboard/invoices/${id}`} className="w-full">
                  <Button variant="outline" fullWidth>
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