import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ searchTerm, onSearchChange, filterStatus, onFilterChange, stats }) {
  const totalCount = (stats?.posseduto || 0) + (stats?.wishlist || 0);
  
  const filters = [
    { value: 'all', label: 'Tutti', count: totalCount },
    { value: 'posseduto', label: 'Posseduti', count: stats?.posseduto || 0 },
    { value: 'letto', label: 'Letti', count: stats?.letto || 0 },
    { value: 'wishlist', label: 'Vorrei', count: stats?.wishlist || 0 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex flex-col gap-4">
        {/* Search input */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cerca titolo, autore o ISBN..."
            className="w-full pl-11 pr-4 py-3.5 border border-gray-200 dark:border-gray-800 rounded-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm"
          />
        </div>
        
        {/* Filter buttons con conteggi */}
        <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {filters.map(filter => (
            <button
              key={filter.value}
              onClick={() => onFilterChange(filter.value)}
              className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg whitespace-nowrap transition-all flex-shrink-0 text-xs sm:text-sm font-medium ${
                filterStatus === filter.value
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                  : 'bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-900 border border-gray-200 dark:border-gray-800'
              }`}
            >
              {filter.label}
              <span className={`ml-1 sm:ml-1.5 px-1.5 sm:px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold ${
                filterStatus === filter.value
                  ? 'bg-white/20'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}>
                {filter.count}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
