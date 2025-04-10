import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { invoiceStyles } from '@/lib/styles/InvoiceStyles';
import { formatCurrency } from '@/lib/utils/format';
import { Invoice } from '@/lib/models';

interface InvoiceTotalsProps {
  invoice: Invoice;
}

export const InvoiceTotals: React.FC<InvoiceTotalsProps> = ({ invoice }) => {
  return (
    <View style={invoiceStyles.totalsContainer}>
      <View style={invoiceStyles.totalRow}>
        <Text style={invoiceStyles.totalLabel}>Subtotal:</Text>
        <Text style={invoiceStyles.totalValue}>{formatCurrency(invoice.subtotal)}</Text>
      </View>
      <View style={invoiceStyles.totalRow}>
        <Text style={invoiceStyles.totalLabel}>Tax ({invoice.taxRate}%):</Text>
        <Text style={invoiceStyles.totalValue}>{formatCurrency(invoice.taxAmount)}</Text>
      </View>
      <View style={invoiceStyles.totalRowBold}>
        <Text style={invoiceStyles.totalLabel}>Total:</Text>
        <Text style={invoiceStyles.totalAmount}>{formatCurrency(invoice.total)}</Text>
      </View>
    </View>
  );
};