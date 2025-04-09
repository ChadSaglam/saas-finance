"use client";

import { memo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ChartBarIcon, 
  UsersIcon, 
  DocumentIcon, 
  TagIcon, 
  SettingsIcon,
  CashIcon,
  ClockIcon
} from '@/components/ui/Icons';

// Move navigation items to a config for better maintainability
const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: ChartBarIcon },
  { name: 'Clients', href: '/dashboard/clients', icon: UsersIcon },
  { name: 'Invoices', href: '/dashboard/invoices', icon: DocumentIcon },
  { name: 'Price Offers', href: '/dashboard/offers', icon: TagIcon },
  { name: 'Payments', href: '/dashboard/payments', icon: CashIcon },
  { name: 'Reports', href: '/dashboard/reports', icon: ChartBarIcon },
  { name: 'Time Tracking', href: '/dashboard/time-tracking', icon: ClockIcon },
];

const secondaryNavigationItems = [
  { 
    name: 'Settings', 
    href: '/dashboard/settings', 
    icon: SettingsIcon 
  },
  { 
    name: 'Help', 
    href: '/dashboard/help', 
    icon: () => (
      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
      </svg>
    ) 
  },
];

// Create a reusable NavItem component for DRY code
const NavItem = ({ item, isActive }: { 
  item: { name: string; href: string; icon: React.ComponentType<{ className: string }> };
  isActive: boolean;
}) => {
  const IconComponent = item.icon;
  
  return (
    <Link
      href={item.href}
      className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
        isActive
          ? 'bg-blue-800 text-white'
          : 'text-blue-100 hover:bg-blue-700 hover:text-white'
      }`}
    >
      <IconComponent
        className={`mr-3 flex-shrink-0 h-5 w-5 ${
          isActive ? 'text-white' : 'text-blue-300 group-hover:text-white'
        }`}
      />
      {item.name}
    </Link>
  );
};

const Sidebar = () => {
  const pathname = usePathname();
  
  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex flex-col flex-grow pt-5 bg-gradient-to-b from-blue-800 to-blue-600 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <div className="h-8 w-8 rounded-md bg-white flex items-center justify-center mr-2">
            <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 01-.75.75h-.75m-6-1.5H2.25M6.75 7.5H3v3h3.75m3-6H21v3h-7.5" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white">InvoicePro</h1>
        </div>
        
        <div className="mt-8 flex-1 flex flex-col">
          <nav className="flex-1 px-4 pb-4 space-y-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return <NavItem key={item.name} item={item} isActive={isActive} />;
            })}
          </nav>
          
          <div className="mt-auto">
            <div className="px-4">
              <div className="py-3">
                <div className="h-px bg-blue-800"></div>
              </div>
            </div>
            <nav className="px-4 pb-8 space-y-1">
              {secondaryNavigationItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return <NavItem key={item.name} item={item} isActive={isActive} />;
              })}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Sidebar);