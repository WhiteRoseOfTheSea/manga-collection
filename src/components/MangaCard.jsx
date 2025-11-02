import React, { useState } from 'react';
import { MoreVertical } from 'lucide-react';

export default function MangaCard({ manga, isAdmin, onUpdateStatus, onDelete, onEdit, onClick }) {
  const [showActions, setShowActions] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const statusColors = {
    posseduto: 'bg-green-500',
    letto: 'bg-blue-500',
    wishlist: 'bg-purple-500'
  };
  
  const statusLabels = {
    posseduto: 'Posseduto',
    letto: 'Letto',
    wishlist: 'Vorrei'
  };

  const getCoverUrl = () => {
    if (imageError) {
      return 'https://via.placeholder.com/300x450/4B5563/FFFFFF?text=No+Cover';
    }
    
    if (manga.cover && manga.cover !== '') {
      return manga.cover;
    }
    
    if (manga.isbn) {
      return `https://covers.openlibrary.org/b/isbn/${manga.isbn}-L.jpg`;
    }
    
    if (manga.isbn13) {
      return `https://covers.openlibrary.org/b/isbn/${manga.isbn13}-L.jpg`;
    }
    
    if (manga.isbn10) {
      return `https://covers.openlibrary.org/b/isbn/${manga.isbn10}-L.jpg`;
    }
    
    return 'https://via.placeholder.com/300x450/4B5563/FFFFFF?text=No+Cover';
  };

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-sm overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:scale-[1.02] cursor-pointer group border border-gray-200/50 dark:border-gray-800/50 flex flex-col h-full">
      <div 
        className="relative flex-shrink-0"
        onClick={onClick}
      >
        <img 
          src={getCoverUrl()} 
          alt={manga.title}
          className="w-full h-48 sm:h-56 lg:h-64 object-cover bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700"
          onError={(e) => {
            if (!imageError) {
              setImageError(true);
            }
          }}
          loading="lazy"
        />
        <div className={`absolute top-2 right-2 ${statusColors[manga.status]} text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-lg backdrop-blur-sm bg-opacity-90`}>
          {statusLabels[manga.status]}
        </div>
        
        {/* Overlay al hover - solo quando hover attivo */}
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none"></div>
        
        {/* Testo overlay al hover */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <span className="text-white font-semibold text-center mb-2 drop-shadow-lg">
            Vedi dettagli
          </span>
          {manga.description && (
            <p className="text-white text-xs text-center line-clamp-3 drop-shadow-lg">
              {manga.description.substring(0, 120)}...
            </p>
          )}
        </div>
      </div>
      
      <div className="p-2 sm:p-3 flex flex-col flex-grow">
        <div className="flex-grow">
          <h3 className="font-bold text-xs sm:text-sm lg:text-base mb-0.5 sm:mb-1 line-clamp-2 text-gray-900 dark:text-white">
            {manga.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-[10px] sm:text-xs mb-1 line-clamp-1">
            {manga.authors}
          </p>
          
          {/* Info aggiuntive */}
          <div className="flex items-center gap-1 sm:gap-2 text-[9px] sm:text-xs text-gray-500 dark:text-gray-500">
            {manga.year && <span>{manga.year}</span>}
            {manga.year && manga.pages && <span>•</span>}
            {manga.pages && <span>{manga.pages} pag.</span>}
          </div>
        </div>
        
        {isAdmin && (
          <div className="mt-2 sm:mt-3 relative flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowActions(!showActions);
              }}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-colors flex items-center justify-center gap-1 sm:gap-2"
            >
              <MoreVertical size={14} />
              <span className="hidden sm:inline">Gestisci</span>
              <span className="sm:hidden">•••</span>
            </button>
            
            {showActions && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowActions(false);
                  }}
                />
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-700 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 overflow-hidden z-20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(manga);
                      setShowActions(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 transition-colors text-sm font-medium"
                  >
                    ✏️ Modifica
                  </button>
                  <div className="border-t border-gray-200 dark:border-gray-600"></div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateStatus(manga.id, 'posseduto');
                      setShowActions(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-green-50 dark:hover:bg-green-900 text-green-600 dark:text-green-400 transition-colors text-sm"
                  >
                    ✓ Posseduto
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateStatus(manga.id, 'letto');
                      setShowActions(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 transition-colors text-sm"
                  >
                    � Letto
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateStatus(manga.id, 'wishlist');
                      setShowActions(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-purple-50 dark:hover:bg-purple-900 text-purple-600 dark:text-purple-400 transition-colors text-sm"
                  >
                    💜 Vorrei
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Sei sicuro di voler eliminare questo manga?')) {
                        onDelete(manga.id);
                      }
                      setShowActions(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900 text-red-600 dark:text-red-400 transition-colors border-t border-gray-200 dark:border-gray-600 text-sm"
                  >
                    🗑 Elimina
                  </button>
                </div>
              </>
            )}
          </div>
        )}
        </div>
    </div>
  );
}
