import Link from "next/link";
import { Plus } from "lucide-react";

export function QuickActions() {
  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Link 
        href="/dashboard/new-invoice" 
        className="flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 hover:shadow-md transition-shadow"
      >
        <div className="flex items-center gap-3">
          <Plus className="w-6 h-6 text-blue-600" />
          <span className="text-lg font-medium text-blue-700">Create New Invoice</span>
        </div>
      </Link>
      <Link 
        href="/dashboard/new-offer" 
        className="flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 hover:shadow-md transition-shadow"
      >
        <div className="flex items-center gap-3">
          <Plus className="w-6 h-6 text-green-600" />
          <span className="text-lg font-medium text-green-700">Create New Offer</span>
        </div>
      </Link>
    </div>
  );
}