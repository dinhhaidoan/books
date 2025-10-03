import React from 'react';
import { Heart, Star, Eye, ExternalLink } from 'lucide-react';
import Button from './Button';
import './BookCard.css';

const BookCard = ({ 
  book, 
  onViewDetails, 
  onToggleFavorite, 
  isFavorite = false,
  variant = 'grid' // 'grid' hoặc 'list'
}) => {
  const {
    title,
    authorsText,
    thumbnail,
    shortDescription,
    rating,
    ratingsCount,
    publishYear,
    categories,
    hasPreview
  } = book;

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(book);
    }
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(book);
    }
  };

  const handleImageError = (e) => {
    e.target.src = '/placeholder-book.png';
  };

  const renderRating = () => {
    if (!rating || rating === 0) return null;

    return (
      <div className="book-rating">
        <div className="rating-stars">
          <Star size={14} fill="currentColor" />
          <span className="rating-value">{rating}</span>
        </div>
        {ratingsCount > 0 && (
          <span className="rating-count">({ratingsCount})</span>
        )}
      </div>
    );
  };

  const renderCategories = () => {
    if (!categories || categories.length === 0) return null;

    return (
      <div className="book-categories">
        {categories.slice(0, 2).map((category, index) => (
          <span key={index} className="book-category">
            {category}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className={`book-card book-card-${variant}`}>
      <div className="book-card-content" onClick={handleViewDetails}>
        <div className="book-cover">
          <img
            src={thumbnail || '/placeholder-book.png'}
            alt={`Bìa sách ${title}`}
            className="book-image"
            onError={handleImageError}
            loading="lazy"
          />
          
          <div className="book-overlay">
            <div className="book-actions">
              <Button
                variant="ghost"
                size="small"
                icon={<Eye size={16} />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewDetails();
                }}
                className="action-btn view-btn"
              >
                Xem chi tiết
              </Button>
              
              {hasPreview && (
                <Button
                  variant="ghost"
                  size="small"
                  icon={<ExternalLink size={16} />}
                  className="action-btn preview-btn"
                >
                  Xem trước
                </Button>
              )}
            </div>
          </div>
          
          <button
            className={`favorite-btn ${isFavorite ? 'favorite-active' : ''}`}
            onClick={handleToggleFavorite}
            aria-label={isFavorite ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
          >
            <Heart 
              size={18} 
              fill={isFavorite ? 'currentColor' : 'none'}
            />
          </button>
        </div>

        <div className="book-info">
          <div className="book-header">
            <h3 className="book-title" title={title}>
              {title}
            </h3>
            {renderRating()}
          </div>

          <div className="book-meta">
            <p className="book-authors" title={authorsText}>
              {authorsText}
            </p>
            {publishYear && (
              <span className="book-year">{publishYear}</span>
            )}
          </div>

          {renderCategories()}

          {variant === 'list' && shortDescription && (
            <p className="book-description">
              {shortDescription}
            </p>
          )}
        </div>
      </div>

      {variant === 'list' && (
        <div className="book-card-footer">
          <Button
            variant="outline"
            size="small"
            onClick={handleViewDetails}
          >
            Xem chi tiết
          </Button>
          
          <Button
            variant={isFavorite ? 'danger' : 'ghost'}
            size="small"
            icon={<Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />}
            onClick={handleToggleFavorite}
          >
            {isFavorite ? 'Bỏ yêu thích' : 'Yêu thích'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default BookCard;