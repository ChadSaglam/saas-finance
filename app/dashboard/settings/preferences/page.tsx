"use client";

import React, { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Toast from '@/components/ui/Toast';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/TextArea';
import Checkbox from '@/components/ui/Checkbox';
import RadioGroup from '@/components/ui/RadioGroup';
import FileUpload from '@/components/ui/FileUpload';

interface UserPreferences {
  personal: {
    fullName: string;
    email: string;
    phone: string;
    position: string;
    profileImageUrl: string;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    compactMode: boolean;
    fontSize: 'small' | 'medium' | 'large';
  };
  notifications: {
    emailNotifications: boolean;
    invoiceReminders: boolean;
    paymentNotifications: boolean;
    documentSharing: boolean;
    marketingEmails: boolean;
  };
  defaults: {
    defaultCurrency: string;
    defaultDateFormat: string;
    defaultInvoiceDueDays: number;
    defaultDocumentFooter: string;
  };
}

export default function UserPreferencesPage() {
  const [preferences, setPreferences] = useState<UserPreferences>({
    personal: {
      fullName: 'Chad Saglam',
      email: 'chad.saglam@example.com',
      phone: '+1 (555) 123-4567',
      position: 'Financial Manager',
      profileImageUrl: '/images/avatar-placeholder.jpg',
    },
    appearance: {
      theme: 'system',
      compactMode: false,
      fontSize: 'medium',
    },
    notifications: {
      emailNotifications: true,
      invoiceReminders: true,
      paymentNotifications: true,
      documentSharing: true,
      marketingEmails: false,
    },
    defaults: {
      defaultCurrency: 'USD',
      defaultDateFormat: 'MM/DD/YYYY',
      defaultInvoiceDueDays: 30,
      defaultDocumentFooter: 'Thank you for your business!',
    },
  });

  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const currencies = [
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' },
    { value: 'CAD', label: 'CAD - Canadian Dollar' },
    { value: 'AUD', label: 'AUD - Australian Dollar' },
    { value: 'JPY', label: 'JPY - Japanese Yen' },
    { value: 'CNY', label: 'CNY - Chinese Yuan' },
    { value: 'INR', label: 'INR - Indian Rupee' },
    { value: 'BRL', label: 'BRL - Brazilian Real' },
    { value: 'TRY', label: 'TRY - Turkish Lira' }
  ];
  
  const dateFormats = [
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (US)' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (UK/EU)' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (ISO)' },
    { value: 'DD.MM.YYYY', label: 'DD.MM.YYYY (EU Alt)' }
  ];

  const themeOptions = [
    { value: 'light', label: 'Light Mode', icon: '☀️' },
    { value: 'dark', label: 'Dark Mode', icon: '🌙' },
    { value: 'system', label: 'System Default', icon: '🖥️' }
  ];

  const fontSizeOptions = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' }
  ];
  
  const handleInputChange = (
    section: keyof UserPreferences,
    field: string,
    value: string | number | boolean
  ) => {
    setPreferences(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleProfileImageChange = (file: File | null) => {
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setAvatarPreview(fileUrl);
      handleInputChange('personal', 'profileImageUrl', fileUrl);
    }
  };

  const handleSavePreferences = () => {
    // In a real app, save to backend
    // await saveUserPreferences(preferences)
    
    setNotification({
      type: 'success',
      message: 'User preferences saved successfully!'
    });
  };

  return (
    <div className="p-6">
      <PageHeader 
        title="User Preferences" 
        description="Customize your application settings and experience" 
      />
      
      {notification && (
        <Toast
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="mt-6 space-y-6">
        {/* Personal Information */}
        <Card>
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
            <h3 className="text-base font-medium text-gray-900">Personal Information</h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Input
                  type="text"
                  id="full-name"
                  label="Full Name"
                  value={preferences.personal.fullName}
                  onChange={(e) => handleInputChange('personal', 'fullName', e.target.value)}
                />
                
                <Input
                  type="email"
                  id="email"
                  label="Email Address"
                  value={preferences.personal.email}
                  onChange={(e) => handleInputChange('personal', 'email', e.target.value)}
                />
                
                <Input
                  type="tel"
                  id="phone"
                  label="Phone Number"
                  value={preferences.personal.phone}
                  onChange={(e) => handleInputChange('personal', 'phone', e.target.value)}
                />
                
                <Input
                  type="text"
                  id="position"
                  label="Job Position"
                  value={preferences.personal.position}
                  onChange={(e) => handleInputChange('personal', 'position', e.target.value)}
                />
              </div>
              
              <div className="flex flex-col items-center justify-center p-4">
                <div className="text-center">
                  <div className="mb-4">
                    <img 
                      src={avatarPreview || preferences.personal.profileImageUrl} 
                      alt="Profile" 
                      className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-gray-200"
                    />
                  </div>
                  <FileUpload
                    id="profile-image"
                    label="Profile Image"
                    accept="image/*"
                    maxSizeInMB={1}
                    onChange={handleProfileImageChange}
                    helpText="JPG, PNG, or GIF. 1MB max."
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Appearance Settings */}
        <Card>
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
            <h3 className="text-base font-medium text-gray-900">Appearance</h3>
          </div>
          <div className="p-4">
            <div className="space-y-6">
              {/* Theme Selection */}
              <div>
                <Label text="Theme" htmlFor="theme-selector" />
                <RadioGroup
                  id="theme-selector"
                  name="theme"
                  options={themeOptions}
                  value={preferences.appearance.theme}
                  onChange={(value) => handleInputChange('appearance', 'theme', value)}
                  layout="horizontal"
                />
              </div>
              
              {/* Compact Mode */}
              <div className="flex items-center">
                <Checkbox
                  id="compact-mode"
                  checked={preferences.appearance.compactMode}
                  onChange={(e) => handleInputChange('appearance', 'compactMode', e.target.checked)}
                />
                <Label 
                  text="Use compact mode (reduces spacing between elements)"
                  htmlFor="compact-mode"
                  className="ml-2 mb-0"
                />
              </div>
              
              {/* Font Size */}
              <div>
                <Label text="Font Size" htmlFor="font-size-selector" />
                <RadioGroup
                  id="font-size-selector"
                  name="fontSize"
                  options={fontSizeOptions}
                  value={preferences.appearance.fontSize}
                  onChange={(value) => handleInputChange('appearance', 'fontSize', value)}
                  layout="horizontal"
                />
              </div>
            </div>
          </div>
        </Card>
        
        {/* Notification Settings */}
        <Card>
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
            <h3 className="text-base font-medium text-gray-900">Notification Preferences</h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              <div className="flex items-center">
                <Checkbox
                  id="email-notifications"
                  checked={preferences.notifications.emailNotifications}
                  onChange={(e) => handleInputChange('notifications', 'emailNotifications', e.target.checked)}
                />
                <Label 
                  text="Enable email notifications"
                  htmlFor="email-notifications"
                  className="ml-2 mb-0"
                />
              </div>
              
              {preferences.notifications.emailNotifications && (
                <div className="ml-6 pl-2 border-l-2 border-gray-100 space-y-3">
                  <div className="flex items-center">
                    <Checkbox
                      id="invoice-reminders"
                      checked={preferences.notifications.invoiceReminders}
                      onChange={(e) => handleInputChange('notifications', 'invoiceReminders', e.target.checked)}
                    />
                    <Label 
                      text="Invoice due date reminders"
                      htmlFor="invoice-reminders"
                      className="ml-2 mb-0"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <Checkbox
                      id="payment-notifications"
                      checked={preferences.notifications.paymentNotifications}
                      onChange={(e) => handleInputChange('notifications', 'paymentNotifications', e.target.checked)}
                    />
                    <Label 
                      text="Payment received notifications"
                      htmlFor="payment-notifications"
                      className="ml-2 mb-0"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <Checkbox
                      id="document-sharing"
                      checked={preferences.notifications.documentSharing}
                      onChange={(e) => handleInputChange('notifications', 'documentSharing', e.target.checked)}
                    />
                    <Label 
                      text="Document sharing notifications"
                      htmlFor="document-sharing"
                      className="ml-2 mb-0"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <Checkbox
                      id="marketing-emails"
                      checked={preferences.notifications.marketingEmails}
                      onChange={(e) => handleInputChange('notifications', 'marketingEmails', e.target.checked)}
                    />
                    <Label 
                      text="Marketing emails and product updates"
                      htmlFor="marketing-emails"
                      className="ml-2 mb-0"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
        
        {/* Default Settings */}
        <Card>
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
            <h3 className="text-base font-medium text-gray-900">Default Settings</h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Select
                  id="default-currency"
                  label="Default Currency"
                  options={currencies}
                  value={preferences.defaults.defaultCurrency}
                  onChange={(e) => handleInputChange('defaults', 'defaultCurrency', e.target.value)}
                />
              </div>
              
              <div>
                <Select
                  id="default-date-format"
                  label="Default Date Format"
                  options={dateFormats}
                  value={preferences.defaults.defaultDateFormat}
                  onChange={(e) => handleInputChange('defaults', 'defaultDateFormat', e.target.value)}
                />
              </div>
              
              <div>
                <Input
                  type="number"
                  id="due-days"
                  label="Default Invoice Due Days"
                  min="1"
                  max="90"
                  value={String(preferences.defaults.defaultInvoiceDueDays)}
                  onChange={(e) => handleInputChange('defaults', 'defaultInvoiceDueDays', parseInt(e.target.value, 10) || 0)}
                  helpText="Number of days until invoices are due by default"
                />
              </div>
              
              <div>
                <Textarea
                  id="default-footer"
                  label="Default Document Footer"
                  rows={3}
                  placeholder="Enter default footer text for documents"
                  value={preferences.defaults.defaultDocumentFooter}
                  onChange={(e) => handleInputChange('defaults', 'defaultDocumentFooter', e.target.value)}
                  helpText="This text will appear at the bottom of invoices and offers."
                />
              </div>
            </div>
          </div>
        </Card>
        
        {/* Action Buttons */}
        <div className="flex justify-end">
          <Button onClick={handleSavePreferences}>
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
}