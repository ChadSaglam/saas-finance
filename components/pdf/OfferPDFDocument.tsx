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
import { Offer } from '@/lib/models';
import { formatDisplayDate } from '@/lib/utils/format';
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

// Define styles
const styles = StyleSheet.create({
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
    height: 'auto'
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4
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
    color: '#1f2937'
  },
  offerNumber: {
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
    color: '#1f2937',
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
  tableColDescription: {
    width: '40%',
    paddingHorizontal: 4
  },
  tableColQty: {
    width: '10%',
    textAlign: 'right',
    paddingHorizontal: 4
  },
  tableColPrice: {
    width: '25%',
    textAlign: 'right',
    paddingHorizontal: 4
  },
  tableColAmount: {
    width: '25%',
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
    marginTop: 40,
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
  statusAccepted: {
    backgroundColor: '#10b981'
  },
  statusRejected: {
    backgroundColor: '#ef4444'
  },
  statusSent: {
    backgroundColor: '#3b82f6'
  },
  statusDraft: {
    backgroundColor: '#f59e0b'
  },
  statusExpired: {
    backgroundColor: '#6b7280'
  },
  signatureLine: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  signatureBox: {
    borderTopWidth: 1,
    borderTopColor: '#000',
    width: 200,
    marginTop: 30
  }
});

interface OfferPDFDocumentProps {
  offer: Offer;
  companyInfo: CompanySettings;
}

const OfferPDFDocument: React.FC<OfferPDFDocumentProps> = ({ offer, companyInfo }) => {
  // Helper to get status style
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'accepted': return styles.statusAccepted;
      case 'rejected': return styles.statusRejected;
      case 'sent': return styles.statusSent;
      case 'expired': return styles.statusExpired;
      default: return styles.statusDraft;
    }
  };

  // Get client information
  const clientName = typeof offer.client === 'object' ? offer.client.name : 'Unknown Client';
  const clientAddress = typeof offer.client === 'object' ? offer.client.address : '';
  const clientEmail = typeof offer.client === 'object' ? offer.client.email : '';
  const clientPhone = typeof offer.client === 'object' ? offer.client.phone : '';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>PRICE OFFER</Text>
            <Text style={styles.offerNumber}>#{offer.offerNumber}</Text>
          </View>
          <View style={styles.companyInfo}>
            {companyInfo.logo && (
              <Image src={companyInfo.logo} style={styles.logo} />
            )}
            <Text style={styles.companyName}>{companyInfo.name}</Text>
            <Text>{companyInfo.address}</Text>
            <Text>{companyInfo.email}</Text>
            <Text>{companyInfo.phone}</Text>
            <Text>{companyInfo.website}</Text>
          </View>
        </View>

        {/* Client & Offer Info */}
        <View style={styles.section}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Prepared For:</Text>
              <Text style={{ fontWeight: 'semibold' }}>{clientName}</Text>
              <Text>{clientAddress}</Text>
              <Text>{clientEmail}</Text>
              <Text>{clientPhone}</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <View style={styles.row}>
                <Text style={{ marginRight: 10, fontWeight: 'semibold' }}>Offer Date:</Text>
                <Text>{formatDisplayDate(offer.issueDate)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={{ marginRight: 10, fontWeight: 'semibold' }}>Valid Until:</Text>
                <Text>{formatDisplayDate(offer.validUntil)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={{ marginRight: 10, fontWeight: 'semibold' }}>Status:</Text>
                <View style={[styles.status, getStatusStyle(offer.status)]}>
                  <Text>{offer.status.toUpperCase()}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Offer Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Offer Details</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableColDescription}>Description</Text>
              <Text style={styles.tableColQty}>Qty</Text>
              <Text style={styles.tableColPrice}>Unit Price</Text>
              <Text style={styles.tableColAmount}>Amount</Text>
            </View>
            
            {offer.items.map((item, i) => (
              <View style={styles.tableRow} key={i}>
                <Text style={styles.tableColDescription}>{item.description}</Text>
                <Text style={styles.tableColQty}>{item.quantity}</Text>
                <Text style={styles.tableColPrice}>${item.price.toFixed(2)}</Text>
                <Text style={styles.tableColAmount}>${item.total.toFixed(2)}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.totals}>
            <View style={styles.totalRow}>
              <Text>Subtotal:</Text>
              <Text>${offer.subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text>Tax ({offer.taxRate}%):</Text>
              <Text>${offer.taxAmount.toFixed(2)}</Text>
            </View>
            <View style={styles.totalRowBold}>
              <Text>Total:</Text>
              <Text>${offer.total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        {offer.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Information</Text>
            <Text>{offer.notes}</Text>
          </View>
        )}

        {/* Terms & Acceptance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Terms & Conditions</Text>
          <Text>{companyInfo.offerTerms || 'This price offer is valid until the specified date. Prices are subject to change after the validity date. Delivery timeframes will be confirmed upon acceptance.'}</Text>
          
          {/* Acceptance section */}
          <View style={styles.signatureLine}>
            <View>
              <View style={styles.signatureBox}>
                <Text>Client Signature</Text>
              </View>
            </View>
            <View>
              <View style={styles.signatureBox}>
                <Text>Date</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>{companyInfo.offerFooter || 'Thank you for considering our offer!'}</Text>
          <Text>Generated by InvoicePro - Smart Invoicing Solution</Text>
        </View>
      </Page>
    </Document>
  );
};

export default OfferPDFDocument;