"use client";

import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import InvoiceForm from '@/components/invoices/InvoiceForm';
import { dummyInvoices } from '@/lib/dummy-data/invoices';
import { usePageParams } from '@/lib/hooks/usePageParams';

export default function EditInvoicePage() {
  const params = usePageParams();
  const id = params.id;
    
  const invoice = dummyInvoices.find(inv => inv.id === id);
  
  if (!invoice) {
    notFound();
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Edit Invoice {invoice.invoiceNumber}</h1>
        <Link href={`/dashboard/invoices/${invoice.id}`}>
          <Button variant="outline">Cancel</Button>
        </Link>
      </div>
      
      <Card>
        <InvoiceForm initialData={invoice} isEditing={true} />
      </Card>
    </div>
  );
}