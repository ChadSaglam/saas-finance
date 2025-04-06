import React, { useState } from 'react';
import { CompanySettings, BankAccount, Invoice } from '@/lib/models';
import TabPanel from '@/components/settings/TabPanel';
import Button from '@/components/ui/Button';
import CompanyProfileTab from '@/components/settings/CompanyProfileTab';
import ContactInfoTab from '@/components/settings/ContactInfoTab';
import BankingDetailsTab from '@/components/settings/BankingDetailsTab';
import AppearanceTab from '@/components/settings/AppearanceTab';
import DocumentSettingsTab from '@/components/settings/DocumentSettingsTab';
import DocumentPreview from '@/components/documents/DocumentPreview';

interface CompanyFormProps {
  initialSettings: CompanySettings;
  onSave: (settings: CompanySettings) => Promise<void>;
  isSaving?: boolean;
}

const CompanyForm: React.FC<CompanyFormProps> = ({ 
  initialSettings,
  onSave,
  isSaving = false
}) => {
  const [settings, setSettings] = useState<CompanySettings>(initialSettings);
  const [dirtyFields, setDirtyFields] = useState<Set<string>>(new Set());
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  // Track if the form has any unsaved changes
  const isDirty = dirtyFields.size > 0;
  
  const markFieldAsDirty = (fieldName: string) => {
    setDirtyFields(prev => {
      const updated = new Set(prev);
      updated.add(fieldName);
      return updated;
    });
  };

  const handleChange = (name: string, value: any) => {
    setSettings(prev => ({ ...prev, [name]: value }));
    markFieldAsDirty(name);
  };
  
  // Special handler for bank account updates
  const handleBankAccountUpdate = (updates: Partial<BankAccount>) => {
    setSettings(prev => ({
      ...prev,
      bankAccount: {
        ...(prev.bankAccount || { name: '', number: '', bank: '' }),
        ...updates
      }
    }));
    
    // Mark fields as dirty
    Object.keys(updates).forEach(key => {
      markFieldAsDirty(`bankAccount.${key}`);
    });
  };

  const handleOpenPreview = () => {
    setIsPreviewOpen(true);
  };
  
  const handleClosePreview = () => {
    setIsPreviewOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(settings);
    setDirtyFields(new Set()); // Reset dirty state after save
  };
  
  // Sample invoice data for the preview - Fixed with proper type for status
  const sampleInvoice: Invoice = {
    id: 'preview-invoice',
    invoiceNumber: 'INV-2025-001',
    client: {
      id: 'client-001',
      name: 'Acme Corporation',
      contactPerson: 'John Doe',
      email: 'john@acmecorp.com',
      phone: '+1 234 567 890',
      address: '123 Main St, San Francisco, CA 94105',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    issueDate: new Date(),
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    items: [
      {
        id: 'item-1',
        code: 'DEV-101',
        description: 'Frontend Development',
        quantity: 40,
        unit: 'hours',
        price: 95,
        total: 3800
      },
      {
        id: 'item-2',
        code: 'DES-201',
        description: 'Logo Design',
        quantity: 1,
        unit: 'pcs',
        price: 1200,
        total: 1200
      }
    ],
    subtotal: 5000,
    taxRate: 20,
    taxAmount: 1000,
    total: 6000,
    notes: 'Thank you for your business!',
    status: 'draft', 
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  // Tabs configuration with icons
  const tabs = [
    {
      id: 'company',
      label: 'Company Profile',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      id: 'contact',
      label: 'Contact Info',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 'bank',
      label: 'Banking',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      id: 'appearance',
      label: 'Appearance',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      )
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
  ];

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <TabPanel tabs={tabs}>
          {/* Company Profile Tab */}
          <CompanyProfileTab 
            settings={settings} 
            onChange={handleChange} 
          />
          
          {/* Contact Info Tab */}
          <ContactInfoTab 
            settings={settings} 
            onChange={handleChange} 
          />
          
          {/* Banking Details Tab - Updated to use the new handler */}
          <BankingDetailsTab 
            settings={settings} 
            onUpdateBankAccount={handleBankAccountUpdate} 
          />
          
          {/* Appearance Tab */}
          <AppearanceTab 
            settings={settings} 
            onChange={handleChange} 
          />
          
          {/* Document Settings Tab */}
          <DocumentSettingsTab 
            settings={settings} 
            onChange={handleChange} 
          />
        </TabPanel>
        
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-4 mt-6 flex items-center justify-between rounded-lg shadow-md">
          <div>
            {isDirty && (
              <span className="text-sm text-amber-600 flex items-center bg-amber-50 px-2 py-1 rounded-md">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">You have unsaved changes</span>
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleOpenPreview}
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview Document
            </Button>
            <Button 
              type="submit" 
              disabled={isSaving || !isDirty}
            >
              {isSaving ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : 'Save Settings'}
            </Button>
          </div>
        </div>
      </form>
      
      {/* Document Preview Modal */}
      {isPreviewOpen && (
        <DocumentPreview
          isOpen={isPreviewOpen}
          onClose={handleClosePreview}
          type="invoice"
          companySettings={settings}
          document={sampleInvoice}
        />
      )}
    </>
  );
};

export default CompanyForm;