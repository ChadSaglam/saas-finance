"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import LineItemsTable from '@/components/invoices/LineItemsTable';
import { Invoice, InvoiceItem, Client } from '@/lib/models';
import { dummyClients } from '@/lib/dummy-data/clients';
import { dummyOffers } from '@/lib/dummy-data/offers';

interface InvoiceFormProps {
  initialData?: Partial<Invoice>;
  isEditing?: boolean;
}

export default function InvoiceForm({ initialData = {}, isEditing = false }: InvoiceFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientId = searchParams.get('clientId');
  
  const [formData, setFormData] = useState<Partial<Invoice>>({
    invoiceNumber: initialData.invoiceNumber || `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    client: initialData.client || '',
    issueDate: initialData.issueDate ? new Date(initialData.issueDate) : new Date(),
    dueDate: initialData.dueDate ? new Date(initialData.dueDate) : new Date(new Date().setDate(new Date().getDate() + 30)),
    items: initialData.items || [],
    subtotal: initialData.subtotal || 0,
    taxRate: initialData.taxRate || 0,
    taxAmount: initialData.taxAmount || 0,
    total: initialData.total || 0,
    notes: initialData.notes || '',
    status: initialData.status || 'draft'
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const offerIdParam = searchParams.get('fromOffer');
  
  useEffect(() => {
    // If clientId is provided in query params, set it in the form
    if (clientId && !initialData.client) {
      const client = dummyClients.find(c => c.id === clientId);
      if (client) {
        setFormData(prev => ({ ...prev, client }));
      }
    }
  }, [clientId, initialData.client]);

  useEffect(() => {
    // If fromOffer parameter is provided, pre-fill the form with offer data
    if (offerIdParam && !isEditing) {
      const offer = dummyOffers.find(o => o.id === offerIdParam);
      if (offer) {
        setFormData({
          invoiceNumber: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
          client: offer.client,
          issueDate: new Date(),
          dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
          items: offer.items,
          subtotal: offer.subtotal,
          taxRate: offer.taxRate,
          taxAmount: offer.taxAmount,
          total: offer.total,
          notes: `This invoice was created from offer ${offer.offerNumber}.\n\n${offer.notes || ''}`,
          status: 'draft'
        });
      }
    }
  }, [offerIdParam, isEditing]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'taxRate' ? parseFloat(value) || 0 : value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Recalculate totals if tax rate changes
    if (name === 'taxRate') {
      calculateTotals(formData.items as InvoiceItem[], parseFloat(value) || 0);
    }
  };
  
  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    const selectedClient = dummyClients.find(client => client.id === value);
    
    setFormData(prev => ({
      ...prev,
      client: selectedClient || ''
    }));
    
    // Clear error when field is edited
    if (errors.client) {
      setErrors(prev => ({
        ...prev,
        client: ''
      }));
    }
  };
  
  const handleDateChange = (field: 'issueDate' | 'dueDate', value: string) => {
    if (!value) return;
    
    setFormData(prev => ({
      ...prev,
      [field]: new Date(value)
    }));
    
    // Clear error when field is edited
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };
  
  const calculateTotals = (items: InvoiceItem[], taxRate = formData.taxRate || 0) => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;
    
    setFormData(prev => ({
      ...prev,
      subtotal,
      taxAmount,
      total,
      items
    }));
  };
  
  const handleItemsChange = (items: InvoiceItem[]) => {
    calculateTotals(items);
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.invoiceNumber?.trim()) {
      newErrors.invoiceNumber = 'Invoice number is required';
    }
    
    if (!formData.client) {
      newErrors.client = 'Client is required';
    }
    
    if (!(formData.items?.length ?? 0)) {
      newErrors.items = 'At least one item is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent, saveAsDraft = false) => {
    e.preventDefault();
    
    if (saveAsDraft) {
      // When saving as draft, just set status and proceed
      setFormData(prev => ({ ...prev, status: 'draft' }));
    } else if (!validateForm()) {
      // Only validate if not saving as draft
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real application, this would be an API call
      // For now, we'll just simulate a successful submission
      console.log('Submitting invoice data:', formData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to invoices list
      router.push('/dashboard/invoices');
    } catch (error) {
      console.error('Error submitting invoice:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Invoice Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700">Invoice Number</label>
          <input
            type="text"
            id="invoiceNumber"
            name="invoiceNumber"
            value={formData.invoiceNumber || ''}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm 
              ${errors.invoiceNumber ? 'border-red-300' : 'border-gray-300'}`}
          />
          {errors.invoiceNumber && <p className="mt-2 text-sm text-red-600">{errors.invoiceNumber}</p>}
        </div>
        
        <div>
          <label htmlFor="client" className="block text-sm font-medium text-gray-700">Client</label>
          <select
            id="client"
            name="client"
            value={typeof formData.client === 'object' ? formData.client.id : formData.client}
            onChange={handleClientChange}
            className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm 
              ${errors.client ? 'border-red-300' : 'border-gray-300'}`}
          >
            <option value="">Select a client</option>
            {dummyClients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
          {errors.client && <p className="mt-2 text-sm text-red-600">{errors.client}</p>}
        </div>
        
        <div>
          <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700">Issue Date</label>
          <input
            type="date"
            id="issueDate"
            name="issueDate"
            value={formData.issueDate ? formatDate(new Date(formData.issueDate)) : ''}
            onChange={(e) => handleDateChange('issueDate', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate ? formatDate(new Date(formData.dueDate)) : ''}
            onChange={(e) => handleDateChange('dueDate', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>
      
      {/* Line Items */}
      <div className="pt-6 border-t border-gray-200">
        <LineItemsTable 
          items={formData.items as InvoiceItem[] || []} 
          onChange={handleItemsChange} 
        />
        {errors.items && <p className="mt-2 text-sm text-red-600">{errors.items}</p>}
      </div>
      
      {/* Invoice Notes */}
      <div className="pt-6 border-t border-gray-200">
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          value={formData.notes || ''}
          onChange={handleChange}
          placeholder="Payment terms, delivery information, or any additional notes for the client..."
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>
      
      {/* Invoice Tax and Totals */}
      <div className="pt-6 border-t border-gray-200">
        <div className="flex justify-end">
          <div className="w-full md:w-1/3 space-y-3">
            <div className="flex justify-between">
              <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700">Tax Rate (%)</label>
              <input
                type="number"
                id="taxRate"
                name="taxRate"
                min="0"
                max="100"
                step="0.01"
                value={formData.taxRate || 0}
                onChange={handleChange}
                className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-right"
              />
            </div>
            
            <div className="flex justify-between pt-2">
              <span className="text-sm text-gray-500">Subtotal:</span>
              <span className="text-sm font-medium text-gray-900">${formData.subtotal?.toFixed(2) || '0.00'}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Tax Amount:</span>
              <span className="text-sm font-medium text-gray-900">${formData.taxAmount?.toFixed(2) || '0.00'}</span>
            </div>
            
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="text-base font-medium text-gray-900">Total:</span>
              <span className="text-base font-bold text-blue-600">${formData.total?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => router.push('/dashboard/invoices')}
        >
          Cancel
        </Button>
        <div className="flex space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={(e) => handleSubmit(e, true)}
            disabled={isSubmitting}
          >
            Save as Draft
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Invoice' : 'Create Invoice'}
          </Button>
        </div>
      </div>
    </form>
  );
}