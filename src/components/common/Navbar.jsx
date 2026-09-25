import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CATEGORY_LIST } from '../../constants.js';
import { useCart } from '../../context/CartContext.jsx';
import { useBookmarks } from '../../context/BookmarkContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const navigate = useNavigate();

  const { cartCount, setIsCartOpen } = useCart();
  const { bookmarkCount } = useBookmarks();
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated, currentUser, logout } = useAuth();

  const requireAuthThen = (action) => {
    if (!isAuthenticated) {
      setIsNavCollapsed(true);
      navigate('/login', { state: { from: window.location.hash.replace('#', '') || '/' } });
      return;
    }
    action();
  };

  const handleLogout = () => {
    logout();
    setIsNavCollapsed(true);
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setIsNavCollapsed(true);
    }
  };

  return (
    <nav
      className="navbar navbar-expand-lg sticky-top py-2.5"
      style={{
        backgroundColor: isDark ? 'rgba(12, 15, 29, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(108, 92, 231, 0.15)',
        boxShadow: isDark ? '0 4px 30px rgba(0, 0, 0, 0.45)' : '0 4px 20px rgba(0, 0, 0, 0.06)',
        zIndex: 1030,
        transition: 'all 0.3s ease',
      }}
    >
      <div className="container-fluid px-lg-4">
        {/* Brand Logo */}
        <Link
          to="/"
          className="navbar-brand d-flex align-items-center gap-2 fw-bold fs-4 text-decoration-none"
          onClick={() => setIsNavCollapsed(true)}
        >
          <span
            className="d-flex align-items-center justify-content-center rounded-3 text-white shadow-sm"
            style={{
              width: '38px',
              height: '38px',
              background: 'linear-gradient(135deg, #6C5CE7 0%, #FF6B81 100%)',
              fontSize: '1.25rem',
            }}
          >
            🌌
          </span>
          <span className={`font-heading tracking-wide fw-bold ${isDark ? 'text-white' : 'text-dark'}`}>
            Fandom<span style={{ background: 'linear-gradient(135deg, #a29bfe, #ff7675)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Verse</span>
          </span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className={`navbar-toggler border-0 shadow-none ${isDark ? 'text-white' : 'text-dark'}`}
          type="button"
          aria-controls="fandomNavbar"
          aria-expanded={!isNavCollapsed}
          aria-label="Chuyển đổi thanh điều hướng"
          onClick={() => setIsNavCollapsed(!isNavCollapsed)}
        >
          <i className={`bi ${isNavCollapsed ? 'bi-list' : 'bi-x-lg'} fs-3`}></i>
        </button>

        {/* Nav Content */}
        <div className={`collapse navbar-collapse ${isNavCollapsed ? '' : 'show'}`} id="fandomNavbar">
          {/* Main Links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-lg-center">
            {/* 7 Categories Dropdown */}
            <li className="nav-item dropdown">
              <a
                className={`nav-link dropdown-toggle fw-semibold px-3 d-flex align-items-center gap-1.5 ${isDark ? 'text-white' : 'text-dark'}`}
                href="#categories"
                id="categoriesDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-grid-3x3-gap-fill" style={{ color: '#a29bfe' }}></i>
                <span>Vũ Trụ Fandom</span>
              </a>
              <ul
                className={`dropdown-menu border-0 shadow-lg rounded-4 py-2 ${isDark ? 'dropdown-menu-dark' : ''}`}
                style={{
                  backgroundColor: isDark ? '#12162a' : '#ffffff',
                  border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
                }}
                aria-labelledby="categoriesDropdown"
              >
                {CATEGORY_LIST.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      to={`/category/${cat.id}`}
                      className="dropdown-item d-flex align-items-center gap-2 py-2 px-3 fw-medium"
                      onClick={() => setIsNavCollapsed(true)}
                    >
                      <i className={`bi ${cat.icon}`} style={{ color: `var(--accent-${cat.id})` }}></i>
                      <span>{cat.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            <li className="nav-item">
              <Link
                to="/trailers"
                className={`nav-link fw-semibold px-3 d-flex align-items-center gap-1.5 ${isDark ? 'text-white' : 'text-dark'}`}
                onClick={() => setIsNavCollapsed(true)}
              >
                <i className="bi bi-play-circle-fill text-danger"></i>
                <span>Trailers</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/merchandise"
                className={`nav-link fw-semibold px-3 d-flex align-items-center gap-1.5 ${isDark ? 'text-white' : 'text-dark'}`}
                onClick={() => setIsNavCollapsed(true)}
              >
                <i className="bi bi-bag-check-fill text-success"></i>
                <span>Merchandise</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/about"
                className={`nav-link fw-medium px-2 ${isDark ? 'text-white-50' : 'text-secondary'}`}
                onClick={() => setIsNavCollapsed(true)}
              >
                Giới thiệu
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/contact"
                className={`nav-link fw-medium px-2 ${isDark ? 'text-white-50' : 'text-secondary'}`}
                onClick={() => setIsNavCollapsed(true)}
              >
                Liên hệ
              </Link>
            </li>
          </ul>

          {/* High-Contrast Global Search Bar */}
          <form className="d-flex align-items-center me-lg-3 my-2 my-lg-0" onSubmit={handleSearchSubmit}>
            <div className="input-group shadow-sm" style={{ minWidth: '280px', maxWidth: '380px' }}>
              <input
                type="search"
                className={`form-control rounded-pill-start px-3.5 py-2 ${isDark ? 'text-white' : 'text-dark bg-white'}`}
                placeholder="Tìm nhân vật, bài viết..."
                aria-label="Tìm kiếm toàn cục"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.18)' : '#ffffff',
                  borderTop: isDark ? '1.5px solid rgba(162, 155, 254, 0.45)' : '1.5px solid rgba(108, 92, 231, 0.3)',
                  borderBottom: isDark ? '1.5px solid rgba(162, 155, 254, 0.45)' : '1.5px solid rgba(108, 92, 231, 0.3)',
                  borderLeft: isDark ? '1.5px solid rgba(162, 155, 254, 0.45)' : '1.5px solid rgba(108, 92, 231, 0.3)',
                  borderRight: 'none',
                  fontSize: '0.925rem',
                  fontWeight: '500',
                  color: isDark ? '#ffffff' : '#2d3436',
                }}
              />
              <button
                className="btn rounded-pill-end px-3 d-flex align-items-center justify-content-center text-white"
                type="submit"
                aria-label="Nút tìm kiếm"
                style={{
                  background: 'linear-gradient(135deg, #6C5CE7 0%, #a29bfe 100%)',
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(108, 92, 231, 0.4)',
                }}
              >
                <i className="bi bi-search fs-6"></i>
              </button>
            </div>
          </form>

          {/* Action Icons & Theme Switcher */}
          <div className="d-flex align-items-center gap-2 mt-2 mt-lg-0">
            {/* Theme Toggle Button (Light / Dark Mode) */}
            <button
              type="button"
              className="btn position-relative rounded-circle p-2 shadow-xs d-flex align-items-center justify-content-center"
              style={{
                width: '40px',
                height: '40px',
                background: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(108, 92, 231, 0.1)',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(108, 92, 231, 0.25)',
                color: isDark ? '#fdcb6e' : '#6C5CE7',
                transition: 'all 0.25s ease',
              }}
              onClick={toggleTheme}
              title={isDark ? 'Chuyển sang giao diện Sáng (Light Mode)' : 'Chuyển sang giao diện Tối (Dark Mode)'}
              aria-label="Chuyển đổi giao diện Sáng / Tối"
            >
              {isDark ? (
                <i className="bi bi-sun-fill fs-5" style={{ color: '#fdcb6e' }}></i>
              ) : (
                <i className="bi bi-moon-stars-fill fs-5" style={{ color: '#6C5CE7' }}></i>
              )}
            </button>

            {/* Bookmarks Icon Button */}
            <button
              type="button"
              className="btn position-relative rounded-circle p-2 shadow-xs d-flex align-items-center justify-content-center"
              style={{
                width: '40px',
                height: '40px',
                background: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.05)',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.08)',
              }}
              title="Danh sách đã lưu"
              aria-label="Xem danh sách bài viết đã bookmark"
              onClick={() => requireAuthThen(() => {
                setIsNavCollapsed(true);
                navigate('/bookmarks');
              })}
            >
              <i className="bi bi-heart-fill text-danger fs-5"></i>
              {bookmarkCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.7rem' }}>
                  {bookmarkCount}
                </span>
              )}
            </button>

            {/* Cart Icon Button */}
            <button
              type="button"
              className="btn position-relative rounded-circle p-2 shadow-xs d-flex align-items-center justify-content-center"
              style={{
                width: '40px',
                height: '40px',
                background: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.05)',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.08)',
              }}
              title="Mở giỏ hàng"
              aria-label="Mở giỏ hàng"
              onClick={() => requireAuthThen(() => {
                setIsCartOpen(true);
                setIsNavCollapsed(true);
              })}
            >
              <i className={`bi bi-cart3 fs-5 ${isDark ? 'text-white' : 'text-primary'}`}></i>
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary" style={{ fontSize: '0.7rem' }}>
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth Section: Login/Signup or User Menu */}
            <div className={`d-flex align-items-center gap-2 ms-2 border-start ps-2 ${isDark ? 'border-white-50' : 'border-secondary-subtle'}`}>
              {isAuthenticated ? (
                <>
                  <span
                    className={`small fw-semibold d-none d-md-inline-block text-truncate ${isDark ? 'text-white' : 'text-dark'}`}
                    style={{ maxWidth: '120px' }}
                    title={currentUser?.name}
                  >
                    <i className="bi bi-person-circle me-1"></i>
                    {currentUser?.name}
                  </span>
                  <button
                    type="button"
                    className={`btn btn-sm rounded-pill px-3 ${isDark ? 'btn-outline-light' : 'btn-outline-primary'}`}
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`btn btn-sm rounded-pill px-3 ${isDark ? 'btn-outline-light' : 'btn-outline-primary'}`}
                    onClick={() => setIsNavCollapsed(true)}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/signup"
                    className="btn btn-sm btn-primary-fv px-3 d-none d-sm-inline-block text-white"
                    onClick={() => setIsNavCollapsed(true)}
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

