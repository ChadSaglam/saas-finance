import { StyleSheet } from '@react-pdf/renderer';

export const invoiceStyles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#334155',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  logoContainer: {
    width: '40%',
  },
  logo: {
    width: 120,
    height: 40,
  },
  companyInfoContainer: {
    width: '30%',
    textAlign: 'right',
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 5,
  },
  invoiceNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#475569',
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    borderRadius: 4,
  },
  billToContainer: {
    width: '50%',
    padding: 15,
    backgroundColor: '#f8fafc',
    borderRadius: 4,
  },
  invoiceInfoContainer: {
    width: '40%',
    padding: 15,
    backgroundColor: '#f8fafc',
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 10,
    color: '#64748b',
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  clientName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  text: {
    fontSize: 10,
    lineHeight: 1.5,
  },
  statusBadge: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    padding: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    fontSize: 9,
    alignSelf: 'flex-start',
    fontWeight: 'bold',
  },
  tableBorder: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#f1f5f9',
    padding: 10,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    padding: 10,
  },
  tableCol1: {
    width: '15%',
    paddingRight: 10,
  },
  tableCol2: {
    width: '40%',
    paddingRight: 10,
  },
  tableCol3: {
    width: '10%',
    paddingRight: 10,
    textAlign: 'center',
  },
  tableCol4: {
    width: '10%',
    paddingRight: 10,
    textAlign: 'center',
  },
  tableCol5: {
    width: '12%',
    paddingRight: 10,
    textAlign: 'right',
  },
  tableCol6: {
    width: '13%',
    textAlign: 'right',
  },
  tableHeaderText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#475569',
  },
  tableCellText: {
    fontSize: 10,
    lineHeight: 1.5,
  },
  totalsContainer: {
    width: '30%',
    marginLeft: 'auto',
    marginBottom: 40,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  totalRowBold: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#cbd5e1',
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 10,
    textAlign: 'right',
  },
  totalAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  footer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 20,
  },
  footerSection: {
    marginBottom: 15,
  },
  footerSectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#475569',
  },
  footerText: {
    fontSize: 9,
    lineHeight: 1.5,
    color: '#64748b',
  },
  thankYouSection: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 15,
    marginTop: 20,
    textAlign: 'center',
  },
  thankYouText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 5,
  },
  poweredByText: {
    fontSize: 8,
    color: '#94a3b8',
  }
});