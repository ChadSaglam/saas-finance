"use client";

import { useState } from 'react';
import CompanyForm from './company-form';
import { useCompanySettings } from '@/lib/contexts/CompanySettings';
import { CompanySettings } from '@/lib/models';
import PageHeader from '@/components/layout/PageHeader';
import SettingsLayout from '@/components/settings/SettingsLayout';
import Toast from '@/components/ui/Toast';

export default function SettingsPage() {
  const { settings, updateSettings, isSaving } = useCompanySettings();
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const handleSave = async (updatedSettings: CompanySettings) => {
    try {
      await updateSettings(updatedSettings);
      setNotification({
        type: 'success',
        message: 'Company settings saved successfully!'
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to save settings. Please try again.'
      });
    }
  };

  return (
    <SettingsLayout>
      <div className="p-6">
        <PageHeader 
          title="Company Settings" 
          description="Manage your company information that appears on invoices and offers" 
        />
        
        {/* Notification Toast using new component */}
        {notification && (
          <Toast
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
            duration={3000}
          />
        )}

        <div className="mt-6">
          <CompanyForm 
            initialSettings={settings} 
            onSave={handleSave} 
            isSaving={isSaving} 
          />
        </div>
      </div>
    </SettingsLayout>
  );
}