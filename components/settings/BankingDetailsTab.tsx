import React from 'react';
import { CompanySettings, BankAccount } from '@/lib/models';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';

interface BankingDetailsTabProps {
  settings: CompanySettings;
  onUpdateBankAccount: (updates: Partial<BankAccount>) => void;
}

const BankingDetailsTab: React.FC<BankingDetailsTabProps> = ({ settings, onUpdateBankAccount }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onUpdateBankAccount({ [name]: value });
  };

  // Make sure we have a bankAccount object to work with
  const bankAccount = settings.bankAccount || { name: '', number: '', bank: '' };

  return (
    <Card>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Bank Account Information</h3>
      <p className="text-sm text-gray-600 mb-6">
        Your banking details will appear on invoices so your clients know where to send payments.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Bank Name"
          name="bank"
          value={bankAccount.bank || ''}
          onChange={handleChange}
          placeholder="Enter your bank name"
        />
        
        <Input
          label="Account Name"
          name="name"
          value={bankAccount.name || ''}
          onChange={handleChange}
          placeholder="Name on the account"
        />
        
        <Input
          label="Account Number"
          name="number"
          value={bankAccount.number || ''}
          onChange={handleChange}
          placeholder="Your account number"
        />
        
        <Input
          label="SWIFT Code"
          name="swift"
          value={bankAccount.swift || ''}
          onChange={handleChange}
          placeholder="SWIFT/BIC code"
        />
        
        <Input
          label="BIC"
          name="bic"
          value={bankAccount.bic || ''}
          onChange={handleChange}
          placeholder="Bank Identifier Code"
        />
        
        <div className="md:col-span-2">
          <Input
            label="IBAN"
            name="iban"
            value={bankAccount.iban || ''}
            onChange={handleChange}
            placeholder="International Bank Account Number"
          />
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 text-blue-700 text-sm rounded-md">
        <p className="flex items-center">
          <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Providing accurate banking details ensures faster payments from your clients.
        </p>
      </div>
    </Card>
  );
};

export default BankingDetailsTab;