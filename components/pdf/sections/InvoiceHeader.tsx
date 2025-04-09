import React from 'react';
import { View, Text, Image } from '@react-pdf/renderer';
import { invoiceStyles } from '../styles/InvoiceStyles';
import { CompanySettings } from '@/lib/models';

interface InvoiceHeaderProps {
  invoiceNumber: string;
  companyInfo: CompanySettings;
}

export const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({ 
  invoiceNumber, 
  companyInfo 
}) => {
  // Get company info (with fallbacks)
  const companyName = companyInfo?.name || 'ChaDev';
  const companyAddress = companyInfo?.address || 'Hohlstrasse 481A, 8048 Zürich, Switzerland';
  const companyEmail = companyInfo?.email || 'info@chadev.ch';
  const companyPhone = companyInfo?.phone || '+41 78 881 50 58';
  const companyWebsite = companyInfo?.website || 'www.chadev.ch';
  const companyTaxId = companyInfo?.taxId || 'CHE-123.456.789';
  const companyLogo = companyInfo?.logo || '/images/company-logo.png';
  
  // Static values for fields not in CompanySettings
  const vatNumber = 'CHE-123.456.789 VAT';
  
  // Split address parts with proper typing
  const addressParts = companyAddress.split(',').slice(1);
  
  return (
    <View style={invoiceStyles.headerContainer}>
      <View style={invoiceStyles.logoContainer}>
        <Image src={companyLogo} style={invoiceStyles.logo} />
        <Text style={invoiceStyles.invoiceTitle}>INVOICE</Text>
        <Text style={invoiceStyles.invoiceNumber}>{invoiceNumber}</Text>
      </View>
      
      <View style={invoiceStyles.companyInfoContainer}>
        <Text style={invoiceStyles.text}>{companyAddress.split(',')[0]}</Text>
        {addressParts.map((part: string, i: number) => (
          <Text key={i} style={invoiceStyles.text}>{part.trim()}</Text>
        ))}
        <Text style={invoiceStyles.text}>{companyEmail}</Text>
        <Text style={invoiceStyles.text}>{companyPhone}</Text>
        <Text style={invoiceStyles.text}>{companyWebsite}</Text>
        <Text style={[invoiceStyles.text, { marginTop: 5 }]}>Tax ID: {companyTaxId}</Text>
        <Text style={invoiceStyles.text}>VAT: {vatNumber}</Text>
      </View>
    </View>
  );
};