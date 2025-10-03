import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, Heart, ExternalLink, Github, Code } from 'lucide-react';
import Button from '../components/Button';
import './AboutPage.css';

const AboutPage = () => {
  const features = [
    {
      icon: <Search size={24} />,
      title: 'Tìm kiếm mạnh mẽ',
      description: 'Tìm kiếm trong hàng triệu cuốn sách theo tên, tác giả, hoặc từ khóa với Google Books API.'
    },
    {
      icon: <Heart size={24} />,
      title: 'Quản lý yêu thích',
      description: 'Lưu và quản lý danh sách sách yêu thích của bạn với localStorage.'
    },
    {
      icon: <BookOpen size={24} />,
      title: 'Thông tin chi tiết',
      description: 'Xem thông tin đầy đủ về sách bao gồm mô tả, đánh giá, và liên kết preview.'
    }
  ];

  const technologies = [
    {
      name: 'React',
      description: 'Framework JavaScript để xây dựng giao diện người dùng',
      link: 'https://reactjs.org'
    },
    {
      name: 'React Router DOM',
      description: 'Thư viện routing cho ứng dụng React',
      link: 'https://reactrouter.com'
    },
    {
      name: 'Google Books API',
      description: 'API miễn phí từ Google để truy cập thông tin sách',
      link: 'https://developers.google.com/books'
    },
    {
      name: 'Lucide React',
      description: 'Thư viện icon đẹp và nhẹ cho React',
      link: 'https://lucide.dev'
    },
    {
      name: 'CSS Variables',
      description: 'CSS thuần với CSS Variables để quản lý theme',
      link: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties'
    }
  ];

  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="hero-content">
          <div className="hero-icon">
            <BookOpen size={64} />
          </div>
          <h1>Về Book Finder</h1>
          <p className="hero-description">
            Book Finder là ứng dụng web được xây dựng với React, giúp bạn tìm kiếm 
            và khám phá hàng triệu cuốn sách từ thư viện Google Books. 
            Với giao diện hiện đại và trải nghiệm người dùng tốt, 
            Book Finder là công cụ hoàn hảo cho những người yêu sách.
          </p>
        </div>
      </div>

      <div className="about-section">
        <h2>Tính năng chính</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="about-section">
        <h2>Công nghệ sử dụng</h2>
        <div className="technologies-grid">
          {technologies.map((tech, index) => (
            <div key={index} className="tech-card">
              <div className="tech-header">
                <h4>{tech.name}</h4>
                <a
                  href={tech.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tech-link"
                  aria-label={`Tìm hiểu về ${tech.name}`}
                >
                  <ExternalLink size={16} />
                </a>
              </div>
              <p>{tech.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="about-section">
        <h2>Triết lý thiết kế</h2>
        <div className="philosophy-content">
          <div className="philosophy-item">
            <h3>🌙 Dark Mode Ưu tiên</h3>
            <p>
              Giao diện tối được thiết kế làm chủ đạo, giúp giảm mỏi mắt 
              khi sử dụng lâu dài, đặc biệt trong môi trường ánh sáng yếu.
            </p>
          </div>
          
          <div className="philosophy-item">
            <h3>📱 Responsive Design</h3>
            <p>
              Tối ưu hóa cho mọi thiết bị từ desktop đến mobile với 
              grid layout linh hoạt (4 → 2 → 1 card).
            </p>
          </div>
          
          <div className="philosophy-item">
            <h3>♿ Accessibility</h3>
            <p>
              Tuân thủ các tiêu chuẩn WCAG với focus states, 
              keyboard navigation và screen reader support.
            </p>
          </div>
          
          <div className="philosophy-item">
            <h3>⚡ Performance</h3>
            <p>
              Tối ưu hóa hiệu suất với lazy loading hình ảnh, 
              pagination và caching localStorage.
            </p>
          </div>
        </div>
      </div>

      <div className="about-section">
        <h2>Về Google Books API</h2>
        <div className="api-info">
          <p>
            Ứng dụng sử dụng Google Books API để truy cập cơ sở dữ liệu khổng lồ 
            với hàng triệu cuốn sách từ khắp nơi trên thế giới. API này hoàn toàn 
            miễn phí và cung cấp thông tin chi tiết về sách bao gồm:
          </p>
          
          <ul className="api-features">
            <li>Thông tin cơ bản: tên sách, tác giả, nhà xuất bản</li>
            <li>Mô tả và nội dung sách</li>
            <li>Hình ảnh bìa sách chất lượng cao</li>
            <li>Đánh giá và số lượng đọc giả</li>
            <li>Liên kết preview và mua sách</li>
            <li>Thông tin xuất bản và thể loại</li>
          </ul>
          
          <div className="api-links">
            <Button
              variant="outline"
              icon={<ExternalLink size={16} />}
              onClick={() => window.open('https://developers.google.com/books', '_blank')}
            >
              Tìm hiểu về Google Books API
            </Button>
          </div>
        </div>
      </div>

      <div className="about-section">
        <h2>Mã nguồn mở</h2>
        <div className="opensource-content">
          <div className="opensource-icon">
            <Github size={48} />
          </div>
          <p>
            Book Finder được phát triển như một dự án mã nguồn mở. 
            Bạn có thể xem source code, đóng góp cải tiến hoặc fork 
            để tạo phiên bản của riêng mình.
          </p>
          
          <div className="opensource-actions">
            <Button
              variant="primary"
              icon={<Github size={16} />}
              onClick={() => window.open('https://github.com', '_blank')}
            >
              Xem trên GitHub
            </Button>
            
            <Button
              variant="outline"
              icon={<Code size={16} />}
              onClick={() => window.open('https://github.com', '_blank')}
            >
              Đóng góp
            </Button>
          </div>
        </div>
      </div>

      <div className="about-cta">
        <div className="cta-content">
          <h2>Bắt đầu khám phá</h2>
          <p>
            Hãy bắt đầu hành trình khám phá thế giới sách cùng Book Finder. 
            Tìm kiếm những cuốn sách yêu thích và xây dựng thư viện cá nhân của bạn.
          </p>
          
          <div className="cta-actions">
            <Link to="/">
              <Button variant="primary" size="large">
                <Search size={18} />
                Tìm kiếm sách
              </Button>
            </Link>
            
            <Link to="/favorites">
              <Button variant="outline" size="large">
                <Heart size={18} />
                Xem yêu thích
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;