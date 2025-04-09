"use client";

import { useState, memo } from 'react';
import Link from 'next/link';
import { BellIcon, MenuIcon, SearchIcon, XMarkIcon } from '@/components/ui/Icons';

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Invoice #INV-2025-0014 is overdue',
    description: 'Payment was due yesterday',
    time: '1 hour ago',
    unread: true
  },
  {
    id: '2',
    title: 'New client registered',
    description: 'TechNova Inc. created an account',
    time: '3 hours ago',
    unread: true
  },
  {
    id: '3',
    title: 'Offer #OFF-2025-0021 was accepted',
    description: 'Client accepted your price offer',
    time: '1 day ago',
    unread: false
  }
];

const NotificationItem = ({ notification }: { notification: Notification }) => (
  <div 
    className={`px-4 py-3 hover:bg-gray-50 ${notification.unread ? 'bg-blue-50' : ''}`}
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{notification.description}</p>
        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
      </div>
      {notification.unread && (
        <span className="inline-block h-2 w-2 rounded-full bg-blue-500"></span>
      )}
    </div>
  </div>
);

const UserMenu = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
  isOpen && (
    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
      <div className="px-4 py-2 border-b border-gray-200">
        <p className="text-sm font-medium text-gray-900">Chad Saglam</p>
        <p className="text-xs text-gray-500 truncate">chad@example.com</p>
      </div>
      
      <Link href="/dashboard/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
        Your Profile
      </Link>
      <Link href="/dashboard/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
        Settings
      </Link>
      <Link href="/logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
        Sign out
      </Link>
    </div>
  )
);

const NotificationsMenu = ({ isOpen, notifications }: { isOpen: boolean; notifications: Notification[] }) => (
  isOpen && (
    <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
      <div className="py-1" role="menu" aria-orientation="vertical">
        <div className="px-4 py-2 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
        </div>
        
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
        
        <div className="px-4 py-2 border-t border-gray-200 text-center">
          <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
            View all notifications
          </button>
        </div>
      </div>
    </div>
  )
);

const MobileSidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
  isOpen && (
    <div className="fixed inset-0 flex z-40 md:hidden">
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={onClose} />
      
      <div className="relative flex-1 flex flex-col max-w-xs w-full bg-blue-700">
        <div className="absolute top-0 right-0 -mr-12 pt-2">
          <button
            type="button"
            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            onClick={onClose}
          >
            <span className="sr-only">Close sidebar</span>
            <XMarkIcon className="h-6 w-6 text-white" />
          </button>
        </div>
        
        <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold text-white">InvoicePro</h1>
          </div>
          <nav className="mt-5 px-2 space-y-1">
            <Link href="/dashboard" className="text-white hover:bg-blue-600 group flex items-center px-2 py-2 text-base font-medium rounded-md">Dashboard</Link>
            <Link href="/dashboard/clients" className="text-white hover:bg-blue-600 group flex items-center px-2 py-2 text-base font-medium rounded-md">Clients</Link>
            <Link href="/dashboard/invoices" className="text-white hover:bg-blue-600 group flex items-center px-2 py-2 text-base font-medium rounded-md">Invoices</Link>
            <Link href="/dashboard/offers" className="text-white hover:bg-blue-600 group flex items-center px-2 py-2 text-base font-medium rounded-md">Price Offers</Link>
            <Link href="/dashboard/settings" className="text-white hover:bg-blue-600 group flex items-center px-2 py-2 text-base font-medium rounded-md">Settings</Link>
          </nav>
        </div>
        
        <div className="flex-shrink-0 flex border-t border-blue-800 p-4">
          <div className="flex items-center">
            <div>
              <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white">
                <span>CS</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-base font-medium text-white">Chad Saglam</p>
              <Link href="/logout" className="text-sm font-medium text-blue-200 hover:text-white">Sign out</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
);

const Header = () => {
  // Consolidate related state into a single object with useReducer for better state management
  const [dropdownState, setDropdownState] = useState({
    isMobileSidebarOpen: false,
    isNotificationsOpen: false,
    isUserMenuOpen: false
  });
  
  // Helper to close all dropdowns
  const closeAllDropdowns = () => {
    setDropdownState({
      isMobileSidebarOpen: false,
      isNotificationsOpen: false,
      isUserMenuOpen: false
    });
  };

  // Toggle specific dropdown and close others
  const toggleDropdown = (dropdown: keyof typeof dropdownState) => {
    setDropdownState(prev => ({
      isMobileSidebarOpen: false,
      isNotificationsOpen: false,
      isUserMenuOpen: false,
      [dropdown]: !prev[dropdown]
    }));
  };
  
  return (
    <header className="sticky top-0 z-5 flex-shrink-0 flex h-16 bg-white shadow">
      <button
        type="button"
        className="md:hidden px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
        onClick={() => toggleDropdown('isMobileSidebarOpen')}
        aria-label="Open sidebar"
      >
        <MenuIcon className="h-6 w-6" aria-hidden="true" />
      </button>
      
      <div className="flex-1 px-4 flex justify-between">
        <div className="flex-1 flex items-center">
          <div className="max-w-lg w-full lg:max-w-md">
            <label htmlFor="search" className="sr-only">Search</label>
            <div className="relative text-gray-400 focus-within:text-gray-600">
              <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                <SearchIcon className="h-5 w-5" aria-hidden="true" />
              </div>
              <input
                id="search"
                className="block w-full bg-white border border-gray-300 rounded-md py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Search for clients, invoices, etc."
                type="search"
              />
            </div>
          </div>
        </div>
        
        <div className="ml-4 flex items-center md:ml-6">
          {/* Notification dropdown */}
          <div className="relative">
            <button
              type="button"
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 relative"
              onClick={() => toggleDropdown('isNotificationsOpen')}
              aria-label="View notifications"
            >
              <BellIcon className="h-6 w-6" aria-hidden="true" />
              <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-400 ring-2 ring-white" aria-hidden="true"></span>
            </button>
            
            <NotificationsMenu 
              isOpen={dropdownState.isNotificationsOpen} 
              notifications={mockNotifications} 
            />
          </div>
          
          {/* Profile dropdown */}
          <div className="ml-3 relative">
            <div>
              <button
                type="button"
                className="max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => toggleDropdown('isUserMenuOpen')}
                aria-label="Open user menu"
              >
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  <span>CS</span>
                </div>
              </button>
            </div>
            
            <UserMenu 
              isOpen={dropdownState.isUserMenuOpen} 
              onClose={() => setDropdownState(prev => ({...prev, isUserMenuOpen: false}))} 
            />
          </div>
        </div>
      </div>
      
      <MobileSidebar 
        isOpen={dropdownState.isMobileSidebarOpen} 
        onClose={() => setDropdownState(prev => ({...prev, isMobileSidebarOpen: false}))} 
      />
    </header>
  );
};
export default memo(Header);