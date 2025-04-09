import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import Button from '@/components/ui/Button';
import { PDFDocumentElement } from '@/lib/types/pdf';

interface DownloadPDFProps {
  document: PDFDocumentElement;
  fileName: string;
  buttonText?: string;
  icon?: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
}

const DownloadPDF: React.FC<DownloadPDFProps> = ({
  document,
  fileName,
  buttonText = "Download",
  icon,
  className = "",
  variant = "outline"
}) => {
  return (
    <PDFDownloadLink
      document={document}
      fileName={fileName}
      className={`no-underline ${className}`}
    >
      {({ blob, url, loading, error }) => (
        <Button 
          variant={variant}
          disabled={loading}
          isLoading={loading}
          loadingText="Preparing PDF..."
          fullWidth={className.includes('w-full')}
        >
          {!loading && icon}
          {loading ? 'Preparing PDF...' : buttonText}
        </Button>
      )}
    </PDFDownloadLink>
  );
};

export default DownloadPDF;