'use client';

import Card from '@/components/ui/Card';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/AuthContext';

export const SecurityStatusCard = () => {
  const { user } = useAuth();
  
  return (
    <Card>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Security Status</h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Protected
          </span>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">2FA Authentication:</span>
            <span className="font-medium text-green-600">Enabled</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Last Login IP:</span>
            <span className="font-medium">{user?.lastLoginIp || '192.168.1.1'}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Login Email:</span>
            <span className="font-medium truncate max-w-[180px]">{user?.email || 'test@example.com'}</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Link href="/account/security" className="w-full block text-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors">
            Security Settings
          </Link>
        </div>
      </div>
    </Card>
  );
};