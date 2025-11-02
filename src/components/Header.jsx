import React from 'react';
import { Plus, LogOut, Moon, Sun, User, BookMarked } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import logo from '../assets/logo.png';

export default function Header({ 
  user, 
  isAdmin, 
  onLoginClick, 
  onLogoutClick, 
  onAddClick 
}) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-40 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex justify-between items-center gap-4">
          {/* Logo e Nome */}
          <div className="flex items-center gap-3">
            <img 
              src={logo} 
              alt="Logo" 
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-blue-500/30 shadow-lg"
            />
            <div className="flex flex-col">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                whiteroseofthesea
              </h1>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 -mt-0.5">
                <BookMarked size={11} />
                <span className="hidden sm:inline">Collezione Manga</span>
                <span className="sm:hidden">Manga</span>
              </p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-2 items-center">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-all"
              aria-label="Cambia tema"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user && isAdmin ? (
              <>
                <button
                  onClick={onAddClick}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 sm:px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-500/30"
                >
                  <Plus size={18} />
                  <span className="hidden sm:inline text-sm font-medium">Aggiungi</span>
                </button>
                <button
                  onClick={onLogoutClick}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-all"
                  aria-label="Logout"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <button
                onClick={onLoginClick}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 sm:px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-500/30"
              >
                <User size={18} />
                <span className="hidden sm:inline text-sm font-medium">Admin</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
