import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Heart, 
  ExternalLink, 
  Calendar, 
  Users, 
  BookOpen, 
  Star,
  Globe,
  Building,
  Tag
} from 'lucide-react';
import Button from '../components/Button';
import Loader from '../components/Loader';
import { useBook } from '../hooks/useBooks';
import { useFavorites } from '../hooks/useFavorites';
import './BookDetailPage.css';

const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { book, loading, error, refetch } = useBook(id);
  const { toggleFavorite, isFavorite } = useFavorites();
  const [imageError, setImageError] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleToggleFavorite = () => {
    if (book) {
      toggleFavorite(book);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handlePreviewClick = () => {
    if (book?.previewLink) {
      window.open(book.previewLink, '_blank', 'noopener,noreferrer');
    }
  };

  const handleBuyClick = () => {
    if (book?.buyLink) {
      window.open(book.buyLink, '_blank', 'noopener,noreferrer');
    }
  };

  const renderRating = () => {
    if (!book?.rating || book.rating === 0) return null;

    const stars = [];
    const fullStars = Math.floor(book.rating);
    const hasHalfStar = book.rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} size={20} fill="currentColor" className="star-filled" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star key={i} size={20} fill="currentColor" className="star-half" />
        );
      } else {
        stars.push(
          <Star key={i} size={20} className="star-empty" />
        );
      }
    }

    return (
      <div className="book-rating-detail">
        <div className="rating-stars">
          {stars}
        </div>
        <div className="rating-info">
          <span className="rating-value">{book.rating}</span>
          {book.ratingsCount > 0 && (
            <span className="rating-count">({book.ratingsCount} đánh giá)</span>
          )}
        </div>
      </div>
    );
  };

  const renderBookInfo = () => {
    if (!book) return null;

    const infoItems = [
      {
        icon: <Users size={18} />,
        label: 'Tác giả',
        value: book.authorsText,
        show: book.authorsText && book.authorsText !== 'Không rõ tác giả'
      },
      {
        icon: <Building size={18} />,
        label: 'Nhà xuất bản',
        value: book.publisher,
        show: book.publisher && book.publisher !== 'Không rõ nhà xuất bản'
      },
      {
        icon: <Calendar size={18} />,
        label: 'Năm xuất bản',
        value: book.publishYear,
        show: book.publishYear
      },
      {
        icon: <BookOpen size={18} />,
        label: 'Số trang',
        value: `${book.pageCount} trang`,
        show: book.pageCount > 0
      },
      {
        icon: <Globe size={18} />,
        label: 'Ngôn ngữ',
        value: book.language?.toUpperCase(),
        show: book.language && book.language !== 'Không rõ'
      }
    ];

    return (
      <div className="book-info-grid">
        {infoItems
          .filter(item => item.show)
          .map((item, index) => (
            <div key={index} className="info-item">
              <div className="info-icon">{item.icon}</div>
              <div className="info-content">
                <span className="info-label">{item.label}</span>
                <span className="info-value">{item.value}</span>
              </div>
            </div>
          ))}
      </div>
    );
  };

  const renderCategories = () => {
    if (!book?.categories || book.categories.length === 0) return null;

    return (
      <div className="book-categories-detail">
        <div className="categories-header">
          <Tag size={18} />
          <h3>Thể loại</h3>
        </div>
        <div className="categories-list">
          {book.categories.map((category, index) => (
            <span key={index} className="category-tag">
              {category}
            </span>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="book-detail-page">
        <div className="book-detail-loading">
          <Loader size="large" message="Đang tải thông tin sách..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="book-detail-page">
        <div className="book-detail-error">
          <div className="error-content">
            <h2>Có lỗi xảy ra</h2>
            <p>{error}</p>
            <div className="error-actions">
              <Button variant="primary" onClick={refetch}>
                Thử lại
              </Button>
              <Button variant="ghost" onClick={handleBack}>
                Quay lại
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="book-detail-page">
        <div className="book-not-found">
          <h2>Không tìm thấy sách</h2>
          <p>Sách bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <Button variant="primary" onClick={handleBack}>
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="book-detail-page">
      <div className="book-detail-header">
        <Button
          variant="ghost"
          icon={<ArrowLeft size={18} />}
          onClick={handleBack}
          className="back-button"
        >
          Quay lại
        </Button>
      </div>

      <div className="book-detail-content">
        <div className="book-cover-section">
          <div className="book-cover-container">
            <img
              src={imageError ? '/placeholder-book.png' : (book.thumbnail || '/placeholder-book.png')}
              alt={`Bìa sách ${book.title}`}
              className="book-cover-large"
              onError={handleImageError}
            />
            
            <div className="book-actions">
              <Button
                variant={isFavorite(book.id) ? 'danger' : 'outline'}
                icon={<Heart size={18} fill={isFavorite(book.id) ? 'currentColor' : 'none'} />}
                onClick={handleToggleFavorite}
                size="large"
                className="favorite-action"
              >
                {isFavorite(book.id) ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
              </Button>

              {book.hasPreview && (
                <Button
                  variant="primary"
                  icon={<ExternalLink size={18} />}
                  onClick={handlePreviewClick}
                  size="large"
                >
                  Xem trước
                </Button>
              )}

              {book.buyLink && (
                <Button
                  variant="success"
                  icon={<ExternalLink size={18} />}
                  onClick={handleBuyClick}
                  size="large"
                >
                  Mua sách
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="book-details-section">
          <div className="book-header">
            <h1 className="book-title">{book.title}</h1>
            {renderRating()}
          </div>

          {renderBookInfo()}

          {book.description && (
            <div className="book-description">
              <h3>Mô tả</h3>
              <div 
                className="description-content"
                dangerouslySetInnerHTML={{ __html: book.description }}
              />
            </div>
          )}

          {renderCategories()}

          {(book.infoLink || book.canonicalVolumeLink) && (
            <div className="book-links">
              <h3>Liên kết</h3>
              <div className="links-list">
                {book.infoLink && (
                  <a
                    href={book.infoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="book-link"
                  >
                    <ExternalLink size={16} />
                    Thông tin chi tiết trên Google Books
                  </a>
                )}
                {book.canonicalVolumeLink && (
                  <a
                    href={book.canonicalVolumeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="book-link"
                  >
                    <ExternalLink size={16} />
                    Trang chính thức
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;