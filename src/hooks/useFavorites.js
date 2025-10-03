import { useState, useEffect, useCallback } from 'react';

const FAVORITES_STORAGE_KEY = 'bookfinder_favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (storedFavorites) {
        const parsedFavorites = JSON.parse(storedFavorites);
        setFavorites(Array.isArray(parsedFavorites) ? parsedFavorites : []);
      }
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveFavoritesToStorage = useCallback((favoritesArray) => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoritesArray));
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
    }
  }, []);

  const isFavorite = useCallback((bookId) => {
    return favorites.some(book => book.id === bookId);
  }, [favorites]);

  const addToFavorites = useCallback((book) => {
    if (!book || !book.id) {
      console.warn('Invalid book data provided to addToFavorites');
      return;
    }

    setFavorites(prevFavorites => {
      if (prevFavorites.some(fav => fav.id === book.id)) {
        return prevFavorites;
      }

      const newFavorites = [
        ...prevFavorites,
        {
          ...book,
          addedAt: new Date().toISOString()
        }
      ];

      saveFavoritesToStorage(newFavorites);
      return newFavorites;
    });
  }, [saveFavoritesToStorage]);

  const removeFromFavorites = useCallback((bookId) => {
    if (!bookId) {
      console.warn('No book ID provided to removeFromFavorites');
      return;
    }

    setFavorites(prevFavorites => {
      const newFavorites = prevFavorites.filter(book => book.id !== bookId);
      saveFavoritesToStorage(newFavorites);
      return newFavorites;
    });
  }, [saveFavoritesToStorage]);

  const toggleFavorite = useCallback((book) => {
    if (!book || !book.id) {
      console.warn('Invalid book data provided to toggleFavorite');
      return;
    }

    if (isFavorite(book.id)) {
      removeFromFavorites(book.id);
    } else {
      addToFavorites(book);
    }
  }, [isFavorite, addToFavorites, removeFromFavorites]);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    saveFavoritesToStorage([]);
  }, [saveFavoritesToStorage]);

  const getFavoriteById = useCallback((bookId) => {
    return favorites.find(book => book.id === bookId) || null;
  }, [favorites]);

  const getSortedFavorites = useCallback((sortBy = 'addedAt', order = 'desc') => {
    const sortedFavorites = [...favorites];

    sortedFavorites.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'author':
          aValue = a.authorsText.toLowerCase();
          bValue = b.authorsText.toLowerCase();
          break;
        case 'rating':
          aValue = a.rating || 0;
          bValue = b.rating || 0;
          break;
        case 'publishYear':
          aValue = a.publishYear || 0;
          bValue = b.publishYear || 0;
          break;
        case 'addedAt':
        default:
          aValue = new Date(a.addedAt || 0);
          bValue = new Date(b.addedAt || 0);
          break;
      }

      if (order === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    return sortedFavorites;
  }, [favorites]);

  const searchFavorites = useCallback((query) => {
    if (!query || query.trim() === '') {
      return favorites;
    }

    const searchTerm = query.toLowerCase().trim();
    return favorites.filter(book => 
      book.title.toLowerCase().includes(searchTerm) ||
      book.authorsText.toLowerCase().includes(searchTerm) ||
      (book.categories && book.categories.some(cat => 
        cat.toLowerCase().includes(searchTerm)
      ))
    );
  }, [favorites]);

  const exportFavorites = useCallback(() => {
    const exportData = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      favorites: favorites
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `bookfinder-favorites-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [favorites]);

  const importFavorites = useCallback((jsonData, merge = false) => {
    try {
      const importData = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      
      if (!importData.favorites || !Array.isArray(importData.favorites)) {
        throw new Error('Invalid favorites data format');
      }

      const importedFavorites = importData.favorites.map(book => ({
        ...book,
        importedAt: new Date().toISOString()
      }));

      setFavorites(prevFavorites => {
        let newFavorites;
        
        if (merge) {
          const existingIds = new Set(prevFavorites.map(book => book.id));
          const uniqueImported = importedFavorites.filter(book => !existingIds.has(book.id));
          newFavorites = [...prevFavorites, ...uniqueImported];
        } else {
          newFavorites = importedFavorites;
        }

        saveFavoritesToStorage(newFavorites);
        return newFavorites;
      });

      return true;
    } catch (error) {
      console.error('Error importing favorites:', error);
      return false;
    }
  }, [saveFavoritesToStorage]);

  return {
    favorites,
    loading,
    favoritesCount: favorites.length,
    
    isFavorite,
    getFavoriteById,
    
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    clearFavorites,
    
    getSortedFavorites,
    searchFavorites,
    
    exportFavorites,
    importFavorites
  };
};