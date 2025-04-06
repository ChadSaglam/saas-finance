import { Bell, Search } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-30 w-full bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button className="md:hidden p-2 text-gray-700 hover:text-blue-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search..." 
              className="h-10 w-full pl-10 pr-4 rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-700 hover:text-blue-600">
            <Bell className="w-6 h-6" />
            <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full"></span>
          </button>
          <div className="flex items-center gap-2">
            <img 
              src="https://randomuser.me/api/portraits/men/32.jpg" 
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-700">ChadSaglam</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}