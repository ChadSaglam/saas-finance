'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { CompanySettings } from '@/lib/models';
import { companySettings as defaultSettings } from '@/lib/dummy-data/company-settings';

interface CompanySettingsContextType {
  settings: CompanySettings;
  updateSettings: (settings: CompanySettings) => Promise<void>;
  isSaving: boolean;
  lastSaved: Date | null;
}

// Create context
export const CompanySettingsContext = createContext<CompanySettingsContextType>({
  settings: defaultSettings,
  updateSettings: async () => {},
  isSaving: false,
  lastSaved: null
});

// Custom hook
export const useCompanySettings = () => useContext(CompanySettingsContext);

interface CompanySettingsProviderProps {
  children: ReactNode;
}

export const CompanySettingsProvider: React.FC<CompanySettingsProviderProps> = ({ children }) => {
  // Initialize from localStorage only once (with a function to prevent re-computation)
  const [settings, setSettings] = useState<CompanySettings>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('companySettings');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error('Error parsing stored settings:', e);
        }
      }
    }
    return defaultSettings;
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Add storage event listener only once
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'companySettings' && e.newValue) {
        try {
          setSettings(JSON.parse(e.newValue));
        } catch (e) {
          console.error('Error parsing updated settings:', e);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // Empty dependency array - only run once

  const updateSettings = async (newSettings: CompanySettings): Promise<void> => {
    setIsSaving(true);
    try {
      // In the future, this would call your MongoDB API
      localStorage.setItem('companySettings', JSON.stringify(newSettings));
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSettings(newSettings);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  // Value object - only created when dependencies change
  const contextValue = {
    settings,
    updateSettings,
    isSaving,
    lastSaved
  };

  return (
    <CompanySettingsContext.Provider value={contextValue}>
      {children}
    </CompanySettingsContext.Provider>
  );
};