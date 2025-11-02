import React, { useState } from 'react';
import { X, BookOpen, Calendar, User, Building2, Hash, FileText, Tag, ExternalLink, Star, Globe, Package, Award, Book } from 'lucide-react';

export default function BookDetailModal({ book, isOpen, onClose, isAdmin, onUpdateStatus, onDelete, onEdit }) {
  const [imageError, setImageError] = useState(false);
  
  if (!isOpen || !book) return null;

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
    
    if (book.cover && book.cover !== '') {
      return book.cover;
    }
    
    if (book.isbn) {
      return `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`;
    }
    
    if (book.isbn13) {
      return `https://covers.openlibrary.org/b/isbn/${book.isbn13}-L.jpg`;
    }
    
    if (book.isbn10) {
      return `https://covers.openlibrary.org/b/isbn/${book.isbn10}-L.jpg`;
    }
    
    return 'https://via.placeholder.com/300x450/4B5563/FFFFFF?text=No+Cover';
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl max-w-5xl w-full my-8 shadow-2xl animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 flex justify-between items-start gap-4 z-10 rounded-t-xl">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1 leading-tight">
              {book.title}
            </h2>
            {book.subtitle && (
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-2">
                {book.subtitle}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <div className={`inline-flex items-center ${statusColors[book.status]} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                {statusLabels[book.status]}
              </div>
              {book.rating && (
                <div className="inline-flex items-center bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold gap-1">
                  <Star size={14} fill="white" />
                  {typeof book.rating === 'number' ? book.rating.toFixed(1) : book.rating}
                  {book.ratingCount > 0 && (
                    <span className="text-xs opacity-90">({book.ratingCount})</span>
                  )}
                </div>
              )}
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors flex-shrink-0"
            aria-label="Chiudi"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-10rem)] p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cover Image */}
            <div className="md:col-span-1">
              <div className="sticky top-0">
                <img 
                  src={getCoverUrl()} 
                  alt={book.title}
                  className="w-full rounded-lg shadow-lg bg-gray-200 dark:bg-gray-700"
                  onError={(e) => {
                    if (!imageError) {
                      setImageError(true);
                    }
                  }}
                />
                
                {/* Action buttons per admin */}
                {isAdmin && (
                  <div className="mt-4 space-y-2">
                    <button
                      onClick={() => {
                        onEdit(book);
                        onClose();
                      }}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-md"
                    >
                      ✏️ Modifica Tutto
                    </button>
                    
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 mt-4">
                      Cambia stato:
                    </div>
                    <button
                      onClick={() => {
                        onUpdateStatus(book.id, 'posseduto');
                        onClose();
                      }}
                      className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Posseduto
                    </button>
                    <button
                      onClick={() => {
                        onUpdateStatus(book.id, 'letto');
                        onClose();
                      }}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Letto
                    </button>
                    <button
                      onClick={() => {
                        onUpdateStatus(book.id, 'wishlist');
                        onClose();
                      }}
                      className="w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Vorrei
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Sei sicuro di voler eliminare questo manga?')) {
                          onDelete(book.id);
                          onClose();
                        }
                      }}
                      className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Elimina
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="md:col-span-2 space-y-6">
              {/* Info principali */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-3">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Book size={20} className="text-blue-500" />
                  Informazioni Libro
                </h3>
                
                <DetailItem icon={User} label="Autore" value={book.authors} />
                
                {book.publisher && (
                  <DetailItem icon={Building2} label="Editore" value={book.publisher} />
                )}
                
                {(book.publishDate || book.year) && (
                  <DetailItem 
                    icon={Calendar} 
                    label="Pubblicazione" 
                    value={book.publishDate || book.year} 
                  />
                )}
                
                {book.pages && (
                  <DetailItem icon={BookOpen} label="Pagine" value={book.pages} />
                )}
                
                {book.languages && (
                  <DetailItem icon={Globe} label="Lingua" value={book.languages.toUpperCase()} />
                )}
                
                {book.weight && (
                  <DetailItem icon={Package} label="Peso" value={book.weight} />
                )}
                
                {book.editionCount > 0 && (
                  <DetailItem icon={Award} label="Edizioni" value={book.editionCount} />
                )}
              </div>

              {/* ISBN e Identificatori */}
              {(book.isbn || book.isbn13 || book.isbn10 || book.olid) && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-2">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Hash size={20} className="text-blue-500" />
                    Identificatori
                  </h3>
                  
                  {book.isbn && (
                    <div className="flex items-start gap-3">
                      <span className="text-gray-500 dark:text-gray-400 text-sm min-w-[80px]">ISBN:</span>
                      <p className="text-gray-900 dark:text-white font-mono text-sm">{book.isbn}</p>
                    </div>
                  )}
                  
                  {book.isbn13 && book.isbn13 !== book.isbn && (
                    <div className="flex items-start gap-3">
                      <span className="text-gray-500 dark:text-gray-400 text-sm min-w-[80px]">ISBN-13:</span>
                      <p className="text-gray-900 dark:text-white font-mono text-sm">{book.isbn13}</p>
                    </div>
                  )}
                  
                  {book.isbn10 && book.isbn10 !== book.isbn && (
                    <div className="flex items-start gap-3">
                      <span className="text-gray-500 dark:text-gray-400 text-sm min-w-[80px]">ISBN-10:</span>
                      <p className="text-gray-900 dark:text-white font-mono text-sm">{book.isbn10}</p>
                    </div>
                  )}
                  
                  {book.olid && (
                    <div className="flex items-start gap-3">
                      <span className="text-gray-500 dark:text-gray-400 text-sm min-w-[80px]">OpenLibrary:</span>
                      <p className="text-gray-900 dark:text-white font-mono text-sm">{book.olid}</p>
                    </div>
                  )}
                  
                  {book.goodreads && (
                    <div className="flex items-start gap-3">
                      <span className="text-gray-500 dark:text-gray-400 text-sm min-w-[80px]">Goodreads:</span>
                      <p className="text-gray-900 dark:text-white font-mono text-sm">{book.goodreads}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Prima Frase */}
              {book.firstSentence && (
                <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg">
                  <p className="text-gray-700 dark:text-gray-300 italic text-sm sm:text-base">
                    "{book.firstSentence}"
                  </p>
                </div>
              )}

              {/* Descrizione */}
              {book.description && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <FileText size={20} className="text-blue-500" />
                    <h3 className="font-semibold text-lg">Descrizione</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm sm:text-base whitespace-pre-wrap">
                    {book.description}
                  </p>
                </div>
              )}

              {/* Soggetti/Generi */}
              {book.subjects && book.subjects.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Tag size={20} className="text-blue-500" />
                    <h3 className="font-semibold text-lg">Generi e Tag</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {book.subjects.map((subject, index) => (
                      <span 
                        key={index}
                        className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border border-blue-200 dark:border-blue-800"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Links esterni */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                {book.workUrl && (
                  <a
                    href={book.workUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium shadow-sm"
                  >
                    <ExternalLink size={16} />
                    OpenLibrary
                  </a>
                )}
                
                {book.goodreads && (
                  <a
                    href={`https://www.goodreads.com/book/show/${book.goodreads}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors text-sm font-medium shadow-sm"
                  >
                    <ExternalLink size={16} />
                    Goodreads
                  </a>
                )}
                
                {book.isbn && (
                  <a
                    href={`https://www.google.com/search?q=isbn+${book.isbn}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-lg transition-colors text-sm font-medium shadow-sm"
                  >
                    <ExternalLink size={16} />
                    Cerca ISBN
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <span className="text-gray-500 dark:text-gray-400 text-sm">{label}:</span>
        <p className="text-gray-900 dark:text-white font-medium">{value}</p>
      </div>
    </div>
  );
}
