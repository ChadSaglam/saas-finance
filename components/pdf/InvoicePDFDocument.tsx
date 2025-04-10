import React from 'react';
import { Document, Page } from '@react-pdf/renderer';
import { Invoice, CompanySettings } from '@/lib/models';
import { invoiceStyles } from '@/lib/styles/InvoiceStyles';
import { InvoiceHeader } from './sections/InvoiceHeader';
import { InvoiceInfo } from './sections/InvoiceInfo';
import { LineItemsTable } from './sections/LineItemsTable';
import { InvoiceTotals } from './sections/InvoiceTotals';
import { InvoiceFooter } from './sections/InvoiceFooter';

// Define props interface
interface InvoicePDFDocumentProps {
  invoice: Invoice;
  companyInfo: CompanySettings;
}

const InvoicePDFDocument: React.FC<InvoicePDFDocumentProps> = ({ invoice, companyInfo }) => {
  return (
    <Document>
      <Page size="A4" style={invoiceStyles.page} wrap>
        {/* Header with Logo and Company Info */}
        <InvoiceHeader 
          invoiceNumber={invoice.invoiceNumber}
          companyInfo={companyInfo} 
        />
        
        {/* Bill To and Invoice Info */}
        <InvoiceInfo invoice={invoice} />
        
        {/* Invoice Items Table */}
        <LineItemsTable items={invoice.items} />
        
        {/* Totals Section */}
        <InvoiceTotals invoice={invoice} />
        
        {/* Footer Sections */}
        <InvoiceFooter 
          notes={invoice.notes}
          companyInfo={companyInfo}
        />
      </Page>
    </Document>
  );
};

export default InvoicePDFDocument;