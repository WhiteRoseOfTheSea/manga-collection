import React from 'react';
import { Book, Eye, Heart } from 'lucide-react';

export default function Stats({ stats }) {
  const statItems = [
    { 
      label: 'Posseduti', 
      value: stats.posseduto, 
      icon: Book,
      gradient: 'from-emerald-500 to-teal-600',
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/20'
    },
    { 
      label: 'Letti', 
      value: stats.letto, 
      icon: Eye,
      gradient: 'from-blue-500 to-indigo-600',
      bg: 'bg-blue-500/10 dark:bg-blue-500/20'
    },
    { 
      label: 'Vorrei', 
      value: stats.wishlist, 
      icon: Heart,
      gradient: 'from-rose-500 to-pink-600',
      bg: 'bg-rose-500/10 dark:bg-rose-500/20'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="grid grid-cols-3 gap-3 sm:gap-6">
        {statItems.map((item, index) => (
          <div 
            key={index}
            className={`${item.bg} backdrop-blur-sm rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:scale-105 border border-gray-200/50 dark:border-gray-800/50 shadow-sm hover:shadow-md`}
          >
            <div className="flex flex-col items-center text-center gap-2 sm:gap-3">
              <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-br ${item.gradient} shadow-lg`}>
                <item.icon className="text-white" size={20} strokeWidth={2.5} />
              </div>
              <div>
                <p className={`text-2xl sm:text-4xl font-bold bg-gradient-to-br ${item.gradient} text-transparent bg-clip-text`}>
                  {item.value}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium mt-1">
                  {item.label}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
