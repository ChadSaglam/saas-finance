"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
      <button
        type="button"
        className="md:hidden px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      
      <div className="flex-1 px-4 flex justify-between">
        <div className="flex-1">
          {/* Search bar could go here */}
        </div>
        <div className="ml-4 flex items-center md:ml-6">
          {/* Notification bell could go here */}
          
          {/* Profile dropdown */}
          <div className="ml-3 relative">
            <div>
              <button
                type="button"
                className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="font-medium text-gray-600">CS</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile sidebar */}
      {isOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsOpen(false)} />
          
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-blue-700">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setIsOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <svg
                  className="h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
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
          </div>
        </div>
      )}
    </div>
  );
}