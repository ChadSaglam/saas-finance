import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { invoiceStyles } from '@/lib/styles/InvoiceStyles';
import { formatCurrency } from '@/lib/utils/format';
import { Invoice } from '@/lib/models';

interface LineItemsTableProps {
  items: Invoice['items'];
}

export const LineItemsTable: React.FC<LineItemsTableProps> = ({ items }) => {
  return (
    <View style={invoiceStyles.tableBorder}>
      <View style={invoiceStyles.tableHeader}>
        <Text style={[invoiceStyles.tableHeaderText, invoiceStyles.tableCol1]}>CODE</Text>
        <Text style={[invoiceStyles.tableHeaderText, invoiceStyles.tableCol2]}>DESCRIPTION</Text>
        <Text style={[invoiceStyles.tableHeaderText, invoiceStyles.tableCol3]}>QTY</Text>
        <Text style={[invoiceStyles.tableHeaderText, invoiceStyles.tableCol4]}>UNIT</Text>
        <Text style={[invoiceStyles.tableHeaderText, invoiceStyles.tableCol5]}>UNIT PRICE</Text>
        <Text style={[invoiceStyles.tableHeaderText, invoiceStyles.tableCol6]}>AMOUNT</Text>
      </View>
      
      {items.map((item, index) => (
        <View 
          key={index} 
          style={[
            invoiceStyles.tableRow, 
            index === items.length - 1 ? { borderBottomWidth: 0 } : {}
          ]}
        >
          <Text style={[invoiceStyles.tableCellText, invoiceStyles.tableCol1]}>{item.code}</Text>
          <Text style={[invoiceStyles.tableCellText, invoiceStyles.tableCol2]}>{item.description}</Text>
          <Text style={[invoiceStyles.tableCellText, invoiceStyles.tableCol3]}>{item.quantity}</Text>
          <Text style={[invoiceStyles.tableCellText, invoiceStyles.tableCol4]}>{item.unit}</Text>
          <Text style={[invoiceStyles.tableCellText, invoiceStyles.tableCol5]}>
            {formatCurrency(item.price)}
          </Text>
          <Text style={[invoiceStyles.tableCellText, invoiceStyles.tableCol6]}>
            {formatCurrency(item.total)}
          </Text>
        </View>
      ))}
    </View>
  );
};