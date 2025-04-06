import React from 'react';
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  Image, 
  Font 
} from '@react-pdf/renderer';
import { Invoice } from '@/lib/models';
import { formatDisplayDate } from '@/lib/utils/date-format';
import { CompanySettings } from '@/lib/models';

// Register fonts (optional - for better typography)
Font.register({
  family: 'Open Sans',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf', fontWeight: 'normal' },
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf', fontWeight: 'semibold' },
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-700.ttf', fontWeight: 'bold' },
  ]
});

// Create styles function that can use dynamic colors
const createStyles = (primaryColor = '#1f2937', accentColor = '#3b82f6') => StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Open Sans',
    fontSize: 10,
    color: '#333',
    backgroundColor: '#fff'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30
  },
  logo: {
    width: 120,
    height: 'auto',
    marginBottom: 10
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: primaryColor
  },
  companyInfo: {
    textAlign: 'right',
    fontSize: 9,
    color: '#555'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: primaryColor
  },
  invoiceNumber: {
    fontSize: 10,
    color: '#6b7280'
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    color: primaryColor,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 4
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4
  },
  col: {
    flexDirection: 'column'
  },
  label: {
    fontWeight: 'semibold',
    width: '30%'
  },
  value: {
    width: '70%'
  },
  table: {
    width: '100%',
    marginTop: 10
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 6,
    fontWeight: 'bold',
    backgroundColor: '#f9fafb'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingVertical: 8
  },
  tableColCode: {
    width: '10%',
    paddingHorizontal: 4
  },
  tableColDescription: {
    width: '35%',
    paddingHorizontal: 4
  },
  tableColQty: {
    width: '10%',
    textAlign: 'right',
    paddingHorizontal: 4
  },
  tableColUnit: {
    width: '10%',
    textAlign: 'right',
    paddingHorizontal: 4
  },
  tableColPrice: {
    width: '15%',
    textAlign: 'right',
    paddingHorizontal: 4
  },
  tableColAmount: {
    width: '20%',
    textAlign: 'right',
    paddingHorizontal: 4
  },
  totals: {
    width: '40%',
    alignSelf: 'flex-end',
    marginTop: 20
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    fontSize: 10
  },
  totalRowBold: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    fontSize: 12,
    fontWeight: 'bold',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    marginTop: 2
  },
  notes: {
    marginTop: 30,
    fontSize: 9,
    color: '#555'
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 8,
    color: '#6b7280',
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 8
  },
  status: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    fontSize: 9,
    fontWeight: 'semibold',
    color: 'white'
  },
  statusPaid: {
    backgroundColor: '#10b981'
  },
  statusOverdue: {
    backgroundColor: '#ef4444'
  },
  statusSent: {
    backgroundColor: accentColor
  },
  statusDraft: {
    backgroundColor: '#f59e0b'
  },
  bankInfo: {
    marginTop: 10,
    fontSize: 9,
    color: '#555'
  }
});

interface InvoicePDFDocumentProps {
  invoice: Invoice;
  companyInfo: CompanySettings;
}

