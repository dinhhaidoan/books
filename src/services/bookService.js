const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

/**
 * Search for books using Google Books API
 * @param {string} query - Search term (title, author, or keywords)
 * @param {number} maxResults - Maximum number of results to return
 * @param {number} startIndex - Starting index for pagination
 * @returns {Promise<Object>} API response with books data
 */
export const searchBooks = async (query, maxResults = 20, startIndex = 0) => {
  if (!query || query.trim() === '') {
    throw new Error('Cần nhập từ khóa tìm kiếm');
  }

  try {
    const url = new URL(BASE_URL);
    url.searchParams.append('q', query.trim());
    url.searchParams.append('maxResults', maxResults.toString());
    url.searchParams.append('startIndex', startIndex.toString());
    url.searchParams.append('printType', 'books');
    url.searchParams.append('projection', 'lite');

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      items: data.items || [],
      totalItems: data.totalItems || 0,
      query,
      maxResults,
      startIndex
    };
  } catch (error) {
    console.error('Error searching books:', error);
    throw new Error('Không thể tìm kiếm sách. Vui lòng thử lại sau.');
  }
};

/**
 * Get detailed information about a specific book
 * @param {string} bookId - Google Books ID
 * @returns {Promise<Object>} Book details
 */
export const getBookById = async (bookId) => {
  if (!bookId) {
    throw new Error('Book ID is required');
  }

  try {
    const url = `${BASE_URL}/${bookId}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Không tìm thấy sách');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching book details:', error);
    throw new Error('Không thể tải thông tin sách. Vui lòng thử lại sau.');
  }
};

/**
 * Format book data for consistent use in components
 * @param {Object} bookItem - Raw book item from Google Books API
 * @returns {Object} Formatted book object
 */
export const formatBookData = (bookItem) => {
  const volumeInfo = bookItem.volumeInfo || {};
  const saleInfo = bookItem.saleInfo || {};
  const imageLinks = volumeInfo.imageLinks || {};

  return {
    id: bookItem.id,
    title: volumeInfo.title || 'Không có tiêu đề',
    authors: volumeInfo.authors || ['Không rõ tác giả'],
    publisher: volumeInfo.publisher || 'Không rõ nhà xuất bản',
    publishedDate: volumeInfo.publishedDate || 'Không rõ năm xuất bản',
    description: volumeInfo.description || 'Không có mô tả',
    pageCount: volumeInfo.pageCount || 0,
    categories: volumeInfo.categories || [],
    averageRating: volumeInfo.averageRating || 0,
    ratingsCount: volumeInfo.ratingsCount || 0,
    language: volumeInfo.language || 'Không rõ',
    thumbnail: imageLinks.thumbnail || imageLinks.smallThumbnail || '/placeholder-book.png',
    previewLink: volumeInfo.previewLink,
    infoLink: volumeInfo.infoLink,
    canonicalVolumeLink: volumeInfo.canonicalVolumeLink,
    isEbook: saleInfo.isEbook || false,
    saleability: saleInfo.saleability || 'NOT_FOR_SALE',
    listPrice: saleInfo.listPrice || null,
    retailPrice: saleInfo.retailPrice || null,
    buyLink: saleInfo.buyLink || null,
    // Format for display
    authorsText: (volumeInfo.authors || ['Không rõ tác giả']).join(', '),
    publishYear: volumeInfo.publishedDate ? new Date(volumeInfo.publishedDate).getFullYear() : null,
    rating: volumeInfo.averageRating ? Math.round(volumeInfo.averageRating * 10) / 10 : 0,
    hasPreview: Boolean(volumeInfo.previewLink),
    shortDescription: volumeInfo.description 
      ? volumeInfo.description.length > 200 
        ? volumeInfo.description.substring(0, 200) + '...'
        : volumeInfo.description
      : 'Không có mô tả'
  };
};

/**
 * Get books by specific author
 * @param {string} author - Author name
 * @param {number} maxResults - Maximum results
 * @returns {Promise<Object>} Search results
 */
export const getBooksByAuthor = async (author, maxResults = 20) => {
  return searchBooks(`inauthor:"${author}"`, maxResults);
};

/**
 * Get books by category/subject
 * @param {string} category - Category name
 * @param {number} maxResults - Maximum results
 * @returns {Promise<Object>} Search results
 */
export const getBooksByCategory = async (category, maxResults = 20) => {
  return searchBooks(`subject:"${category}"`, maxResults);
};

/**
 * Get popular/trending books (using a general search)
 * This is a workaround since Google Books API doesn't have a "trending" endpoint
 * @param {number} maxResults - Maximum results
 * @returns {Promise<Object>} Search results
 */
export const getPopularBooks = async (maxResults = 20) => {
  const popularSearchTerms = [
    'bestseller',
    'popular fiction',
    'award winning books',
    'new york times bestseller'
  ];
  
  const randomTerm = popularSearchTerms[Math.floor(Math.random() * popularSearchTerms.length)];
  return searchBooks(randomTerm, maxResults);
};

/**
 * Helper function to create placeholder image URL for books without covers
 * @param {string} title - Book title
 * @param {string} author - Book author
 * @returns {string} Placeholder image URL
 */
export const createPlaceholderImage = (title, author) => {
  // You can implement a service like placeholder.com or create a custom placeholder
  const encodedTitle = encodeURIComponent(title.substring(0, 20));
  const encodedAuthor = encodeURIComponent(author.substring(0, 15));
  return `https://via.placeholder.com/200x300/0d6efd/ffffff?text=${encodedTitle}+by+${encodedAuthor}`;
};

/**
 * Validate and sanitize search query
 * @param {string} query - Raw search query
 * @returns {string} Sanitized query
 */
export const sanitizeSearchQuery = (query) => {
  if (!query || typeof query !== 'string') {
    return '';
  }
  
  // Remove special characters that might break the API call
  return query
    .trim()
    .replace(/[<>]/g, '') // Remove potential XSS characters
    .substring(0, 100); // Limit length
};

/**
 * Check if the API is available (simple connectivity test)
 * @returns {Promise<boolean>} API availability status
 */
export const checkApiAvailability = async () => {
  try {
    const response = await fetch(`${BASE_URL}?q=test&maxResults=1`);
    return response.ok;
  } catch (error) {
    console.error('API availability check failed:', error);
    return false;
  }
};