"use client";

import React from 'react';
import Modal from '@/components/ui/Modal';
import { Invoice, Offer, CompanySettings } from '@/lib/models';
import Button from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/utils/format';

interface DocumentPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  document: Invoice | Offer;
  companySettings: CompanySettings;
  type: 'invoice' | 'offer';
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  isOpen,
  onClose,
  document,
  companySettings,
  type
}) => {
  // Determine if document is invoice or offer
  const isInvoice = type === 'invoice';
  const documentTitle = isInvoice ? 'Invoice' : 'Price Offer';
  const documentNumber = isInvoice 
    ? (document as Invoice).invoiceNumber 
    : (document as Offer).offerNumber;
    
  const dateLabel = isInvoice ? 'Invoice Date' : 'Offer Date';
  const dateValue = formatDate(document.issueDate);
  
  const secondaryDateLabel = isInvoice ? 'Due Date' : 'Valid Until';
  const secondaryDateValue = formatDate(
    isInvoice ? (document as Invoice).dueDate : (document as Offer).validUntil
  );
  
  // Status display
  const getStatusDisplay = () => {
    let statusClass = '';
    let statusText = document.status;
    
    switch (document.status) {
      case 'paid':
      case 'accepted':
        statusClass = 'bg-green-100 text-green-800';
        break;
      case 'overdue':
      case 'rejected':
      case 'expired':
        statusClass = 'bg-red-100 text-red-800';
        break;
      case 'sent':
        statusClass = 'bg-blue-100 text-blue-800';
        break;
      default:
        statusClass = 'bg-gray-100 text-gray-800';
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium ${statusClass}`}>
        {statusText.charAt(0).toUpperCase() + statusText.slice(1)}
      </span>
    );
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${documentTitle} Preview`} size="xl">
      <div className="bg-gray-50 p-6">
        <div className="bg-white shadow rounded-lg overflow-hidden max-w-4xl mx-auto">
          {/* Document Header */}
          <div 
            className="p-8 border-b" 
            style={{ 
              borderColor: companySettings.primaryColor || '#1f2937',
              background: 'linear-gradient(to right, rgba(249, 250, 251, 1), white)'
            }}
          >
            <div className="flex flex-col sm:flex-row justify-between">
              <div className="flex items-start">
                {companySettings.logo ? (
                  <img 
                    src={companySettings.logo} 
                    alt={companySettings.name} 
                    className="h-16 w-auto"
                  />
                ) : (
                  <div className="h-16 w-16 bg-gray-100 flex items-center justify-center rounded">
                    <span className="text-gray-500 text-xl font-medium">Logo</span>
                  </div>
                )}
                
                <div className="ml-4">
                  <h2 className="text-2xl font-bold" style={{ color: companySettings.primaryColor || '#1f2937' }}>
                    {companySettings.name}
                  </h2>
                  <div className="text-sm text-gray-600 mt-1">
                    <div>{companySettings.address}</div>
                    <div>{companySettings.postcode} {companySettings.city}</div>
                    <div>{companySettings.country}</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 sm:mt-0 text-right">
                <h1 className="text-3xl font-bold" style={{ color: companySettings.primaryColor || '#1f2937' }}>
                  {documentTitle.toUpperCase()}
                </h1>
                <div className="text-lg font-medium mt-1" style={{ color: companySettings.accentColor || '#3b82f6' }}>
                  #{documentNumber}
                </div>
                <div className="mt-4 flex flex-col items-end">
                  <div className="flex justify-between w-32 mb-1">
                    <span className="text-sm text-gray-600">{dateLabel}:</span>
                    <span className="text-sm font-medium">{dateValue}</span>
                  </div>
                  <div className="flex justify-between w-32">
                    <span className="text-sm text-gray-600">{secondaryDateLabel}:</span>
                    <span className="text-sm font-medium">{secondaryDateValue}</span>
                  </div>
                  <div className="mt-2">
                    {getStatusDisplay()}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Client Info */}
          <div className="p-8 border-b border-gray-200">
            <h3 className="text-lg font-medium mb-2">Client</h3>
            <div className="text-sm">
              <div className="font-semibold">
                {typeof document.client === 'string' ? 'Client Name' : document.client.name}
              </div>
              <div>
                {typeof document.client === 'string' ? 'Contact Person' : document.client.contactPerson}
              </div>
              <div>
                {typeof document.client === 'string' ? 'Client Address' : document.client.address}
              </div>
              <div className="mt-1">
                {typeof document.client === 'string' ? 'client@example.com' : document.client.email}
              </div>
              <div>
                {typeof document.client === 'string' ? '+1 234 567 890' : document.client.phone}
              </div>
            </div>
          </div>
          
          {/* Line Items */}
          <div className="p-8">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th className="py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {document.items.map((item, index) => (
                  <tr 
                    key={item.id} 
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} transition-colors`}
                  >
                    <td className="py-4">
                      <div className="text-sm font-medium text-gray-900">{item.description}</div>
                      {item.code && (
                        <div className="text-xs text-gray-500 mt-1">
                          <span className="font-mono">{item.code}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 text-sm text-gray-900 text-right whitespace-nowrap">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-4 text-sm text-gray-900 text-right whitespace-nowrap">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="py-4 text-sm text-gray-900 text-right whitespace-nowrap">
                      {formatCurrency(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-gray-300">
                  <td colSpan={2}></td>
                  <td className="py-4 text-sm font-medium text-gray-900 text-right">
                    Subtotal
                  </td>
                  <td className="py-4 text-sm text-gray-900 text-right">
                    {formatCurrency(document.subtotal)}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}></td>
                  <td className="py-2 text-sm font-medium text-gray-900 text-right">
                    Tax ({document.taxRate}%)
                  </td>
                  <td className="py-2 text-sm text-gray-900 text-right">
                    {formatCurrency(document.taxAmount)}
                  </td>
                </tr>
                <tr className="border-t-2 border-gray-400">
                  <td colSpan={2}></td>
                  <td className="py-4 text-base font-bold text-gray-900 text-right">
                    Total
                  </td>
                  <td className="py-4 text-base font-bold text-gray-900 text-right">
                    {formatCurrency(document.total)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          {/* Notes & Terms */}
          <div className="p-8 border-t border-gray-200 bg-gray-50">
            {document.notes && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Notes</h3>
                <p className="text-sm text-gray-600">{document.notes}</p>
              </div>
            )}
            
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Terms & Conditions</h3>
              <p className="text-sm text-gray-600">
                {isInvoice 
                  ? (companySettings.invoiceTerms || 'Payment is due within 14 days of receipt.')
                  : (companySettings.offerTerms || 'This offer is valid until the specified date.')
                }
              </p>
            </div>
            
            <div className="mt-8 text-xs text-gray-500 text-center">
              <p>{isInvoice ? companySettings.invoiceFooter : companySettings.offerFooter}</p>
              <p className="mt-2">{companySettings.email} | {companySettings.phone} | {companySettings.website}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
        <Button
          onClick={onClose}
          className="w-full sm:ml-3 sm:w-auto mb-2 sm:mb-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
          </svg>
          Download PDF
        </Button>
        <Button
          onClick={onClose}
          variant="outline"
          className="w-full sm:ml-3 sm:w-auto mb-2 sm:mb-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          Edit
        </Button>
        <Button
          onClick={onClose}
          variant="secondary"
          className="w-full sm:w-auto"
        >
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default DocumentPreview;