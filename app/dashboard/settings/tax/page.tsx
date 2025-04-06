"use client";

import React, { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Toast from '@/components/ui/Toast';
import IconButton from '@/components/ui/IconButton';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label'; // Added Label component import

interface TaxRate {
  id: string;
  name: string;
  rate: number;
  isDefault: boolean;
  country?: string;
  region?: string;
}

interface TaxSettings {
  taxRates: TaxRate[];
  enableVAT: boolean;
  vatNumber?: string;
  showTaxIdOnInvoices: boolean;
  applyTaxByDefault: boolean;
}

export default function TaxSettingsPage() {
  const [taxSettings, setTaxSettings] = useState<TaxSettings>({
    taxRates: [
      { id: 'default', name: 'Standard Rate', rate: 20, isDefault: true },
      { id: 'reduced', name: 'Reduced Rate', rate: 5, isDefault: false },
      { id: 'zero', name: 'Zero Rate', rate: 0, isDefault: false },
    ],
    enableVAT: true,
    vatNumber: 'GB123456789',
    showTaxIdOnInvoices: true,
    applyTaxByDefault: true
  });
  
  const [newTaxRate, setNewTaxRate] = useState<Omit<TaxRate, 'id'>>({
    name: '',
    rate: 0,
    isDefault: false
  });
  
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [formTouched, setFormTouched] = useState({
    name: false,
    rate: false
  });

  // Validate the new tax rate form
  React.useEffect(() => {
    const isValid = 
      newTaxRate.name.trim() !== '' && 
      !isNaN(newTaxRate.rate) && 
      newTaxRate.rate >= 0 &&
      newTaxRate.rate <= 100;
    
    setIsFormValid(isValid);
  }, [newTaxRate]);

  const handleSaveTaxSettings = () => {
    // In a real app, save to backend
    // await saveTaxSettings(taxSettings)
    
    setNotification({
      type: 'success',
      message: 'Tax settings saved successfully!'
    });
  };

  const handleAddTaxRate = () => {
    if (!isFormValid) {
      // Mark all fields as touched to show validation errors
      setFormTouched({ name: true, rate: true });
      return;
    }

    const newRate = {
      ...newTaxRate,
      id: `rate-${Date.now()}`
    };
    
    setTaxSettings(prev => ({
      ...prev,
      taxRates: [...prev.taxRates, newRate]
    }));
    
    // Reset the form
    setNewTaxRate({
      name: '',
      rate: 0,
      isDefault: false
    });
    
    // Reset touched state
    setFormTouched({ name: false, rate: false });
    
    // Show success notification
    setNotification({
      type: 'success',
      message: 'Tax rate added successfully!'
    });
  };

  const handleRemoveTaxRate = (id: string) => {
    // Don't allow removing the default rate
    const rateToRemove = taxSettings.taxRates.find(rate => rate.id === id);
    if (rateToRemove?.isDefault) {
      setNotification({
        type: 'error',
        message: 'Cannot remove the default tax rate'
      });
      return;
    }
    
    setTaxSettings(prev => ({
      ...prev,
      taxRates: prev.taxRates.filter(rate => rate.id !== id)
    }));
    
    setNotification({
      type: 'success',
      message: 'Tax rate removed successfully'
    });
  };

  const handleSetDefault = (id: string) => {
    setTaxSettings(prev => ({
      ...prev,
      taxRates: prev.taxRates.map(rate => ({
        ...rate,
        isDefault: rate.id === id
      }))
    }));
    
    setNotification({
      type: 'success',
      message: 'Default tax rate updated'
    });
  };

  const handleToggleSetting = (setting: keyof TaxSettings) => {
    setTaxSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleChangeVatNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaxSettings(prev => ({
      ...prev,
      vatNumber: e.target.value
    }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTaxRate({...newTaxRate, name: e.target.value});
    if (!formTouched.name) {
      setFormTouched(prev => ({ ...prev, name: true }));
    }
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // If empty string, set rate to 0, otherwise parse as float
    const rate = value === '' ? 0 : parseFloat(value);
    
    setNewTaxRate({
      ...newTaxRate,
      rate: isNaN(rate) ? 0 : rate // Ensure we never store NaN
    });
    
    if (!formTouched.rate) {
      setFormTouched(prev => ({ ...prev, rate: true }));
    }
  };

  return (
    <div className="p-6">
      <PageHeader 
        title="Tax Settings" 
        description="Configure tax rates and options for your invoices and offers" 
      />
      
      {notification && (
        <Toast
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="mt-6 space-y-6">
        {/* Tax Rates */}
        <Card>
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
            <h3 className="text-base font-medium text-gray-900">Tax Rates</h3>
          </div>
          <div className="p-4">
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Configure tax rates that will be available when creating invoices and offers.
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 mb-4">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rate (%)
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {taxSettings.taxRates.map((rate) => (
                    <tr key={rate.id}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {rate.name}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
                        {rate.rate}%
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        {rate.isDefault ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Default
                          </span>
                        ) : (
                          <button
                            onClick={() => handleSetDefault(rate.id)}
                            className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            Set as default
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                        <IconButton
                          onClick={() => handleRemoveTaxRate(rate.id)}
                          disabled={rate.isDefault}
                          aria-label="Remove tax rate"
                          className={rate.isDefault ? 'text-gray-300 cursor-not-allowed' : 'text-red-600 hover:text-red-800'}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Add new tax rate form */}
            <div className="bg-gray-50 rounded-md p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Add New Tax Rate</h4>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-5">
                  <Input
                    type="text"
                    id="tax-name"
                    label="Tax Name"
                    value={newTaxRate.name}
                    onChange={handleNameChange}
                    placeholder="e.g., Reduced Rate"
                    helpText="Name for this tax rate"
                    error={formTouched.name && newTaxRate.name.trim() === '' ? 'Tax name is required' : ''}
                    className="mb-0"
                  />
                </div>
                <div className="md:col-span-4">
                  <Input
                    type="number"
                    id="tax-rate"
                    label="Rate (%)"
                    min="0"
                    max="100"
                    value={String(newTaxRate.rate)}
                    onChange={handleRateChange}
                    placeholder="e.g., 10"
                    helpText="Tax percentage (0-100)"
                    error={
                      formTouched.rate && 
                      (isNaN(newTaxRate.rate) || newTaxRate.rate < 0 || newTaxRate.rate > 100) 
                        ? 'Rate must be between 0 and 100' 
                        : ''
                    }
                    className="mb-0"
                  />
                </div>
                <div className="md:col-span-3">
                  <Button 
                    onClick={handleAddTaxRate} 
                    disabled={!isFormValid}
                    className="w-full"
                    style={{ height: '42px' }} // Match Input component height
                  >
                    Add Tax Rate
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        {/* VAT Settings */}
        <Card>
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
            <h3 className="text-base font-medium text-gray-900">VAT Settings</h3>
          </div>
          <div className="p-4">
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Configure VAT/GST settings for your business.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  id="enable-vat"
                  name="enable-vat"
                  type="checkbox"
                  checked={taxSettings.enableVAT}
                  onChange={() => handleToggleSetting('enableVAT')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <Label 
                  text="Enable VAT/GST"
                  htmlFor="enable-vat"
                  className="ml-2 mb-0" // Remove bottom margin and add left margin
                />
              </div>
              
              {taxSettings.enableVAT && (
                <div className="ml-6 pl-2 border-l-2 border-gray-100">
                  <div className="max-w-md">
                    <Input
                      type="text"
                      id="vat-number"
                      label="VAT/GST Number"
                      value={taxSettings.vatNumber || ''}
                      onChange={handleChangeVatNumber}
                      helpText="This number will be displayed on your invoices if enabled below."
                    />
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex items-center">
                      <input
                        id="show-tax-id"
                        name="show-tax-id"
                        type="checkbox"
                        checked={taxSettings.showTaxIdOnInvoices}
                        onChange={() => handleToggleSetting('showTaxIdOnInvoices')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <Label 
                        text="Show Tax ID on invoices and offers" 
                        htmlFor="show-tax-id"
                        className="ml-2 mb-0"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="pt-2">
                <div className="flex items-center">
                  <input
                    id="apply-tax-default"
                    name="apply-tax-default"
                    type="checkbox"
                    checked={taxSettings.applyTaxByDefault}
                    onChange={() => handleToggleSetting('applyTaxByDefault')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <Label 
                    text="Apply tax rates by default on new invoices and offers" 
                    htmlFor="apply-tax-default"
                    className="ml-2 mb-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Action Buttons */}
        <div className="flex justify-end">
          <Button onClick={handleSaveTaxSettings}>
            Save Tax Settings
          </Button>
        </div>
      </div>
    </div>
  );
}