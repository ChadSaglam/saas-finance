'use client';

import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import { useAuth, safeRedirect } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const auth = useAuth();
  const [isClient, setIsClient] = useState(false);
  
  // Mark when client-side rendering is active
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Check auth status after component mounts on client
  useEffect(() => {
    // Only run on client and after auth loads
    if (!isClient || auth.isLoading) return;
    
    console.log('[DASHBOARD LAYOUT] Auth state:', {
      isAuthenticated: auth.isAuthenticated,
      needsVerification: auth.needsVerification,
      isTwoFactorVerified: auth.isTwoFactorVerified,
    });
    
    if (!auth.isAuthenticated) {
      safeRedirect(router, '/login');
      return;
    } 
    
    if (auth.needsVerification && !auth.isTwoFactorVerified) {
      safeRedirect(router, '/verify-2fa');
      return;
    }
  }, [isClient, auth.isLoading, auth.isAuthenticated, auth.isTwoFactorVerified, auth.needsVerification, router]);

  // Show loading until we're sure about client-side rendering and auth state
  if (!isClient || auth.isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render dashboard if not authenticated or needs verification
  if (!auth.isAuthenticated || (auth.needsVerification && !auth.isTwoFactorVerified)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="md:pl-64 flex flex-col flex-1">
        <Header />
        
        <main className="flex-1 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
            {children}
          </div>
        </main>
        
        <footer className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 md:px-8">
            <p className="text-center text-sm text-gray-500">
              © {new Date().getFullYear()} InvoicePro. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}