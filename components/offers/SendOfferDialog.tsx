'use client';

import { useState, useEffect } from 'react';
import { Offer } from '@/lib/models';
import OfferPDFDocument from '@/components/pdf/OfferPDFDocument';
import PDFGenerator from '@/components/pdf/PDFGenerator';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { blobToDataURL } from '@/lib/utils/pdf-service';
import { useCompanySettings } from '@/lib/contexts/CompanySettings';

interface SendOfferDialogProps {
  offer: Offer;
  onClose: () => void;
  onSend: () => void;
}

const SendOfferDialog: React.FC<SendOfferDialogProps> = ({ offer, onClose, onSend }) => {
  const { settings: companySettings } = useCompanySettings();
  
  const [email, setEmail] = useState('');
  // Initialize with basic values, not derived from context
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null);
  
  // Update message and subject when companySettings or offer changes
  useEffect(() => {
    setSubject(`Price Offer ${offer.offerNumber} from ${companySettings.name}`);
    
    const clientName = typeof offer.client === 'object' ? offer.client.name : 'Client';
    const validUntil = new Date(offer.validUntil).toLocaleDateString();

    setMessage(
      `Dear ${clientName},\n\n` +
      `Please find attached our price offer ${offer.offerNumber} in the amount of $${offer.total.toFixed(2)}.\n\n` +
      `This offer is valid until ${validUntil}.\n\n` +
      `We look forward to your feedback. If you have any questions or would like to discuss any aspect of this offer, please don't hesitate to contact us.\n\n` +
      `Best regards,\n${companySettings.name}`
    );
  }, [offer, companySettings]);
  
  // Rest of the component remains the same
  const handlePdfGenerated = async (blob: Blob) => {
    setPdfBlob(blob);
    try {
      const dataUrl = await blobToDataURL(blob);
      setPdfDataUrl(dataUrl);
    } catch (error) {
      console.error('Error converting blob to data URL:', error);
    }
  };
  
  const handleSend = async () => {
    if (!pdfBlob || !pdfDataUrl) return;
    
    setIsSending(true);
    try {
      console.log('Sending offer email with PDF attachment', {
        to: email,
        subject,
        message,
        attachment: {
          filename: `PriceOffer-${offer.offerNumber}.pdf`,
          content: pdfDataUrl,
          contentType: 'application/pdf'
        }
      });
      
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
      <Card className="w-full max-w-2xl">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Send Price Offer by Email</h2>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Recipient Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>
          
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              id="message"
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>
          
          <div className="bg-gray-50 p-3 rounded border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Attachments:</h3>
            <div className="flex items-center space-x-2">
              <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.5 17a4.5 4.5 0 01-1.44-8.765 4.5 4.5 0 018.302-3.046 3.5 3.5 0 014.504 4.272A4 4 0 0115 17H5.5zm3.75-2.75a.75.75 0 001.5 0V9.66l1.95 2.1a.75.75 0 101.1-1.02l-3.25-3.5a.75.75 0 00-1.1 0l-3.25 3.5a.75.75 0 101.1 1.02l1.95-2.1v4.59z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-gray-600">
                PriceOffer-{offer.offerNumber}.pdf
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
            onClick={handleSend} 
            disabled={isSending || !pdfBlob || !email}
          >
            {isSending ? 'Sending...' : 'Send Email'}
          </Button>
        </div>
        
        <PDFGenerator
          document={<OfferPDFDocument offer={offer} companyInfo={companySettings} />}
          onComplete={handlePdfGenerated}
        />
      </Card>
    </div>
  );
};

export default SendOfferDialog;