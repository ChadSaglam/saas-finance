import { CompanySettings } from '@/lib/models';

export const companySettings: CompanySettings = {
  name: 'ChaDev',
  address: 'Hohlstrasse 481A',
  postcode: '8048',
  city: 'Zürich',
  country: 'Switzerland',
  email: 'info@chadev.ch',
  phone: '+41 78 881 50 58',
  website: 'www.chadev.ch',
  logo: '/images/logo.png',
  taxId: 'CHE-123.456.789',
  vatNumber: 'CHE-123.456.789 VAT',
  bankAccount: {
    name: 'ChaDev',
    number: '',
    bank: 'Migros Bank AG',
    swift: '',
    iban: 'CH78 0840 1000 0724 3366 3',
    bic: 'MIGRCHZZXXX'
  },
  invoiceFooter: 'Thank you for your business!',
  offerFooter: 'Thank you for considering our offer!',
  invoiceTerms: 'Payment is due within 14 days of receipt. Late payments are subject to a 2% monthly fee.',
  offerTerms: 'This price offer is valid until the specified date. Prices are subject to change after the validity date. Delivery timeframes will be confirmed upon acceptance.',
  primaryColor: '#1f2937',
  accentColor: '#3b82f6'
};