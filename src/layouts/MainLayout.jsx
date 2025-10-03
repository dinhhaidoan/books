import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './MainLayout.css';

const MainLayout = ({ isDark, onToggleTheme }) => {
  return (
    <div className="main-layout">
      <Navbar isDark={isDark} onToggleTheme={onToggleTheme} />
      
      <main className="main-content">
        <div className="container">
          <Outlet />
        </div>
      </main>
      
      <footer className="main-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>Book Finder</h4>
              <p>Tìm kiếm và khám phá hàng triệu cuốn sách từ Google Books API.</p>
            </div>
            
            <div className="footer-section">
              <h5>Liên kết</h5>
              <ul className="footer-links">
                <li><a href="/">Trang chủ</a></li>
                <li><a href="/favorites">Yêu thích</a></li>
                <li><a href="/about">Giới thiệu</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h5>Công nghệ</h5>
              <ul className="footer-links">
                <li><a href="https://reactjs.org" target="_blank" rel="noopener noreferrer">React</a></li>
                <li><a href="https://developers.google.com/books" target="_blank" rel="noopener noreferrer">Google Books API</a></li>
                <li><a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2024 Book Finder. Được xây dựng với React và Google Books API.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;