import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Heart, Info, Sun, Moon, Menu, X } from 'lucide-react';
import Button from './Button';
import './Navbar.css';

const Navbar = ({ isDark, onToggleTheme }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    {
      path: '/',
      label: 'Trang chủ',
      icon: <BookOpen size={18} />
    },
    {
      path: '/favorites',
      label: 'Yêu thích',
      icon: <Heart size={18} />
    },
    {
      path: '/about',
      label: 'Giới thiệu',
      icon: <Info size={18} />
    }
  ];

  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          <BookOpen size={24} />
          <span className="logo-text">Book Finder</span>
        </Link>

        <div className="navbar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${isActivePath(item.path) ? 'nav-link-active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="navbar-actions">
          <Button
            variant="ghost"
            size="small"
            onClick={onToggleTheme}
            icon={isDark ? <Sun size={18} /> : <Moon size={18} />}
            className="theme-toggle"
            aria-label={isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
          />

          <Button
            variant="ghost"
            size="small"
            onClick={toggleMobileMenu}
            icon={isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            className="mobile-menu-toggle"
            aria-label="Menu"
          />
        </div>
      </div>

      <div className={`mobile-nav ${isMobileMenuOpen ? 'mobile-nav-open' : ''}`}>
        <div className="mobile-nav-content">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`mobile-nav-link ${isActivePath(item.path) ? 'mobile-nav-link-active' : ''}`}
              onClick={closeMobileMenu}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
          
          <div className="mobile-nav-footer">
            <Button
              variant="outline"
              size="small"
              onClick={() => {
                onToggleTheme();
                closeMobileMenu();
              }}
              icon={isDark ? <Sun size={18} /> : <Moon size={18} />}
              className="mobile-theme-toggle"
            >
              {isDark ? 'Giao diện sáng' : 'Giao diện tối'}
            </Button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div 
          className="mobile-nav-overlay" 
          onClick={closeMobileMenu}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              closeMobileMenu();
            }
          }}
        />
      )}
    </nav>
  );
};

export default Navbar;