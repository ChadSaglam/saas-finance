'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, safeRedirect } from '@/lib/contexts/AuthContext';

export const useRequireAuth = (require2FA = true) => {
  const auth = useAuth();
  const router = useRouter();
  const [checkComplete, setCheckComplete] = useState(false);

  useEffect(() => {
    // Only check after auth state is loaded and on client
    if (auth.isLoading || typeof window === 'undefined') return;
    
    if (!auth.isAuthenticated) {
      safeRedirect(router, '/login');
    } else if (require2FA && auth.needsVerification && !auth.isTwoFactorVerified) {
      safeRedirect(router, '/verify-2fa');
    } else {
      setCheckComplete(true);
    }
  }, [
    auth.isLoading,
    auth.isAuthenticated, 
    auth.isTwoFactorVerified,
    auth.needsVerification,
    require2FA,
    router
  ]);

  return { 
    ...auth,
    checkComplete
  };
};