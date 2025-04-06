// Define the template type enum
export type TemplateType = 'invoice_new' | 'invoice_reminder' | 'invoice_paid' | 'offer_new' | 'offer_accepted' | 'offer_expired';

// Email template interface
export interface EmailTemplate {
  id: TemplateType;
  name: string;
  subject: string;
  body: string;
  description: string;
  lastUpdated?: Date;
}

// Template variables
export interface TemplateVariable {
  name: string;
  placeholder: string;
  description: string;
  context: 'all' | 'invoice' | 'offer' | 'client';
}