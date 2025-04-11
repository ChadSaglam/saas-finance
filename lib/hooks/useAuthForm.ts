'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ValidationOptions {
  requireName?: boolean;
  requirePasswordMatch?: boolean;
  requireStrongPassword?: boolean;
}

export function useAuthForm(options: ValidationOptions = {}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const router = useRouter();
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (options.requireStrongPassword) {
      if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (!/[A-Z]/.test(formData.password) || 
                !/[a-z]/.test(formData.password) || 
                !/[0-9]/.test(formData.password)) {
        newErrors.password = 'Password must include uppercase, lowercase, and numbers';
      }
    }
    
    // Name validation if required
    if (options.requireName && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    // Confirm password validation if required
    if (options.requirePasswordMatch && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors for this field when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    if (generalError) {
      setGeneralError('');
    }
  };
  
  return {
    formData,
    errors,
    isSubmitting,
    setIsSubmitting,
    generalError,
    setGeneralError,
    validateForm,
    handleChange,
    router
  };
}