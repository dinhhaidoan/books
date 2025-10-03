import React from 'react';
import './Loader.css';

const Loader = ({ 
  size = 'medium',
  variant = 'spinner',
  message = '',
  fullScreen = false,
  className = ''
}) => {
  const loaderClasses = [
    'loader',
    `loader-${size}`,
    `loader-${variant}`,
    { 'loader-fullscreen': fullScreen },
    className
  ].filter(Boolean).join(' ');

  const renderSpinner = () => (
    <div className="spinner-container">
      <div className="spinner"></div>
      {message && <p className="loader-message">{message}</p>}
    </div>
  );

  const renderDots = () => (
    <div className="dots-container">
      <div className="dots">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
      {message && <p className="loader-message">{message}</p>}
    </div>
  );

  const renderPulse = () => (
    <div className="pulse-container">
      <div className="pulse"></div>
      {message && <p className="loader-message">{message}</p>}
    </div>
  );

  const renderBars = () => (
    <div className="bars-container">
      <div className="bars">
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
      {message && <p className="loader-message">{message}</p>}
    </div>
  );

  const renderContent = () => {
    switch (variant) {
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      case 'bars':
        return renderBars();
      default:
        return renderSpinner();
    }
  };

  if (fullScreen) {
    return (
      <div className="loader-overlay">
        <div className={loaderClasses}>
          {renderContent()}
        </div>
      </div>
    );
  }

  return (
    <div className={loaderClasses}>
      {renderContent()}
    </div>
  );
};

export const BookCardSkeleton = ({ variant = 'grid' }) => {
  return (
    <div className={`book-card-skeleton book-card-skeleton-${variant}`}>
      <div className="skeleton-cover"></div>
      <div className="skeleton-content">
        <div className="skeleton-line skeleton-title"></div>
        <div className="skeleton-line skeleton-author"></div>
        <div className="skeleton-line skeleton-rating"></div>
        {variant === 'list' && (
          <>
            <div className="skeleton-line skeleton-description"></div>
            <div className="skeleton-line skeleton-description short"></div>
          </>
        )}
      </div>
    </div>
  );
};

export const LoadingGrid = ({ count = 8, variant = 'grid' }) => {
  return (
    <div className={`loading-grid loading-grid-${variant}`}>
      {Array.from({ length: count }, (_, index) => (
        <BookCardSkeleton key={index} variant={variant} />
      ))}
    </div>
  );
};

export default Loader;