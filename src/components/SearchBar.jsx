import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import Button from './Button';
import './SearchBar.css';

const SearchBar = ({ 
  onSearch, 
  placeholder = "Tìm kiếm sách theo tên hoặc tác giả...",
  initialValue = "",
  loading = false,
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedTerm = searchTerm.trim();
    if (trimmedTerm && onSearch) {
      onSearch(trimmedTerm);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    if (onSearch) {
      onSearch('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <div className={`search-bar ${className}`}>
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-container">
          <div className="search-icon">
            <Search size={20} />
          </div>
          
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="search-input"
            disabled={loading}
            autoComplete="off"
            spellCheck="false"
          />
          
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="search-clear"
              aria-label="Xóa tìm kiếm"
              disabled={loading}
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        <Button
          type="submit"
          variant="primary"
          size="medium"
          loading={loading}
          disabled={!searchTerm.trim() || loading}
          className="search-button"
        >
          Tìm kiếm
        </Button>
      </form>
      
      <div className="search-suggestions">
      </div>
    </div>
  );
};

export default SearchBar;