import React from 'react';
import { CompanySettings } from '@/lib/models';
import Card from '@/components/ui/Card';
import ColorPicker from '@/components/settings/ColorPicker';

interface AppearanceTabProps {
  settings: CompanySettings;
  onChange: (name: string, value: any) => void;
}

const AppearanceTab: React.FC<AppearanceTabProps> = ({ settings, onChange }) => {
  return (
    <Card>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Document Appearance</h3>
      <p className="text-sm text-gray-600 mb-6">
        Customize the colors used in your invoices and offers to match your brand identity.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ColorPicker 
          label="Primary Color" 
          color={settings.primaryColor || '#1f2937'} 
          onChange={(color) => onChange('primaryColor', color)}
          description="Used for headings and important text in documents"
        />
        
        <ColorPicker 
          label="Accent Color" 
          color={settings.accentColor || '#3b82f6'} 
          onChange={(color) => onChange('accentColor', color)}
          description="Used for highlights, buttons, and status indicators"
        />
      </div>
      
      <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-900 mb-4">Preview</h4>
        <div className="flex justify-center">
          <div className="w-full max-w-md p-6 bg-white rounded shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center mr-3">
                  <span className="text-xs">Logo</span>
                </div>
                <div style={{ color: settings.primaryColor || '#1f2937' }} className="font-bold">
                  {settings.name || 'Company Name'}
                </div>
              </div>
              <div style={{ color: settings.primaryColor || '#1f2937' }} className="text-xl font-bold">
                INVOICE
              </div>
            </div>
            
            <div className="border-t border-gray-200 my-4 pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Service Description</span>
                <span className="text-sm font-medium">Amount</span>
              </div>
              <div className="flex justify-between">
                <span>Website Development</span>
                <span className="font-semibold">$1,500.00</span>
              </div>
              <div className="flex justify-between">
                <span>Logo Design</span>
                <span className="font-semibold">$500.00</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 my-4 pt-4 flex justify-between">
              <span className="font-medium">Total</span>
              <span className="font-bold">$2,000.00</span>
            </div>
            
            <div className="mt-6 flex justify-between items-center">
              <div className="text-xs text-gray-500">
                {settings.email || 'email@example.com'}
              </div>
              <div 
                className="inline-block px-3 py-1 text-sm text-white rounded"
                style={{ backgroundColor: settings.accentColor || '#3b82f6' }}
              >
                Paid
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AppearanceTab;