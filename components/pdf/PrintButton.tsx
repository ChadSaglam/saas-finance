import React from 'react';
import Button from '@/components/ui/Button';
import { Invoice, Offer, CompanySettings } from '@/lib/models';
import InvoicePDFDocument from '@/components/pdf/InvoicePDFDocument';
import OfferPDFDocument from '@/components/pdf/OfferPDFDocument';
import { openPDFInNewTab } from '@/lib/utils/pdf-service';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';

interface PrintButtonProps {
  document: Invoice | Offer;
  documentType: 'invoice' | 'offer';
  companyInfo: CompanySettings;
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

const PrintButton: React.FC<PrintButtonProps> = ({
  document,
  documentType,
  companyInfo,
  variant = 'outline',
  size,
  icon
}) => {
  const [isPrinting, setIsPrinting] = React.useState(false);

  const handlePrint = async () => {
    setIsPrinting(true);
    try {
      // Create the correct document based on type
      let pdfDocument;
      if (documentType === 'invoice') {
        pdfDocument = (
          <InvoicePDFDocument 
            invoice={document as Invoice} 
            companyInfo={companyInfo} 
          />
        );
      } else {
        pdfDocument = (
          <OfferPDFDocument 
            offer={document as Offer} 
            companyInfo={companyInfo} 
          />
        );
      }
      
      // Open PDF in new tab for printing
      await openPDFInNewTab(pdfDocument);
    } finally {
      setIsPrinting(false);
    }
  };
  
  return (
    <Button 
      onClick={handlePrint}
      variant={variant}
      size={size}
      isLoading={isPrinting}
      loadingText="Preparing..."
    >
      {!isPrinting && icon}
      Print
    </Button>
  );
};

export default PrintButton;