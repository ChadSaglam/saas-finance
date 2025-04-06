import Link from "next/link";
import { Users, FileCheck, FileText, BarChart3, Settings, LogOut } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 h-full bg-gray-800 text-white">
      <div className="flex items-center justify-center h-16 border-b border-gray-700">
        <h1 className="text-2xl font-bold">SaaSInvoice</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-4">
        <Link href="/dashboard" className="flex items-center gap-3 py-2 px-4 rounded-md hover:bg-gray-700">
          <BarChart3 className="w-5 h-5" />
          <span>Dashboard</span>
        </Link>
        <Link href="/clients" className="flex items-center gap-3 py-2 px-4 rounded-md hover:bg-gray-700">
          <Users className="w-5 h-5" />
          <span>Clients</span>
        </Link>
        <Link href="/offers" className="flex items-center gap-3 py-2 px-4 rounded-md hover:bg-gray-700">
          <FileCheck className="w-5 h-5" />
          <span>Offers</span>
        </Link>
        <Link href="/invoices" className="flex items-center gap-3 py-2 px-4 rounded-md hover:bg-gray-700">
          <FileText className="w-5 h-5" />
          <span>Invoices</span>
        </Link>
        <Link href="/settings" className="flex items-center gap-3 py-2 px-4 rounded-md hover:bg-gray-700">
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </Link>
      </nav>
      <div className="px-4 py-6 border-t border-gray-700">
        <button className="flex items-center gap-3 py-2 px-4 rounded-md hover:bg-gray-700 w-full text-left">
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}