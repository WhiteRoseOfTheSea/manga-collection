import React, { useState } from 'react';
import { X, Search, Loader2 } from 'lucide-react';
import { searchOpenLibrary } from '../utils/openLibraryApi';

export default function SearchModal({ isOpen, onClose, onAdd }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('wishlist');

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const books = await searchOpenLibrary(query);
      setResults(books);
    } catch (error) {
      console.error('Errore ricerca:', error);
      alert('Errore durante la ricerca');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (book) => {
    onAdd({ ...book, status: selectedStatus });
    setQuery('');
    setResults([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Cerca Manga
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              aria-label="Chiudi"
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Search form */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cerca per titolo o ISBN..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition-colors font-medium flex items-center gap-2 shadow-md"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span className="hidden sm:inline">Ricerca...</span>
                </>
              ) : (
                <>
                  <Search size={20} />
                  <span className="hidden sm:inline">Cerca</span>
                </>
              )}
            </button>
          </form>

          {/* Status selector */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Aggiungi come:</span>
            {[
              { value: 'posseduto', label: 'Posseduto', color: 'green' },
              { value: 'letto', label: 'Letto', color: 'blue' },
              { value: 'wishlist', label: 'Vorrei', color: 'purple' }
            ].map(status => (
              <button
                key={status.value}
                type="button"
                onClick={() => setSelectedStatus(status.value)}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  selectedStatus === status.value
                    ? `bg-${status.color}-500 text-white shadow-md scale-105`
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="animate-spin text-blue-500 mb-4" size={48} />
              <p className="text-gray-600 dark:text-gray-400">Ricerca in corso...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-16">
              <Search className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                {query ? 'Nessun risultato trovato' : 'Cerca un manga per titolo o ISBN'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((book, index) => (
                <div 
                  key={index}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-all bg-white dark:bg-gray-700"
                >
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                    onError={(e) => e.target.src = 'https://via.placeholder.com/300x400?text=No+Cover'}
                  />
                  <h3 className="font-bold mb-1 line-clamp-2 text-gray-900 dark:text-white">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 line-clamp-1">
                    {book.authors}
                  </p>
                  {book.year && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                      Anno: {book.year}
                    </p>
                  )}
                  {book.isbn && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-3 truncate">
                      ISBN: {book.isbn}
                    </p>
                  )}
                  <button
                    onClick={() => handleAdd(book)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-md"
                  >
                    Aggiungi
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
