// User model
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user';
}

// Client model
export interface Client {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define LineItem before Invoice & Offer for better code organization
export interface LineItem {
  id: string;
  code?: string;            // Product/service code (e.g., DEV-101)
  description: string;      // Description of the item
  quantity: number;         // Quantity of items
  unit: string;             // Unit of measurement (hours, pcs, days, etc.)
  price: number;            // Price per unit
  total: number;            // Line total (quantity * price)
  taxRate?: number;         // Individual tax rate if different from invoice/offer
  discount?: number;        // Individual item discount percentage
}

// For backward compatibility
export type InvoiceItem = LineItem;

// Invoice model
export interface Invoice {
  id: string;
  invoiceNumber: string;
  client: Client | string;  // Can be a full client object or just client ID
  issueDate: Date;
  dueDate: Date;
  items: LineItem[];        // Using LineItem directly
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes?: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

// Offer/Proposal model
export interface Offer {
  id: string;
  offerNumber: string;
  client: Client | string;  // Can be a full client object or just client ID
  issueDate: Date;
  validUntil: Date;
  items: LineItem[];        // Using LineItem directly
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes?: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  createdAt: Date;
  updatedAt: Date;
}

// Statistics model
export interface Statistic {
  name: string;
  value: number | string;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
}

// Banking details as a separate interface for reusability
export interface BankAccount {
  name: string;             // Account holder name
  number: string;           // Account number
  bank: string;             // Bank name
  swift?: string;           // SWIFT code
  iban?: string;            // International Bank Account Number
  bic?: string;             // Bank Identifier Code
}

// Company settings model
export interface CompanySettings {
  name: string;
  address: string;
  postcode?: string;
  city?: string;
  country?: string;
  email: string;
  phone: string;
  website: string;
  logo?: string;
  taxId?: string;
  vatNumber?: string;
  bankAccount: BankAccount; // Using the BankAccount interface
  
  // Document customization
  invoiceFooter?: string;
  offerFooter?: string;
  invoiceTerms?: string;
  offerTerms?: string;
  primaryColor?: string;    // Primary brand color
  accentColor?: string;     // Secondary/accent brand color
}

// Product/Service catalog item
export interface CatalogItem {
  id: string;
  code: string;
  name: string;
  description: string;
  type?: 'product' | 'service'; 
  defaultPrice: number;
  defaultUnit: string;
  taxRate?: number; 
  category: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}