'use client';

import { useState } from 'react';
import { CODE_CATEGORIES } from '@/lib/utils/product-codes';

export default function CodeSearch() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  
  const handleSearch = () => {
    // Validate that the entered code follows the proper format
    const codePattern = /^([A-Z]{3})-(\d{3})$/;
    const match = search.match(codePattern);
    
    if (match) {
      const [, prefix, number] = match;
      const isValidCategory = Object.values(CODE_CATEGORIES).some(cat => cat.prefix === prefix);
      
      if (isValidCategory) {
        // Search logic for valid code
        // ...
      } else {
        alert(`Invalid category prefix: ${prefix}`);
      }
    } else {
      alert('Invalid code format. Use format: XXX-000');
    }
  };
  
  return (
    <div>
      <div className="flex">
        <input 
          value={search} 
          onChange={(e) => setSearch(e.target.value.toUpperCase())}
          placeholder="Enter code (e.g., DEV-101)"
          className="border rounded-l px-3 py-2"
        />
        <button 
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded-r"
        >
          Search
        </button>
      </div>
    </div>
  );
}