import React from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch: (value: string) => void;
}

export function SearchInput({ onSearch, ...props }: SearchInputProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="search"
        className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:ring-amber-500 focus:border-amber-500 border-gray-300"
        placeholder="Search recipes..."
        onChange={(e) => onSearch(e.target.value)}
        {...props}
      />
    </div>
  );
}