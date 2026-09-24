import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORY_LIST } from '../../constants.js';
import { useRealTimeClock } from '../../hooks/useRealTimeClock.js';
import { useVisitorCounter } from '../../hooks/useVisitorCounter.js';
import { useTheme } from '../../context/ThemeContext.jsx';

export default function Footer() {
  const { formattedTime, formattedDate } = useRealTimeClock();
  const visitorCount = useVisitorCounter();
  const { isDark } = useTheme();

  return (
    <footer className="dark-universe-footer mt-auto py-5">
      <div className="container">
        <div className="row g-4 mb-4">
          {/* Brand & Introduction */}
          <div className="col-lg-4 col-md-6">
            <Link to="/" className={`d-flex align-items-center gap-2 text-decoration-none fs-4 fw-bold mb-3 ${isDark ? 'text-white' : 'text-dark'}`}>
              <span>🌌</span>
              <span className="font-heading">Fandom<span style={{ color: '#a29bfe' }}>Verse</span></span>
            </Link>
            <p className="small mb-3">
              Cổng thông tin vũ trụ người hâm mộ toàn diện. Kết nối cộng đồng đam mê Anime, Gaming, Phim ảnh, K-Pop, Comics và Manga trên khắp thế giới.
            </p>
            {/* Live Clock & Visitor Counter Badge */}
            <div
              className="p-3 rounded-4"
              style={{
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.08)',
              }}
            >
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className={`small d-flex align-items-center gap-1.5 ${isDark ? 'text-white-50' : 'text-secondary'}`}>
                  <i className="bi bi-clock-history" style={{ color: '#a29bfe' }}></i> Thời gian thực:
                </span>
                <span className="badge font-monospace" style={{ background: 'rgba(108, 92, 231, 0.25)', color: '#a29bfe', border: '1px solid rgba(108, 92, 231, 0.4)' }}>
                  {formattedTime}
                </span>
              </div>
              <div className={isDark ? 'text-white-50' : 'text-secondary'} style={{ fontSize: '0.75rem' }}>
                {formattedDate}
              </div>
              <hr className="my-2" style={{ opacity: 0.25, borderColor: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.2)' }} />
              <div className="d-flex align-items-center justify-content-between">
                <span className={`small d-flex align-items-center gap-1.5 ${isDark ? 'text-white-50' : 'text-secondary'}`}>
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
            <h6 className={`font-heading fw-bold mb-3 d-flex align-items-center gap-2 ${isDark ? 'text-white' : 'text-dark'}`}>
              <i className="bi bi-grid-fill" style={{ color: '#a29bfe' }}></i> Vũ Trụ Fandom
            </h6>
            <div className="row g-2">
              {CATEGORY_LIST.map((cat) => (
                <div key={cat.id} className="col-6">
                  <Link
                    to={`/category/${cat.id}`}
                    className={`text-decoration-none small d-flex align-items-center gap-1.5 py-1 ${isDark ? 'text-white-50' : 'text-secondary'}`}
                  >
                    <i className={`bi ${cat.icon}`} style={{ color: `var(--accent-${cat.id})` }}></i>
                    <span>{cat.label}</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Useful Navigation & Info */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className={`font-heading fw-bold mb-3 ${isDark ? 'text-white' : 'text-dark'}`}>Khám Phá</h6>
            <ul className="list-unstyled small mb-0">
              <li className="mb-2">
                <Link to="/trailers" className={`text-decoration-none ${isDark ? 'text-white-50' : 'text-secondary'}`}>
                  Trung tâm Trailers
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/merchandise" className={`text-decoration-none ${isDark ? 'text-white-50' : 'text-secondary'}`}>
                  Gian hàng Merchandise
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/bookmarks" className={`text-decoration-none ${isDark ? 'text-white-50' : 'text-secondary'}`}>
                  Nội dung đã lưu
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/search" className={`text-decoration-none ${isDark ? 'text-white-50' : 'text-secondary'}`}>
                  Tìm kiếm toàn cục
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Static */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className={`font-heading fw-bold mb-3 ${isDark ? 'text-white' : 'text-dark'}`}>Thông Tin</h6>
            <ul className="list-unstyled small mb-0">
              <li className="mb-2">
                <Link to="/about" className={`text-decoration-none ${isDark ? 'text-white-50' : 'text-secondary'}`}>
                  Về chúng tôi
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className={`text-decoration-none ${isDark ? 'text-white-50' : 'text-secondary'}`}>
                  Liên hệ & Tọa độ
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/login" className={`text-decoration-none ${isDark ? 'text-white-50' : 'text-secondary'}`}>
                  Đăng nhập
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/signup" className={`text-decoration-none ${isDark ? 'text-white-50' : 'text-secondary'}`}>
                  Tạo tài khoản
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className={`pt-4 mt-4 d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 small ${isDark ? 'text-white-50' : 'text-secondary'}`}
          style={{ borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.08)' }}
        >
          <div>
            &copy; {new Date().getFullYear()} FandomVerse. All Rights Reserved. Nền tảng kết nối người hâm mộ đa vũ trụ.
          </div>
          <div className="d-flex align-items-center gap-3">
            <span>Cuộc thi <strong style={{ color: '#a29bfe' }}>TechWir — Web Innovation</strong></span>
            <span className="badge rounded-pill" style={{ background: 'rgba(255,255,255,0.08)', color: '#a29bfe' }}>
              SPA v2.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
