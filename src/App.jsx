import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot,
  getDoc 
} from 'firebase/firestore';

import Header from './components/Header';
import SearchBar from './components/SearchBar';
import MangaCard from './components/MangaCard';
import LoginModal from './components/LoginModal';
import SearchModal from './components/SearchModal';
import BookDetailModal from './components/BookDetailModal';
import EditMangaModal from './components/EditMangaModal';

import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [manga, setManga] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showLogin, setShowLogin] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showBookDetail, setShowBookDetail] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingManga, setEditingManga] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          setIsAdmin(userDoc.exists() && userDoc.data().isAdmin === true);
        } catch (error) {
          console.error('Errore controllo admin:', error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'manga'), (snapshot) => {
      const mangaList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setManga(mangaList);
    });

    return unsubscribe;
  }, []);

  const handleLogin = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleAddManga = async (newManga) => {
    try {
      await addDoc(collection(db, 'manga'), {
        ...newManga,
        addedAt: new Date().toISOString(),
        addedBy: user.uid
      });
    } catch (error) {
      console.error('Errore aggiunta manga:', error);
      alert('Errore durante l\'aggiunta del manga');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, 'manga', id), { status });
    } catch (error) {
      console.error('Errore aggiornamento status:', error);
      alert('Errore durante l\'aggiornamento');
    }
  };

  const handleDeleteManga = async (id) => {
    try {
      await deleteDoc(doc(db, 'manga', id));
    } catch (error) {
      console.error('Errore eliminazione manga:', error);
      alert('Errore durante l\'eliminazione');
    }
  };

  const handleEditManga = async (id, updatedData) => {
    try {
      await updateDoc(doc(db, 'manga', id), updatedData);
    } catch (error) {
      console.error('Errore modifica manga:', error);
      alert('Errore durante la modifica');
    }
  };

  const handleCardClick = (mangaItem) => {
    setSelectedBook(mangaItem);
    setShowBookDetail(true);
  };

  const handleEditClick = (mangaItem) => {
    setEditingManga(mangaItem);
    setShowEditModal(true);
  };

  const filteredManga = manga.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         m.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         m.isbn?.includes(searchTerm);
    
    let matchesFilter = false;
    if (filterStatus === 'all') {
      matchesFilter = true;
    } else if (filterStatus === 'posseduto') {
      matchesFilter = m.status === 'posseduto' || m.status === 'letto';
    } else {
      matchesFilter = m.status === filterStatus;
    }
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    posseduto: manga.filter(m => m.status === 'posseduto' || m.status === 'letto').length,
    letto: manga.filter(m => m.status === 'letto').length,
    wishlist: manga.filter(m => m.status === 'wishlist').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Caricamento...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Header
          user={user}
          isAdmin={isAdmin}
          onLoginClick={() => setShowLogin(true)}
          onLogoutClick={handleLogout}
          onAddClick={() => setShowSearch(true)}
        />

        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
          stats={stats}
        />

        <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
          {filteredManga.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                {manga.length === 0
                  ? 'Nessun manga nella collezione. Inizia ad aggiungerne!'
                  : 'Nessun manga trovato con questi filtri.'}
              </p>
              {user && isAdmin && manga.length === 0 && (
                <button
                  onClick={() => setShowSearch(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors shadow-md"
                >
                  Aggiungi il primo manga
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4 lg:gap-6">
              {filteredManga.map(m => (
                <MangaCard
                  key={m.id}
                  manga={m}
                  isAdmin={isAdmin}
                  onUpdateStatus={handleUpdateStatus}
                  onDelete={handleDeleteManga}
                  onEdit={handleEditClick}
                  onClick={() => handleCardClick(m)}
                />
              ))}
            </div>
          )}
        </main>

        <LoginModal
          isOpen={showLogin}
          onClose={() => setShowLogin(false)}
          onLogin={handleLogin}
        />

        {isAdmin && (
          <SearchModal
            isOpen={showSearch}
            onClose={() => setShowSearch(false)}
            onAdd={handleAddManga}
          />
        )}

        <BookDetailModal
          book={selectedBook}
          isOpen={showBookDetail}
          onClose={() => {
            setShowBookDetail(false);
            setSelectedBook(null);
          }}
          isAdmin={isAdmin}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDeleteManga}
          onEdit={handleEditClick}
        />

        {isAdmin && (
          <EditMangaModal
            manga={editingManga}
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setEditingManga(null);
            }}
            onSave={handleEditManga}
          />
        )}
      </div>
    </ThemeProvider>
  );
}