import React from 'react';
import { CompanySettings } from '@/lib/models';
import Card from '@/components/ui/Card';
import Textarea from '@/components/ui/TextArea';

interface DocumentSettingsTabProps {
  settings: CompanySettings;
  onChange: (name: string, value: any) => void;
}

const DocumentSettingsTab: React.FC<DocumentSettingsTabProps> = ({ settings, onChange }) => {
  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Invoice Settings</h3>
        
        <div className="mb-6">
          <Textarea
            label="Invoice Footer"
            name="invoiceFooter"
            value={settings.invoiceFooter || ''}
            onChange={(e) => onChange('invoiceFooter', e.target.value)}
            rows={2}
            placeholder="Thank you for your business!"
            helpText="This text appears at the bottom of each invoice."
          />
        </div>
        
        <div className="mb-4">
          <Textarea
            label="Invoice Terms & Conditions"
            name="invoiceTerms"
            value={settings.invoiceTerms || ''}
            onChange={(e) => onChange('invoiceTerms', e.target.value)}
            rows={4}
            placeholder="Payment is due within 14 days of receipt. Late payments are subject to a 2% monthly fee."
            helpText="Legal terms that apply to your invoices."
          />
        </div>
      </Card>
      
      <Card>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Price Offer Settings</h3>
        
        <div className="mb-6">
          <Textarea
            label="Offer Footer"
            name="offerFooter"
            value={settings.offerFooter || ''}
            onChange={(e) => onChange('offerFooter', e.target.value)}
            rows={2}
            placeholder="Thank you for considering our offer!"
            helpText="This text appears at the bottom of each price offer."
          />
        </div>
        
        <div className="mb-4">
          <Textarea
            label="Price Offer Terms & Conditions"
            name="offerTerms"
            value={settings.offerTerms || ''}
            onChange={(e) => onChange('offerTerms', e.target.value)}
            rows={4}
            placeholder="This price offer is valid until the specified date. Prices are subject to change after the validity date."
            helpText="Legal terms that apply to your price offers."
          />
        </div>
      </Card>
    </div>
  );
};

export default DocumentSettingsTab;