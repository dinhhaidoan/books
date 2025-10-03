import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import Button from '../components/Button';
import './NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <div className="not-found-illustration">
          <div className="error-code">404</div>
          <div className="error-books">
            <div className="book book-1"></div>
            <div className="book book-2"></div>
            <div className="book book-3"></div>
          </div>
        </div>
        
        <div className="not-found-text">
          <h1>Trang không tìm thấy</h1>
          <p>
            Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển. 
            Có thể bạn đã nhập sai địa chỉ hoặc trang này đã bị xóa.
          </p>
          
          <div className="not-found-suggestions">
            <h3>Bạn có thể:</h3>
            <ul>
              <li>Kiểm tra lại đường dẫn URL</li>
              <li>Quay về trang chủ để tìm kiếm sách</li>
              <li>Xem danh sách sách yêu thích của bạn</li>
            </ul>
          </div>
        </div>
        
        <div className="not-found-actions">
          <Link to="/">
            <Button variant="primary" size="large" icon={<Home size={18} />}>
              Về trang chủ
            </Button>
          </Link>
          
          <Link to="/">
            <Button variant="outline" size="large" icon={<Search size={18} />}>
              Tìm kiếm sách
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;