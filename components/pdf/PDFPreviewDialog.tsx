import React from 'react';
import { PDFViewer, DocumentProps } from '@react-pdf/renderer';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { PDFDocumentElement } from '@/lib/types/pdf';

interface PDFPreviewDialogProps {
  title: string;
  children: PDFDocumentElement;
  onDownload: () => Promise<void>;
  onClose: () => void;
  isGenerating: boolean;
}

const PDFPreviewDialog: React.FC<PDFPreviewDialogProps> = ({ 
  title, 
  children, 
  onDownload, 
  onClose, 
  isGenerating 
}) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-800 bg-opacity-75 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">{title}</h2>
          <div className="flex space-x-2">
            <Button 
              onClick={onDownload} 
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Download PDF'}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
        
        <div className="flex-grow bg-gray-100">
          <PDFViewer style={{ width: '100%', height: '100%' }}>
            {children}
          </PDFViewer>
        </div>
      </Card>
    </div>
  );
};

export default PDFPreviewDialog;