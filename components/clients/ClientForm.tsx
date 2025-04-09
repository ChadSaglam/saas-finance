"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/TextArea';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { Client } from '@/lib/models';
import { formatDisplayDate } from '@/lib/utils/format';

interface ClientFormProps {
  client?: Client;
  onSubmit?: (client: Client) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

const ClientForm: React.FC<ClientFormProps> = ({
  client,
  onSubmit,
  onCancel,
  isSubmitting = false
}) => {
  const router = useRouter();
  const isEditMode = !!client;
  
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    website: '',
    notes: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || '',
        contactPerson: client.contactPerson || '',
        email: client.email || '',
        phone: client.phone || '',
        address: client.address || '',
        city: client.city || '',
        state: client.state || '',
        zipCode: client.zipCode || '',
        country: client.country || '',
        website: client.website || '',
        notes: client.notes || '',
      });
    }
  }, [client]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Mark field as touched
    if (!touched[name]) {
      setTouched(prev => ({
        ...prev,
        [name]: true
      }));
    }
    
    // Validate on change for better UX
    validateField(name, value);
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    validateField(name, value);
  };
  
  const validateField = (name: string, value: string): boolean => {
    let error = '';
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          error = 'Client name is required';
        }
        break;
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!/^\S+@\S+\.\S+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;
      case 'phone':
        if (!value.trim()) {
          error = 'Phone number is required';
        }
        break;
      case 'address':
        if (!value.trim()) {
          error = 'Address is required';
        }
        break;
      case 'website':
        if (value.trim() && !/^https?:\/\/.+\..+/.test(value)) {
          error = 'Please enter a valid URL (including http:// or https://)';
        }
        break;
    }
    
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
    
    return !error;
  };
  
  const validateForm = (): boolean => {
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allTouched);
    
    // Validate all fields
    let isValid = true;
    for (const [key, value] of Object.entries(formData)) {
      if (!validateField(key, value as string)) {
        isValid = false;
      }
    }
    
    return isValid;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Focus the first field with an error
      const firstErrorField = Object.keys(errors).find(key => errors[key]);
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        if (element) {
          element.focus();
        }
      }
      return;
    }
    
    const updatedClient: Client = {
      id: client?.id || uuidv4(),
      name: formData.name,
      contactPerson: formData.contactPerson,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city || undefined,
      state: formData.state || undefined,
      zipCode: formData.zipCode || undefined,
      country: formData.country || undefined,
      website: formData.website || undefined,
      notes: formData.notes || undefined,
      createdAt: client?.createdAt || new Date(),
      updatedAt: new Date()
    };
    
    if (onSubmit) {
      onSubmit(updatedClient);
    } else {
      console.log('Client data:', updatedClient);
      // Navigate back to clients list
      router.push('/dashboard/clients');
    }
  };
  
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.push('/dashboard/clients');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AnimatedContainer animation="slide-in-up" duration={300} delay={100}>
            <Card className="card-shadow">
              <div className="p-6">
                <h2 className="text-xl font-medium text-gray-900 mb-6">
                  {isEditMode ? 'Edit Client' : 'New Client'}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <Input
                      label="Client Name"
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.name ? errors.name : undefined}
                      placeholder="Company or individual name"
                      autoComplete="organization"
                      required
                    />
                  </div>
                  
                  <div>
                    <Input
                      label="Contact Person"
                      type="text"
                      id="contactPerson"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Primary contact"
                      autoComplete="name"
                    />
                  </div>
                  
                  <div>
                    <Input
                      label="Email"
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email ? errors.email : undefined}
                      placeholder="email@example.com"
                      autoComplete="email"
                      required
                    />
                  </div>
                  
                  <div>
                    <Input
                      label="Phone"
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.phone ? errors.phone : undefined}
                      placeholder="+1 (555) 123-4567"
                      autoComplete="tel"
                      required
                    />
                  </div>
                  
                  <div>
                    <Input
                      label="Website"
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.website ? errors.website : undefined}
                      placeholder="https://www.example.com"
                      autoComplete="url"
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <Input
                        label="Street Address"
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.address ? errors.address : undefined}
                        placeholder="123 Main St"
                        autoComplete="street-address"
                        required
                      />
                    </div>
                    
                    <div>
                      <Input
                        label="City"
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete="address-level2"
                      />
                    </div>
                    
                    <div>
                      <Input
                        label="State / Province"
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete="address-level1"
                      />
                    </div>
                    
                    <div>
                      <Input
                        label="ZIP / Postal Code"
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete="postal-code"
                      />
                    </div>
                    
                    <div>
                      <Input
                        label="Country"
                        type="text"
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete="country"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Textarea
                    label="Notes"
                    id="notes"
                    name="notes"
                    rows={4}
                    value={formData.notes}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Additional information about this client..."
                  />
                </div>
              </div>
            </Card>
          </AnimatedContainer>
        </div>
        
        <div>
          <AnimatedContainer animation="slide-in-up" duration={300} delay={200}>
            <Card className="card-shadow">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Summary</h3>
                
                <div className="text-sm text-gray-500 mb-6">
                  <p>Fill in the client details and click save to {isEditMode ? 'update the' : 'create a new'} client record.</p>
                  <p className="mt-2">Fields marked with <span className="text-red-500">*</span> are required.</p>
                </div>
                
                {isEditMode && client && (
                  <div className="mb-6 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Created:</span>
                      <span className="text-gray-900">{formatDisplayDate(client.createdAt)}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-500">Last updated:</span>
                      <span className="text-gray-900">{formatDisplayDate(client.updatedAt)}</span>
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col space-y-3">
                  <Button 
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                    loadingText={isEditMode ? "Updating..." : "Saving..."}
                    fullWidth
                  >
                    {isEditMode ? 'Update Client' : 'Save Client'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handleCancel}
                    fullWidth
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
            
            {isEditMode && (
              <Card className="mt-6 card-shadow">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-red-900 mb-4">Danger Zone</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Permanently delete this client and all associated data. This action cannot be undone.
                  </p>
                  <Button 
                    type="button" 
                    variant="danger"
                    fullWidth
                  >
                    Delete Client
                  </Button>
                </div>
              </Card>
            )}
          </AnimatedContainer>
        </div>
      </div>
    </form>
  );
};

export default ClientForm;