import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Grid, List, Search, Download, Trash2, Filter } from 'lucide-react';
import BookCard from '../components/BookCard';
import Button from '../components/Button';
import SearchBar from '../components/SearchBar';
import { useFavorites } from '../hooks/useFavorites';
import './FavoritesPage.css';

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { 
    favorites, 
    loading, 
    toggleFavorite, 
    clearFavorites, 
    exportFavorites,
    getSortedFavorites,
    searchFavorites
  } = useFavorites();

  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('addedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const filteredAndSortedFavorites = useMemo(() => {
    let filtered = searchQuery ? searchFavorites(searchQuery) : favorites;
    return getSortedFavorites(sortBy, sortOrder).filter(book => 
      !searchQuery || filtered.some(f => f.id === book.id)
    );
  }, [favorites, searchQuery, sortBy, sortOrder, searchFavorites, getSortedFavorites]);

  const handleViewDetails = (book) => {
    navigate(`/book/${book.id}`);
  };

  const handleToggleFavorite = (book) => {
    toggleFavorite(book);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleClearFavorites = () => {
    clearFavorites();
    setShowConfirmClear(false);
  };

  const handleExport = () => {
    exportFavorites();
  };

  const sortOptions = [
    { value: 'addedAt', label: 'Ngày thêm' },
    { value: 'title', label: 'Tên sách' },
    { value: 'author', label: 'Tác giả' },
    { value: 'rating', label: 'Đánh giá' },
    { value: 'publishYear', label: 'Năm xuất bản' }
  ];

  if (loading) {
    return (
      <div className="favorites-page">
        <div className="favorites-loading">
          <div className="spinner"></div>
          <p>Đang tải danh sách yêu thích...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <div className="header-content">
          <div className="header-title">
            <Heart size={32} />
            <div>
              <h1>Sách yêu thích</h1>
              <p>
                {favorites.length === 0 
                  ? 'Chưa có sách nào trong danh sách yêu thích'
                  : `${favorites.length} cuốn sách trong danh sách yêu thích`
                }
              </p>
            </div>
          </div>

          {favorites.length > 0 && (
            <div className="header-actions">
              <Button
                variant="outline"
                size="small"
                icon={<Download size={16} />}
                onClick={handleExport}
              >
                Xuất danh sách
              </Button>
              
              <Button
                variant="danger"
                size="small"
                icon={<Trash2 size={16} />}
                onClick={() => setShowConfirmClear(true)}
              >
                Xóa tất cả
              </Button>
            </div>
          )}
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="empty-favorites">
          <div className="empty-content">
            <Heart size={64} />
            <h2>Danh sách yêu thích trống</h2>
            <p>
              Bạn chưa thêm cuốn sách nào vào danh sách yêu thích. 
              Hãy tìm kiếm và thêm những cuốn sách bạn yêu thích.
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/')}
            >
              Tìm kiếm sách
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="favorites-controls">
            <div className="search-controls">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Tìm trong danh sách yêu thích..."
                initialValue={searchQuery}
              />
            </div>

            <div className="view-controls">
              <div className="sort-controls">
                <Filter size={16} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="sort-order-btn"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </Button>
              </div>

              <div className="view-mode-controls">
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

          {filteredAndSortedFavorites.length === 0 ? (
            <div className="no-results">
              <Search size={48} />
              <h3>Không tìm thấy kết quả</h3>
              <p>Không có sách nào phù hợp với từ khóa "{searchQuery}"</p>
              <Button
                variant="outline"
                onClick={() => setSearchQuery('')}
              >
                Xóa bộ lọc
              </Button>
            </div>
          ) : (
            <div className={`favorites-grid favorites-grid-${viewMode}`}>
              {filteredAndSortedFavorites.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  variant={viewMode}
                  onViewDetails={handleViewDetails}
                  onToggleFavorite={handleToggleFavorite}
                  isFavorite={true}
                />
              ))}
            </div>
          )}
        </>
      )}

      {showConfirmClear && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Xác nhận xóa</h3>
            <p>
              Bạn có chắc chắn muốn xóa tất cả {favorites.length} cuốn sách 
              khỏi danh sách yêu thích không? Hành động này không thể hoàn tác.
            </p>
            <div className="modal-actions">
              <Button
                variant="danger"
                onClick={handleClearFavorites}
              >
                Xóa tất cả
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowConfirmClear(false)}
              >
                Hủy
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;