import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORY_LIST } from '../../constants.js';
import { useRealTimeClock } from '../../hooks/useRealTimeClock.js';
import { useVisitorCounter } from '../../hooks/useVisitorCounter.js';

export default function Footer() {
  const { formattedTime, formattedDate } = useRealTimeClock();
  const visitorCount = useVisitorCounter();

  return (
    <footer className="bg-white border-top mt-auto py-5">
      <div className="container">
        <div className="row g-4 mb-4">
          {/* Brand & Introduction */}
          <div className="col-lg-4 col-md-6">
            <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none text-primary fs-4 fw-bold mb-3">
              <span>🌌</span>
              <span className="font-heading">FandomVerse</span>
            </Link>
            <p className="text-secondary small mb-3">
              Cổng thông tin vũ trụ người hâm mộ toàn diện. Kết nối cộng đồng đam mê Anime, Gaming, Phim ảnh, K-Pop, Comics và Manga trên khắp thế giới.
            </p>
            {/* Live Clock & Visitor Counter Badge */}
            <div className="p-3 bg-light rounded-3 border">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="small text-muted d-flex align-items-center gap-1">
                  <i className="bi bi-clock-history text-primary"></i> Thời gian thực:
                </span>
                <span className="badge bg-white text-primary border shadow-sm font-monospace">
                  {formattedTime}
                </span>
              </div>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                {formattedDate}
              </div>
              <hr className="my-2" />
              <div className="d-flex align-items-center justify-content-between">
                <span className="small text-muted d-flex align-items-center gap-1">
                  <i className="bi bi-people-fill text-success"></i> Tổng lượt truy cập:
                </span>
                <span className="badge bg-success font-monospace">
                  {visitorCount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* 7 Fandom Categories */}
          <div className="col-lg-4 col-md-6">
            <h6 className="font-heading fw-bold text-dark mb-3">Vũ Trụ Fandom</h6>
            <div className="row g-2">
              {CATEGORY_LIST.map((cat) => (
                <div key={cat.id} className="col-6">
                  <Link
                    to={`/category/${cat.id}`}
                    className="text-decoration-none text-secondary small d-flex align-items-center gap-1 hover-primary py-1"
                  >
                    <i className={`bi ${cat.icon} text-primary`}></i>
                    <span>{cat.label}</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Useful Navigation & Info */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="font-heading fw-bold text-dark mb-3">Khám Phá</h6>
            <ul className="list-unstyled small mb-0">
              <li className="mb-2">
                <Link to="/trailers" className="text-decoration-none text-secondary">
                  Trung tâm Trailers
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/merchandise" className="text-decoration-none text-secondary">
                  Gian hàng Merchandise
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/bookmarks" className="text-decoration-none text-secondary">
                  Nội dung đã lưu
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/search" className="text-decoration-none text-secondary">
                  Tìm kiếm toàn cục
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Static */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="font-heading fw-bold text-dark mb-3">Thông Tin</h6>
            <ul className="list-unstyled small mb-0">
              <li className="mb-2">
                <Link to="/about" className="text-decoration-none text-secondary">
                  Về chúng tôi
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="text-decoration-none text-secondary">
                  Liên hệ & Tọa độ
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/login" className="text-decoration-none text-secondary">
                  Đăng nhập
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/signup" className="text-decoration-none text-secondary">
                  Tạo tài khoản
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-4 border-light-subtle" />

        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between small text-muted">
          <div>
            © {new Date().getFullYear()} FandomVerse. All Rights Reserved. Publisher: © Aptech Limited.
          </div>
          <div className="mt-2 mt-md-0">
            Cuộc thi <strong className="text-primary">TechWir — Web Innovation Unleashed</strong> (SPA Architecture)
          </div>
        </div>
      </div>
    </footer>
  );
}
