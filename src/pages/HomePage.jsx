import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import BookCard from '../components/BookCard';
import Loader, { LoadingGrid } from '../components/Loader';
import Button from '../components/Button';
import { useBooks } from '../hooks/useBooks';
import { useFavorites } from '../hooks/useFavorites';
import { Search, Grid, List, Filter } from 'lucide-react';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { 
    books, 
    loading, 
    error, 
    searchQuery, 
    totalItems, 
    hasMore,
    searchForBooks, 
    loadMoreBooks, 
    clearSearch 
  } = useBooks();
  
  const { 
    toggleFavorite, 
    isFavorite 
  } = useFavorites();

  const [viewMode, setViewMode] = useState('grid');
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    if (searchQuery || books.length > 0) {
      setShowWelcome(false);
    }
  }, [searchQuery, books.length]);

  const handleSearch = (query) => {
    searchForBooks(query);
  };

  const handleViewDetails = (book) => {
    navigate(`/book/${book.id}`);
  };

  const handleToggleFavorite = (book) => {
    toggleFavorite(book);
  };

  const handleClearSearch = () => {
    clearSearch();
    setShowWelcome(true);
  };

  const renderWelcomeSection = () => (
    <div className="welcome-section">
      <div className="welcome-content">
        <div className="welcome-icon">
          <Search size={48} />
        </div>
        <h1>Khám phá thế giới sách</h1>
        <p>
          Tìm kiếm trong hàng triệu cuốn sách từ Google Books. 
          Khám phá những tác phẩm hay, tìm hiểu về tác giả yêu thích, 
          và lưu lại những cuốn sách bạn muốn đọc.
        </p>
        
        <div className="welcome-features">
          <div className="feature-item">
            <Search size={24} />
            <div>
              <h3>Tìm kiếm mạnh mẽ</h3>
              <p>Tìm theo tên sách, tác giả, hoặc từ khóa</p>
            </div>
          </div>
          
          <div className="feature-item">
            <Grid size={24} />
            <div>
              <h3>Giao diện đẹp</h3>
              <p>Hiển thị sách với hình ảnh và thông tin chi tiết</p>
            </div>
          </div>
          
          <div className="feature-item">
            <Filter size={24} />
            <div>
              <h3>Quản lý yêu thích</h3>
              <p>Lưu và quản lý danh sách sách yêu thích</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSearchSection = () => (
    <div className="search-section">
      <SearchBar 
        onSearch={handleSearch}
        loading={loading}
        initialValue={searchQuery}
      />
    </div>
  );

  const renderResultsHeader = () => {
    if (!searchQuery && books.length === 0) return null;

    return (
      <div className="results-header">
        <div className="results-info">
          {searchQuery && (
            <h2>
              Kết quả tìm kiếm cho: <span className="search-term">"{searchQuery}"</span>
            </h2>
          )}
          
          {totalItems > 0 && (
            <p className="results-count">
              Tìm thấy {totalItems.toLocaleString()} kết quả
            </p>
          )}
        </div>

        <div className="results-actions">
          {(searchQuery || books.length > 0) && (
            <Button
              variant="ghost"
              size="small"
              onClick={handleClearSearch}
              className="clear-search-btn"
            >
              Xóa tìm kiếm
            </Button>
          )}

          <div className="view-controls">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              size="small"
              icon={<Grid size={16} />}
              onClick={() => setViewMode('grid')}
              aria-label="Xem dạng lưới"
            />
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="small"
              icon={<List size={16} />}
              onClick={() => setViewMode('list')}
              aria-label="Xem dạng danh sách"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    if (loading && books.length === 0) {
      return <LoadingGrid count={8} variant={viewMode} />;
    }

    if (error && books.length === 0) {
      return (
        <div className="error-state">
          <div className="error-content">
            <h3>Có lỗi xảy ra</h3>
            <p>{error}</p>
            <Button
              variant="primary"
              onClick={() => searchForBooks(searchQuery)}
            >
              Thử lại
            </Button>
          </div>
        </div>
      );
    }

    if (searchQuery && books.length === 0 && !loading) {
      return (
        <div className="empty-state">
          <div className="empty-content">
            <Search size={48} />
            <h3>Không tìm thấy kết quả</h3>
            <p>
              Không tìm thấy sách nào với từ khóa "{searchQuery}". 
              Hãy thử với từ khóa khác.
            </p>
            <Button
              variant="outline"
              onClick={handleClearSearch}
            >
              Xóa tìm kiếm
            </Button>
          </div>
        </div>
      );
    }

    if (books.length === 0) return null;

    return (
      <div className="results-section">
        <div className={`books-grid books-grid-${viewMode}`}>
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              variant={viewMode}
              onViewDetails={handleViewDetails}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={isFavorite(book.id)}
            />
          ))}
        </div>

        {hasMore && (
          <div className="load-more-section">
            <Button
              variant="outline"
              size="large"
              onClick={loadMoreBooks}
              loading={loading}
              disabled={loading}
              className="load-more-btn"
            >
              {loading ? 'Đang tải...' : 'Tải thêm sách'}
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="home-page">
      {showWelcome && renderWelcomeSection()}
      
      {renderSearchSection()}
      
      {renderResultsHeader()}
      
      {renderResults()}
      
      {loading && books.length > 0 && (
        <div className="loading-more">
          <Loader size="small" message="Đang tải thêm sách..." />
        </div>
      )}
    </div>
  );
};

export default HomePage;