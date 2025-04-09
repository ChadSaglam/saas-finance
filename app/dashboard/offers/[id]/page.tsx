"use client";

import React, { useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LineItemsTable from '@/components/invoices/LineItemsTable';
import { dummyOffers } from '@/lib/dummy-data/offers';
import { formatDisplayDate } from '@/lib/utils/date-format';
import { usePageParams } from '@/lib/hooks/usePageParams';
import OfferPDFDocument from '@/components/pdf/OfferPDFDocument';
import { downloadPDF, saveOfferPDF } from '@/lib/utils/pdf-service';
import QuickViewPDF from '@/components/pdf/QuickViewPDF';
import PrintButton from '@/components/pdf/PrintButton';
import PDFPreviewDialog from '@/components/pdf/PDFPreviewDialog';
import { useCompanySettings } from '@/lib/contexts/CompanySettings';
import SendOfferDialog from '@/components/offers/SendOfferDialog';

export default function OfferDetailPage() {
  const params = usePageParams();

  const id = params.id;
  const offer = dummyOffers.find(o => o.id === id);
  
  // Get company settings from context
  const { settings: companySettings } = useCompanySettings();
  
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  if (!offer) {
    notFound();
  }

  const status = offer.status;
  const statusColors = {
    draft: 'bg-yellow-100 text-yellow-800',
    sent: 'bg-blue-100 text-blue-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    expired: 'bg-gray-100 text-gray-800',
  };
  
  // Client details
  const clientName = typeof offer.client === 'object' ? offer.client.name : 'Unknown Client';
  const clientId = typeof offer.client === 'object' ? offer.client.id : '';
  
  // Check if the offer can be converted to invoice
  const canConvertToInvoice = status === 'accepted';
  
  // Check if the offer has expired
  const isExpired = new Date() > new Date(offer.validUntil) && status !== 'accepted' && status !== 'rejected';
  
  // Format filename for download
  const getFileName = () => {
    return `PriceOffer-${offer.offerNumber}-${formatDisplayDate(offer.issueDate).replace(/\//g, '-')}.pdf`;
  };
  
  // Handle PDF download
  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      // Create the PDF document
      const pdfDocument = <OfferPDFDocument offer={offer} companyInfo={companySettings} />;
      
      // Download the PDF
      await downloadPDF(pdfDocument, getFileName());
      
      // Optionally save the PDF to server/database
      await saveOfferPDF(offer, companySettings, (ofr, company) => (
        <OfferPDFDocument offer={ofr} companyInfo={company} />
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
    // In a real app, you might update the offer status here
    console.log('Offer email sent successfully');
  };
  
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Price Offer {offer.offerNumber}</h1>
          <span className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
          {isExpired && status !== 'expired' && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Expired
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {/* Update button to open dialog for both draft and sent status */}
          {(status === 'draft' || status === 'sent') && (
            <Button onClick={() => setShowSendDialog(true)}>
              Send to Client
            </Button>
          )}
          {canConvertToInvoice && (
            <Link href={`/dashboard/invoices/create?fromOffer=${offer.id}`}>
              <Button>Convert to Invoice</Button>
            </Link>
          )}
          <Button 
            onClick={() => setShowPdfPreview(true)}
            variant="outline"
          >
            Preview PDF
          </Button>
          <QuickViewPDF 
            document={<OfferPDFDocument offer={offer} companyInfo={companySettings} />}
            fileName={getFileName()}
            buttonText="Quick Download"
          />
          <PrintButton 
            document={offer}
            documentType="offer"
            companyInfo={companySettings}
          />
          <Link href={`/dashboard/offers/${offer.id}/edit`}>
            <Button variant="outline">Edit Offer</Button>
          </Link>
        </div>
      </div>
      
      {/* Offer Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Offer Details</h2>
              <p className="mt-1 text-sm text-gray-500">
                Created on {formatDisplayDate(offer.createdAt)}
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
              <h3 className="text-sm font-medium text-gray-500">Offer Number</h3>
              <p className="mt-1 text-sm text-gray-900">{offer.offerNumber}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Client</h3>
              <p className="mt-1 text-sm text-blue-600">
                <Link href={`/dashboard/clients/${clientId}`}>{clientName}</Link>
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Issue Date</h3>
              <p className="mt-1 text-sm text-gray-900">{formatDisplayDate(offer.issueDate)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Valid Until</h3>
              <p className="mt-1 text-sm text-gray-900">{formatDisplayDate(offer.validUntil)}</p>
            </div>
          </div>
          
          <div className="mt-6">
            <LineItemsTable 
              items={offer.items} 
              onChange={() => {}} 
              readOnly={true} 
            />
          </div>
          
          {offer.notes && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">Notes</h3>
              <p className="mt-2 text-sm text-gray-500">{offer.notes}</p>
            </div>
          )}
        </Card>
        
        <Card>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Summary</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Subtotal</h3>
              <p className="mt-1 text-sm text-gray-900">${offer.subtotal.toFixed(2)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Tax ({offer.taxRate}%)</h3>
              <p className="mt-1 text-sm text-gray-900">${offer.taxAmount.toFixed(2)}</p>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
              <p className="mt-1 text-lg font-semibold text-blue-600">${offer.total.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Actions</h3>
            <div className="space-y-2">
              {status === 'draft' && (
                <Button variant="primary" >Send to Client</Button>
              )}
              {status === 'sent' && (
                <>
                  <Button variant="primary" >Mark as Accepted</Button>
                  <Button variant="danger" >Mark as Rejected</Button>
                </>
              )}
              {canConvertToInvoice && (
                <Link href={`/dashboard/invoices/create?fromOffer=${offer.id}`}>
                  <Button variant="primary" >Convert to Invoice</Button>
                </Link>
              )}
              <Button variant="outline" >Download PDF</Button>
              {status !== 'accepted' && status !== 'rejected' && status !== 'expired' && (
                <Button variant="danger" >Cancel Offer</Button>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* PDF Preview Modal */}
      {showPdfPreview && (
        <PDFPreviewDialog
          title={`Price Offer ${offer.offerNumber}`}
          onDownload={handleDownloadPDF}
          onClose={() => setShowPdfPreview(false)}
          isGenerating={isGenerating}
        >
          <OfferPDFDocument 
            offer={offer} 
            companyInfo={companySettings} 
          />
        </PDFPreviewDialog>
      )}
      
      {/* Send Offer Dialog */}
      {showSendDialog && (
        <SendOfferDialog
          offer={offer}
          onClose={() => setShowSendDialog(false)}
          onSend={handleEmailSent}
        />
      )}
    </div>
  );
}