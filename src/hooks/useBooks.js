import { useState, useEffect, useCallback } from 'react';
import { searchBooks, getBookById, formatBookData } from '../services/bookService';

export const useBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const ITEMS_PER_PAGE = 20;

  const searchForBooks = useCallback(async (query, page = 1, append = false) => {
    if (!query || query.trim() === '') {
      setBooks([]);
      setError(null);
      setTotalItems(0);
      setHasMore(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const startIndex = (page - 1) * ITEMS_PER_PAGE;
      const response = await searchBooks(query, ITEMS_PER_PAGE, startIndex);
      
      const formattedBooks = response.items.map(formatBookData);
      
      if (append && page > 1) {
        setBooks(prevBooks => [...prevBooks, ...formattedBooks]);
      } else {
        setBooks(formattedBooks);
        setSearchQuery(query);
        setCurrentPage(1);
      }
      
      setTotalItems(response.totalItems);
      setHasMore(response.totalItems > startIndex + formattedBooks.length);
      
      if (page > 1) {
        setCurrentPage(page);
      }
      
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi tìm kiếm sách');
      if (!append) {
        setBooks([]);
        setTotalItems(0);
        setHasMore(false);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMoreBooks = useCallback(() => {
    if (loading || !hasMore || !searchQuery) return;
    
    const nextPage = currentPage + 1;
    searchForBooks(searchQuery, nextPage, true);
  }, [loading, hasMore, searchQuery, currentPage, searchForBooks]);

  const getBook = useCallback(async (bookId) => {
    try {
      setLoading(true);
      setError(null);
      
      const bookData = await getBookById(bookId);
      const formattedBook = formatBookData(bookData);
      
      return formattedBook;
    } catch (err) {
      setError(err.message || 'Không thể tải thông tin sách');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setBooks([]);
    setSearchQuery('');
    setError(null);
    setTotalItems(0);
    setCurrentPage(1);
    setHasMore(false);
  }, []);

  const retrySearch = useCallback(() => {
    if (searchQuery) {
      searchForBooks(searchQuery);
    }
  }, [searchQuery, searchForBooks]);

  return {
    books,
    loading,
    error,
    searchQuery,
    totalItems,
    currentPage,
    hasMore,
    
    searchForBooks,
    loadMoreBooks,
    getBook,
    clearSearch,
    retrySearch
  };
};

export const useBook = (bookId) => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBook = useCallback(async () => {
    if (!bookId) return;

    try {
      setLoading(true);
      setError(null);
      
      const bookData = await getBookById(bookId);
      const formattedBook = formatBookData(bookData);
      
      setBook(formattedBook);
    } catch (err) {
      setError(err.message || 'Không thể tải thông tin sách');
      setBook(null);
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    fetchBook();
  }, [fetchBook]);

  const refetch = useCallback(() => {
    fetchBook();
  }, [fetchBook]);

  return {
    book,
    loading,
    error,
    refetch
  };
};