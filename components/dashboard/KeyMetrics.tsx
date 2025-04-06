import { Users, FileCheck, FileText, DollarSign } from "lucide-react";

const stats = [
  { id: 1, name: 'Total Clients', stat: '12', icon: Users },
  { id: 2, name: 'Total Offers', stat: '24', icon: FileCheck },
  { id: 3, name: 'Total Invoices', stat: '18', icon: FileText },
  { id: 4, name: 'Total Revenue', stat: '$12,000', icon: DollarSign },
];

export function KeyMetrics() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.id} className="p-4 bg-white rounded-lg shadow-md flex items-center">
          <div className={`p-3 rounded-full bg-blue-100 text-blue-600`}>
            <stat.icon className="w-6 h-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">{stat.name}</p>
            <p className="text-xl font-bold text-gray-900">{stat.stat}</p>
          </div>
        </div>
      ))}
    </div>
  );
}