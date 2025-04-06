import { pdf } from '@react-pdf/renderer';
import type { Invoice, Offer, CompanySettings } from '@/lib/models';
import { PDFDocumentElement } from '@/lib/types/pdf';

/**
 * Generate PDF from React component and return a blob
 * @param pdfDocument React component to render to PDF
 * @returns Promise resolving to Blob
 */
export const generatePDFBlob = async (pdfDocument: PDFDocumentElement): Promise<Blob> => {
  const blob = await pdf(pdfDocument).toBlob();
  return blob;
};

/**
 * Download PDF using modern browser APIs (no dependencies)
 * @param pdfDocument React component to render to PDF
 * @param filename Name of the file to download
 * @returns Promise resolving when download starts
 */
export const downloadPDF = async (pdfDocument: PDFDocumentElement, filename: string): Promise<void> => {
  const blob = await generatePDFBlob(pdfDocument);
  
  // Create a URL for the blob
  const url = URL.createObjectURL(blob);
  
  // Create a temporary link element to trigger the download
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  // Append to the document, click and then remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  setTimeout(() => URL.revokeObjectURL(url), 100);
};

/**
 * Generate and save invoice PDF
 * @param invoice Invoice to generate PDF for
 * @param companySettings Company settings to use in PDF
 * @param pdfRenderer Function that renders the PDF component
 * @returns Promise resolving to PDF URL or null
 */
export const saveInvoicePDF = async (
  invoice: Invoice,
  companySettings: CompanySettings,
  pdfRenderer: (invoice: Invoice, companySettings: CompanySettings) => PDFDocumentElement
): Promise<string | null> => {
  try {
    // Generate the PDF document
    const pdfDocument = pdfRenderer(invoice, companySettings);
    const blob = await generatePDFBlob(pdfDocument);
    
    // Here you would upload to MongoDB or cloud storage
    // For now, log and return a mock URL
    console.log(`Generated PDF for invoice ${invoice.id}`);
    
    return `https://storage.invoicepro.com/invoices/${invoice.id}.pdf`;
  } catch (error) {
    console.error('Error saving invoice PDF:', error);
    return null;
  }
};

/**
 * Generate and save offer PDF
 * @param offer PriceOffer to generate PDF for
 * @param companySettings Company settings to use in PDF
 * @param pdfRenderer Function that renders the PDF component
 * @returns Promise resolving to PDF URL or null
 */
export const saveOfferPDF = async (
  offer: Offer,
  companySettings: CompanySettings,
  pdfRenderer: (offer: Offer, companySettings: CompanySettings) => PDFDocumentElement
): Promise<string | null> => {
  try {
    // Generate the PDF document
    const pdfDocument = pdfRenderer(offer, companySettings);
    const blob = await generatePDFBlob(pdfDocument);
    
    // Here you would upload to MongoDB or cloud storage
    // For now, log and return a mock URL
    console.log(`Generated PDF for offer ${offer.id}`);
    
    return `https://storage.invoicepro.com/offers/${offer.id}.pdf`;
  } catch (error) {
    console.error('Error saving offer PDF:', error);
    return null;
  }
};

/**
 * Create a data URL for a PDF blob (for email attachments, previews, etc.)
 * @param blob PDF blob
 * @returns Promise resolving to data URL
 */
export const blobToDataURL = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Open PDF in a new tab for printing
 * @param pdfDocument React component to render to PDF
 */
export const openPDFInNewTab = async (pdfDocument: PDFDocumentElement): Promise<void> => {
  const blob = await generatePDFBlob(pdfDocument);
  const url = URL.createObjectURL(blob);
  
  // Open in a new tab
  window.open(url, '_blank');
  
  // Clean up the URL object after a delay
  setTimeout(() => URL.revokeObjectURL(url), 5000);
};