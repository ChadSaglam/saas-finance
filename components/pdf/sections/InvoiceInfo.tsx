import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { invoiceStyles } from '@/lib/styles/InvoiceStyles';
import { getStatusStyles, getClientInfo } from '@/lib/utils/InvoiceUtils';
import { Invoice } from '@/lib/models';

interface InvoiceInfoProps {
  invoice: Invoice;
}

export const InvoiceInfo: React.FC<InvoiceInfoProps> = ({ invoice }) => {
  const statusStyle = getStatusStyles(invoice.status);
  const client = getClientInfo(invoice);
  
  return (
    <View style={invoiceStyles.infoContainer}>
      <View style={invoiceStyles.billToContainer}>
        <Text style={invoiceStyles.sectionTitle}>BILL TO</Text>
        <Text style={invoiceStyles.clientName}>{client.name}</Text>
        <Text style={invoiceStyles.text}>555 Cyber Street</Text>
        <Text style={invoiceStyles.text}>Austin, TX 78701</Text>
        <Text style={invoiceStyles.text}>{client.email || 'client@example.com'}</Text>
        <Text style={invoiceStyles.text}>{client.phone || '555-876-5432'}</Text>
      </View>
      
      <View style={invoiceStyles.invoiceInfoContainer}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <Text style={invoiceStyles.sectionTitle}>INVOICE DETAILS</Text>
          <View style={[invoiceStyles.statusBadge, { backgroundColor: statusStyle.bg, color: statusStyle.color }]}>
            <Text>{invoice.status.toUpperCase()}</Text>
          </View>
        </View>
        
        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
          <Text style={[invoiceStyles.text, { width: '40%' }]}>Invoice Date:</Text>
          <Text style={[invoiceStyles.text, { width: '60%', fontWeight: 'bold' }]}>
            {new Date(invoice.issueDate).toLocaleDateString('en-US', { 
              year: 'numeric', month: 'short', day: 'numeric' 
            })}
          </Text>
        </View>
        
        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
          <Text style={[invoiceStyles.text, { width: '40%' }]}>Due Date:</Text>
          <Text style={[invoiceStyles.text, { width: '60%', fontWeight: 'bold' }]}>
            {new Date(invoice.dueDate).toLocaleDateString('en-US', { 
              year: 'numeric', month: 'short', day: 'numeric' 
            })}
          </Text>
        </View>
        
        <View style={{ flexDirection: 'row' }}>
          <Text style={[invoiceStyles.text, { width: '40%' }]}>Invoice #:</Text>
          <Text style={[invoiceStyles.text, { width: '60%', fontWeight: 'bold' }]}>
            {invoice.invoiceNumber}
          </Text>
        </View>
      </View>
    </View>
  );
};