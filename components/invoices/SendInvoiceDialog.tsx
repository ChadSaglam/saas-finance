'use client';

import { useState, useEffect } from 'react';
import { Invoice } from '@/lib/models';
import InvoicePDFDocument from '@/components/pdf/InvoicePDFDocument';
import PDFGenerator from '@/components/pdf/PDFGenerator';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/TextArea';
import { blobToDataURL } from '@/lib/utils/pdf-service';
import { useCompanySettings } from '@/lib/contexts/CompanySettings';
import { PaperClipIcon, XIcon, EnvelopeIcon } from '@/components/ui/Icons';

interface SendInvoiceDialogProps {
  invoice: Invoice;
  onClose: () => void;
  onSend: () => void;
}

const SendInvoiceDialog: React.FC<SendInvoiceDialogProps> = ({ invoice, onClose, onSend }) => {
  const { settings: companySettings } = useCompanySettings();
  
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null);
  
  // Update message and subject when companySettings or invoice changes
  useEffect(() => {
    setSubject(`Invoice ${invoice.invoiceNumber} from ${companySettings.name}`);
    
    const clientName = typeof invoice.client === 'object' ? invoice.client.name : 'Client';
    const dueDate = new Date(invoice.dueDate).toLocaleDateString();

    setMessage(
      `Dear ${clientName},\n\n` +
      `Please find attached invoice ${invoice.invoiceNumber} in the amount of $${invoice.total.toFixed(2)}.\n\n` +
      `This invoice is due on ${dueDate}.\n\n` +
      `If you have any questions, please don't hesitate to contact us.\n\n` +
      `Best regards,\n${companySettings.name}`
    );
    
    // Set recipient email if client object is available
    if (typeof invoice.client === 'object' && invoice.client.email) {
      setEmail(invoice.client.email);
    }
  }, [invoice, companySettings]);
  
  // Handle the generated PDF blob
  const handlePdfGenerated = async (blob: Blob) => {
    setPdfBlob(blob);
    // Convert to data URL for email attachments
    try {
      const dataUrl = await blobToDataURL(blob);
      setPdfDataUrl(dataUrl);
    } catch (error) {
      console.error('Error converting blob to data URL:', error);
    }
  };
  
  // Send email with PDF attachment
  const handleSend = async () => {
    if (!pdfBlob || !pdfDataUrl) return;
    
    setIsSending(true);
    try {
      // In a real app, you would send the email to your backend API
      console.log('Sending email with PDF attachment', {
        to: email,
        subject,
        message,
        attachment: {
          filename: `Invoice-${invoice.invoiceNumber}.pdf`,
          content: pdfDataUrl,
          contentType: 'application/pdf'
        }
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSend();
    } catch (error) {
      console.error('Error sending email:', error);
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-800 bg-opacity-75 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl card-shadow">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Send Invoice by Email</h2>
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="p-1 h-auto rounded-full"
          >
            <XIcon className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        
        <div className="p-6 space-y-4">
          <Input
            label="Recipient Email"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="client@example.com"
          />
          
          <Input
            label="Subject"
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
          
          <Textarea
            label="Message"
            id="message"
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Attachments:</h3>
            <div className="flex items-center space-x-2">
              <PaperClipIcon className="h-5 w-5 text-red-500" />
              <span className="text-sm text-gray-600">
                Invoice-{invoice.invoiceNumber}.pdf
                {pdfBlob ? ` (${(pdfBlob.size / 1024).toFixed(1)} KB)` : ' (generating...)'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t bg-gray-50 flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="primary"
            onClick={handleSend} 
            disabled={isSending || !pdfBlob || !email}
            isLoading={isSending}
            loadingText="Sending..."
          >
            <EnvelopeIcon className="h-5 w-5 mr-1" />
            Send Email
          </Button>
        </div>
        
        {/* Hidden PDF generator */}
        <PDFGenerator
          document={<InvoicePDFDocument invoice={invoice} companyInfo={companySettings} />}
          onComplete={handlePdfGenerated}
        />
      </Card>
    </div>
  );
};

export default SendInvoiceDialog;