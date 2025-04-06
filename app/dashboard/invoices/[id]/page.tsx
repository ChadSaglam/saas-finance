"use client";

import React, { useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LineItemsTable from '@/components/invoices/LineItemsTable';
import { dummyInvoices } from '@/lib/dummy-data/invoices';
import { usePageParams } from '@/lib/hooks/usePageParams';
import InvoicePDFDocument from '@/components/pdf/InvoicePDFDocument';
import { formatDisplayDate } from '@/lib/utils/date-format';
import { downloadPDF, saveInvoicePDF } from '@/lib/utils/pdf-service';
import QuickViewPDF from '@/components/pdf/QuickViewPDF';
import PrintButton from '@/components/pdf/PrintButton';
import SendInvoiceDialog from '@/components/invoices/SendInvoiceDialog';
import PDFPreviewDialog from '@/components/pdf/PDFPreviewDialog';
import { useCompanySettings } from '@/lib/contexts/CompanySettings';

export default function InvoiceDetailPage() {
  const params = usePageParams();
  const id = params.id;
  
  const invoice = dummyInvoices.find(inv => inv.id === id);

  const { settings: companySettings } = useCompanySettings();
  
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  if (!invoice) {
    notFound();
  }
  
  const status = invoice.status;
  const statusColors = {
    draft: 'bg-yellow-100 text-yellow-800',
    sent: 'bg-blue-100 text-blue-800',
    paid: 'bg-green-100 text-green-800',
    overdue: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800',
  };
  
  // Client details
  const clientName = typeof invoice.client === 'object' ? invoice.client.name : 'Unknown Client';
  const clientId = typeof invoice.client === 'object' ? invoice.client.id : '';
  
  // Format filename for download
  const getFileName = () => {
    return `Invoice-${invoice.invoiceNumber}-${formatDisplayDate(invoice.issueDate).replace(/\//g, '-')}.pdf`;
  };
  
  // Handle PDF download
  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      // Create the PDF document
      const pdfDocument = <InvoicePDFDocument invoice={invoice} companyInfo={companySettings} />;
      
      // Download the PDF
      await downloadPDF(pdfDocument, getFileName());
      
      // Optionally save the PDF to server/database
      await saveInvoicePDF(invoice, companySettings, (inv, company) => (
        <InvoicePDFDocument invoice={inv} companyInfo={company} />
      ));
    } catch (error) {
      console.error('Error downloading PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Handle email sent
  const handleEmailSent = () => {
    setShowSendDialog(false);
    // In a real app, you might update the invoice status here
    console.log('Email sent successfully');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Invoice #{invoice.invoiceNumber}</h1>
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={() => setShowSendDialog(true)}
          >
            Send to Client
          </Button>
          <Button 
            onClick={() => setShowPdfPreview(true)}
            variant="outline"
          >
            Preview PDF
          </Button>
          <QuickViewPDF 
            document={<InvoicePDFDocument invoice={invoice} companyInfo={companySettings} />}
            fileName={getFileName()}
            buttonText="Quick Download"
          />
          <PrintButton 
            document={invoice}
            documentType="invoice"
            companyInfo={companySettings}
          />
          <Link href={`/dashboard/invoices/${invoice.id}/edit`}>
            <Button variant="outline">Edit Invoice</Button>
          </Link>
        </div>
      </div>
      
      {/* Invoice Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Invoice Details</h2>
              <p className="mt-1 text-sm text-gray-500">
                Created on {invoice.createdAt.toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Status</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Invoice Number</h3>
              <p className="mt-1 text-sm text-gray-900">{invoice.invoiceNumber}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Client</h3>
              <p className="mt-1 text-sm text-blue-600">
                <Link href={`/dashboard/clients/${clientId}`}>{clientName}</Link>
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Issue Date</h3>
              <p className="mt-1 text-sm text-gray-900">{invoice.issueDate.toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Due Date</h3>
              <p className="mt-1 text-sm text-gray-900">{invoice.dueDate.toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="mt-6">
            <LineItemsTable 
              items={invoice.items} 
              onChange={() => {}}
              readOnly={true} 
            />
          </div>
          
          {invoice.notes && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">Notes</h3>
              <p className="mt-2 text-sm text-gray-500">{invoice.notes}</p>
            </div>
          )}
        </Card>
        
        <Card>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Summary</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Subtotal</h3>
              <p className="mt-1 text-sm text-gray-900">${invoice.subtotal.toFixed(2)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Tax ({invoice.taxRate}%)</h3>
              <p className="mt-1 text-sm text-gray-900">${invoice.taxAmount.toFixed(2)}</p>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
              <p className="mt-1 text-lg font-semibold text-blue-600">${invoice.total.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Actions</h3>
            <div className="space-y-2">
              {status === 'draft' && (
                <Button variant="primary" fullWidth>Send Invoice</Button>
              )}
              {(status === 'sent' || status === 'overdue') && (
                <Button variant="primary" fullWidth>Mark as Paid</Button>
              )}
              <Button variant="outline" fullWidth>Download PDF</Button>
              {status !== 'paid' && status !== 'cancelled' && (
                <Button variant="danger" fullWidth>Cancel Invoice</Button>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* PDF Preview Modal */}
      {showPdfPreview && (
        <PDFPreviewDialog
          title={`Invoice ${invoice.invoiceNumber}`}
          onDownload={handleDownloadPDF}
          onClose={() => setShowPdfPreview(false)}
          isGenerating={isGenerating}
        >
          <InvoicePDFDocument 
            invoice={invoice} 
            companyInfo={companySettings} 
          />
        </PDFPreviewDialog>
      )}
      
      {/* Send Invoice Dialog */}
      {showSendDialog && (
        <SendInvoiceDialog 
          invoice={invoice}
          onClose={() => setShowSendDialog(false)}
          onSend={handleEmailSent}
        />
      )}
    </div>
  );
}