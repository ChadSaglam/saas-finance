import React from 'react';
import { CompanySettings } from '@/lib/models';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';

interface ContactInfoTabProps {
  settings: CompanySettings;
  onChange: (name: string, value: any) => void;
}

const ContactInfoTab: React.FC<ContactInfoTabProps> = ({ settings, onChange }) => {
  return (
    <Card>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Input
            label="Email"
            type="email"
            name="email"
            value={settings.email}
            onChange={(e) => onChange('email', e.target.value)}
            required
            helpText="This email will be displayed on your invoices and offers"
          />
        </div>
        
        <Input
          label="Phone"
          name="phone"
          value={settings.phone}
          onChange={(e) => onChange('phone', e.target.value)}
          placeholder="+41 78 123 45 67"
          required
        />
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
          <div className="flex rounded-md shadow-sm">
            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
              https://
            </span>
            <input
              type="text"
              id="website"
              name="website"
              value={settings.website?.replace(/^https?:\/\//, '') || ''}
              onChange={(e) => {
                const value = e.target.value.replace(/^https?:\/\//, '');
                onChange('website', value);
              }}
              className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="www.example.com"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">Your company website address</p>
        </div>
      </div>
    </Card>
  );
};

export default ContactInfoTab;