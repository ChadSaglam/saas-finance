import React from 'react';
import { CompanySettings } from '@/lib/models';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import LogoUploader from '@/components/settings/LogoUploader';

interface CompanyProfileTabProps {
  settings: CompanySettings;
  onChange: (name: string, value: any) => void;
}

const CompanyProfileTab: React.FC<CompanyProfileTabProps> = ({ settings, onChange }) => {
  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <LogoUploader 
              currentLogo={settings.logo} 
              onLogoChange={(logo) => onChange('logo', logo)} 
            />
          </div>
          
          <div className="md:w-2/3 space-y-6">
            <Input
              label="Company Name"
              name="name"
              value={settings.name}
              onChange={(e) => onChange('name', e.target.value)}
              required
            />
            
            <Input
              label="Street Address"
              name="address"
              value={settings.address}
              onChange={(e) => onChange('address', e.target.value)}
              required
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Postal Code"
                name="postcode"
                value={settings.postcode || ''}
                onChange={(e) => onChange('postcode', e.target.value)}
              />
              
              <Input
                label="City"
                name="city"
                value={settings.city || ''}
                onChange={(e) => onChange('city', e.target.value)}
              />
            </div>
            
            <Input
              label="Country"
              name="country"
              value={settings.country || ''}
              onChange={(e) => onChange('country', e.target.value)}
            />
          </div>
        </div>
      </Card>
      
      <Card>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Tax Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Tax ID"
            name="taxId"
            value={settings.taxId || ''}
            onChange={(e) => onChange('taxId', e.target.value)}
            placeholder="e.g. CHE-123.456.789"
            helpText="Your company's tax identification number"
          />
          
          <Input
            label="VAT Number"
            name="vatNumber"
            value={settings.vatNumber || ''}
            onChange={(e) => onChange('vatNumber', e.target.value)}
            placeholder="e.g. CHE-123.456.789 VAT"
            helpText="Value-added tax registration number"
          />
        </div>
      </Card>
    </div>
  );
};

export default CompanyProfileTab;