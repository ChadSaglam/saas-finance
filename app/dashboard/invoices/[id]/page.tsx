"use client";

import { useState, useEffect, useMemo } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import StatusBadge from '@/components/ui/StatusBadge';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import LineItemsTable from '@/components/invoices/LineItemsTable';
import { dummyInvoices } from '@/lib/dummy-data/invoices';
import { usePageParams } from '@/lib/hooks/usePageParams';
import InvoicePDFDocument from '@/components/pdf/InvoicePDFDocument';
import { downloadPDF, saveInvoicePDF } from '@/lib/utils/pdf-service';
import DownloadPDF from '@/components/pdf/DownloadPDF';
import PrintButton from '@/components/pdf/PrintButton';
import SendInvoiceDialog from '@/components/invoices/SendInvoiceDialog';
import PDFPreviewDialog from '@/components/pdf/PDFPreviewDialog';
import { useCompanySettings } from '@/lib/contexts/CompanySettings';
import { Invoice } from '@/lib/models';
import { 
  EnvelopeIcon,
  PrinterIcon, 
  PencilIcon, 
  DownloadIcon,
  EyeIcon
} from '@/components/ui/Icons';

export default function InvoiceDetailPage() {
  const params = usePageParams();
  const id = params.id;
  
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Company settings context for logo and other business details
  const { settings: companySettings, currentDateTime, currentUser } = useCompanySettings();
  
  // Performance monitoring
  useEffect(() => {
    const startTime = performance.now();
    return () => {
      console.log(`Render time: ${Math.round(performance.now() - startTime)}ms`);
    };
  }, []);
  
  // Fetch invoice data - memoized to prevent unnecessary API calls
  useEffect(() => {
    const fetchInvoice = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call - added small timeout for realistic feeling
        setTimeout(() => {
          const foundInvoice = dummyInvoices.find(inv => inv.id === id);
          setInvoice(foundInvoice || null);
          setIsLoading(false);
        }, 100);
      } catch (error) {
        console.error('Error fetching invoice:', error);
        setIsLoading(false);
      }
    };
    
    fetchInvoice();
  }, [id]);
  
  // Show 404 if invoice doesn't exist
  if (!isLoading && !invoice) {
    notFound();
  }
  
  // Memoized values to prevent unnecessary recalculations
  const fileName = useMemo(() => {
    if (!invoice) return 'invoice.pdf';
    return `Invoice-${invoice.invoiceNumber}.pdf`;
  }, [invoice?.invoiceNumber]);
  
  const clientDetails = useMemo(() => {
    if (!invoice) return { name: 'Unknown Client', id: '' };
    return {
      name: typeof invoice.client === 'object' ? invoice.client.name : 'Unknown Client',
      id: typeof invoice.client === 'object' ? invoice.client.id : ''
    };
  }, [invoice?.client]);
  
  // Handle PDF download
  const handleDownloadPDF = async () => {
    if (!invoice) return;
    
    setIsGenerating(true);
    try {
      // Create the PDF document
      const pdfDocument = <InvoicePDFDocument invoice={invoice} companyInfo={companySettings} />;
      
      // Download the PDF
      await downloadPDF(pdfDocument, fileName);
      
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

  // Handle marking as paid
  const handleMarkAsPaid = () => {
    // In a real app, you would update the invoice status via API
    console.log('Marking invoice as paid');
    setInvoice(prev => prev ? { ...prev, status: 'paid' } : null);
  };

  // Handle cancelling invoice
  const handleCancelInvoice = () => {
    // In a real app, you would update the invoice status via API
    console.log('Cancelling invoice');
    setInvoice(prev => prev ? { ...prev, status: 'cancelled' } : null);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <LoadingSkeleton height="30px" width="250px" className="mb-2" />
          <div className="flex space-x-2">
            <LoadingSkeleton height="40px" width="120px" />
            <LoadingSkeleton height="40px" width="120px" />
          </div>
        </div>
        
        <LoadingSkeleton height="60px" className="mb-6" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <LoadingSkeleton height="500px" className="lg:col-span-2" />
          <LoadingSkeleton height="400px" />
        </div>
      </div>
    );
  }

  if (!invoice) return null;

  return (
    <AnimatedContainer animation="fade-in" duration={400}>
      {/* Header section with invoice number and action buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Invoice #{invoice.invoiceNumber}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {currentDateTime} • {currentUser}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
          <Button 
            onClick={() => setShowSendDialog(true)}
            variant="primary"
            className="w-full sm:w-auto"
          >
            <EnvelopeIcon className="h-5 w-5 mr-1" />
            Send to Client
          </Button>
          <Button 
            onClick={() => setShowPdfPreview(true)}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <EyeIcon className="h-5 w-5 mr-1" />
            Preview PDF
          </Button>
          <DownloadPDF 
            document={<InvoicePDFDocument invoice={invoice} companyInfo={companySettings} />}
            fileName={fileName}
            buttonText="Download"
            icon={<DownloadIcon className="h-5 w-5 mr-1" />}
            className="w-full sm:w-auto"
          />
          <Link href={`/dashboard/invoices/${invoice.id}/edit`} className="w-full sm:w-auto">
            <Button variant="outline" fullWidth>
              <PencilIcon className="h-5 w-5 mr-1" />
              Edit Invoice
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Status Bar */}
      <Card className="mb-6 card-shadow">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 space-y-2 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <StatusBadge status={invoice.status} type="invoice" size="md" />
            <span className="text-sm text-gray-500">
              Issued on {new Date(invoice.issueDate).toLocaleDateString()} • Due on {new Date(invoice.dueDate).toLocaleDateString()}
            </span>
          </div>
          <PrintButton 
            document={invoice}
            documentType="invoice"
            companyInfo={companySettings}
            variant="outline"
            size="sm"
            icon={<PrinterIcon className="h-5 w-5 mr-1" />}
          />
        </div>
      </Card>
      
      {/* Invoice Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Invoice details card */}
        <Card className="lg:col-span-2 card-shadow">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Invoice Details</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Created on {new Date(invoice.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Invoice Number</h3>
                <p className="mt-1 text-sm text-gray-900">{invoice.invoiceNumber}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Client</h3>
                <p className="mt-1 text-sm">
                  <Link href={`/dashboard/clients/${clientDetails.id}`} className="text-blue-600 hover:text-blue-800 transition-colors">
                    {clientDetails.name}
                  </Link>
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Issue Date</h3>
                <p className="mt-1 text-sm text-gray-900">{new Date(invoice.issueDate).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Due Date</h3>
                <p className="mt-1 text-sm text-gray-900">{new Date(invoice.dueDate).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Items</h3>
              <LineItemsTable 
                items={invoice.items} 
                readOnly={true} 
              />
            </div>
            
            {invoice.notes && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900">Notes</h3>
                <p className="mt-2 text-sm text-gray-500">{invoice.notes}</p>
              </div>
            )}
          </div>
        </Card>
        
        {/* Summary card */}
        <Card className="card-shadow">
          <div className="p-6">
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
              <div className="space-y-3">
                {invoice.status === 'draft' && (
                  <Button 
                    variant="primary" 
                    onClick={() => setShowSendDialog(true)}
                    fullWidth
                  >
                    <EnvelopeIcon className="h-5 w-5 mr-1" />
                    Send Invoice
                  </Button>
                )}
                {(invoice.status === 'sent' || invoice.status === 'overdue') && (
                  <Button 
                    variant="primary" 
                    onClick={handleMarkAsPaid}
                    fullWidth
                  >
                    Mark as Paid
                  </Button>
                )}
                {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
                  <Button 
                    variant="danger" 
                    onClick={handleCancelInvoice}
                    fullWidth
                  >
                    Cancel Invoice
                  </Button>
                )}
              </div>
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
    </AnimatedContainer>
  );
}