const InvoicePDFDocument: React.FC<InvoicePDFDocumentProps> = ({ invoice, companyInfo }) => {
  // Create styles with company colors if specified
  const styles = createStyles(companyInfo.primaryColor, companyInfo.accentColor);

  // Helper to get status style
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'paid': return styles.statusPaid;
      case 'overdue': return styles.statusOverdue;
      case 'sent': return styles.statusSent;
      default: return styles.statusDraft;
    }
  };

  // Get client information
  const clientName = typeof invoice.client === 'object' ? invoice.client.name : 'Unknown Client';
  const clientAddress = typeof invoice.client === 'object' ? invoice.client.address : '';
  const clientEmail = typeof invoice.client === 'object' ? invoice.client.email : '';
  const clientPhone = typeof invoice.client === 'object' ? invoice.client.phone : '';

  // Format full address
  const formatFullAddress = (company: CompanySettings) => {
    const parts = [company.address];
    if (company.postcode || company.city) {
      parts.push(`${company.postcode || ''} ${company.city || ''}`.trim());
    }
    if (company.country) {
      parts.push(company.country);
    }
    return parts;
  };

  const companyAddress = formatFullAddress(companyInfo);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>INVOICE</Text>
            <Text style={styles.invoiceNumber}>#{invoice.invoiceNumber}</Text>
          </View>
          <View style={styles.companyInfo}>
            {companyInfo.logo && (
              <Image src={companyInfo.logo} style={styles.logo} />
            )}
            <Text style={styles.companyName}>{companyInfo.name}</Text>
            {companyAddress.map((line, i) => (
              <Text key={i}>{line}</Text>
            ))}
            {companyInfo.taxId && <Text>Tax ID: {companyInfo.taxId}</Text>}
            {companyInfo.vatNumber && <Text>VAT: {companyInfo.vatNumber}</Text>}
          </View>
        </View>

        {/* Contact Information */}
        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          <View style={{ flex: 1 }}>
            {/* Left empty for spacing */}
          </View>
          <View style={{ flex: 1, textAlign: 'right' }}>
            <Text>{companyInfo.email}</Text>
            <Text>{companyInfo.phone}</Text>
            <Text>{companyInfo.website}</Text>
          </View>
        </View>

        {/* Bill To & Invoice Info */}
        <View style={styles.section}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Bill To:</Text>
              <Text style={{ fontWeight: 'semibold' }}>{clientName}</Text>
              <Text>{clientAddress}</Text>
              <Text>{clientEmail}</Text>
              <Text>{clientPhone}</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <View style={styles.row}>
                <Text style={{ marginRight: 10, fontWeight: 'semibold' }}>Invoice Date:</Text>
                <Text>{formatDisplayDate(invoice.issueDate)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={{ marginRight: 10, fontWeight: 'semibold' }}>Due Date:</Text>
                <Text>{formatDisplayDate(invoice.dueDate)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={{ marginRight: 10, fontWeight: 'semibold' }}>Status:</Text>
                <View style={[styles.status, getStatusStyle(invoice.status)]}>
                  <Text>{invoice.status.toUpperCase()}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Line Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Invoice Items</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableColCode}>Code</Text>
              <Text style={styles.tableColDescription}>Description</Text>
              <Text style={styles.tableColQty}>Qty</Text>
              <Text style={styles.tableColUnit}>Unit</Text>
              <Text style={styles.tableColPrice}>Unit Price</Text>
              <Text style={styles.tableColAmount}>Amount</Text>
            </View>
            
            {invoice.items.map((item, i) => (
              <View style={styles.tableRow} key={i}>
                <Text style={styles.tableColCode}>{item.code || ''}</Text>
                <Text style={styles.tableColDescription}>{item.description}</Text>
                <Text style={styles.tableColQty}>{item.quantity}</Text>
                <Text style={styles.tableColUnit}>{item.unit || 'pcs'}</Text>
                <Text style={styles.tableColPrice}>${item.price.toFixed(2)}</Text>
                <Text style={styles.tableColAmount}>${item.total.toFixed(2)}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.totals}>
            <View style={styles.totalRow}>
              <Text>Subtotal:</Text>
              <Text>${invoice.subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text>Tax ({invoice.taxRate}%):</Text>
              <Text>${invoice.taxAmount.toFixed(2)}</Text>
            </View>
            <View style={styles.totalRowBold}>
              <Text>Total:</Text>
              <Text>${invoice.total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        {invoice.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text>{invoice.notes}</Text>
          </View>
        )}

        {/* Payment Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Information</Text>
          <Text>Please transfer the amount to:</Text>
          
          <View style={styles.bankInfo}>
            <Text>Bank: {companyInfo.bankAccount?.bank || 'International Bank'}</Text>
            <Text>Account Name: {companyInfo.bankAccount?.name || companyInfo.name}</Text>
            <Text>Account Number: {companyInfo.bankAccount?.number || '1234567890'}</Text>
            {companyInfo.bankAccount?.iban && <Text>IBAN: {companyInfo.bankAccount.iban}</Text>}
            {companyInfo.bankAccount?.swift && <Text>SWIFT: {companyInfo.bankAccount.swift}</Text>}
            {companyInfo.bankAccount?.bic && <Text>BIC: {companyInfo.bankAccount.bic}</Text>}
          </View>
        </View>

        {/* Terms & Conditions */}
        <View style={styles.notes}>
          <Text style={{ fontWeight: 'semibold' }}>Terms & Conditions:</Text>
          <Text>{companyInfo.invoiceTerms || 'Payment is due within 14 days of receipt. Late payments are subject to a 2% monthly fee.'}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>{companyInfo.invoiceFooter || 'Thank you for your business!'}</Text>
          <Text>Generated by InvoicePro - Smart Invoicing Solution</Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDFDocument;