import React from 'react';
import { PDFDownloadLink, DocumentProps } from '@react-pdf/renderer';
import Button from '@/components/ui/Button';
import { PDFDocumentElement } from '@/lib/types/pdf';

interface QuickViewPDFProps {
  document: PDFDocumentElement;
  fileName: string;
  buttonText?: string;
}

const QuickViewPDF: React.FC<QuickViewPDFProps> = ({
  document,
  fileName,
  buttonText = "Quick Download"
}) => {
  return (
    <PDFDownloadLink
      document={document}
      fileName={fileName}
      className="no-underline"
    >
      {({ blob, url, loading, error }) => (
        <Button 
          variant="outline"
          disabled={loading}
        >
          {loading ? 'Preparing PDF...' : buttonText}
        </Button>
      )}
    </PDFDownloadLink>
  );
};

export default QuickViewPDF;