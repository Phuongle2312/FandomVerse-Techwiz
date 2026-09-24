import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CATEGORY_LIST } from '../../constants.js';
import { useCart } from '../../context/CartContext.jsx';
import { useBookmarks } from '../../context/BookmarkContext.jsx';

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const navigate = useNavigate();

  const { cartCount, setIsCartOpen } = useCart();
  const { bookmarkCount } = useBookmarks();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setIsNavCollapsed(true);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm py-2">
      <div className="container">
        {/* Brand Logo */}
        <Link
          to="/"
          className="navbar-brand d-flex align-items-center gap-2 fw-bold text-primary fs-4"
          onClick={() => setIsNavCollapsed(true)}
        >
          <span style={{ fontSize: '1.75rem' }}>🌌</span>
          <span className="font-heading tracking-wide">FandomVerse</span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-0 shadow-none"
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
                className="nav-link dropdown-toggle fw-semibold px-3"
                href="#categories"
                id="categoriesDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-grid-fill me-1 text-primary"></i> Danh Mục Fandom
              </a>
              <ul className="dropdown-menu border-0 shadow-lg rounded-3 py-2" aria-labelledby="categoriesDropdown">
                {CATEGORY_LIST.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      to={`/category/${cat.id}`}
                      className="dropdown-item d-flex align-items-center gap-2 py-2 px-3"
                      onClick={() => setIsNavCollapsed(true)}
                    >
                      <i className={`bi ${cat.icon} text-primary`}></i>
                      <span>{cat.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            <li className="nav-item">
              <Link
                to="/trailers"
                className="nav-link fw-semibold px-3"
                onClick={() => setIsNavCollapsed(true)}
              >
                <i className="bi bi-play-btn me-1 text-danger"></i> Trailers
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/merchandise"
                className="nav-link fw-semibold px-3"
                onClick={() => setIsNavCollapsed(true)}
              >
                <i className="bi bi-bag-check me-1 text-success"></i> Merchandise
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/about"
                className="nav-link fw-medium px-2 text-secondary"
                onClick={() => setIsNavCollapsed(true)}
              >
                Giới thiệu
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/contact"
                className="nav-link fw-medium px-2 text-secondary"
                onClick={() => setIsNavCollapsed(true)}
              >
                Liên hệ
              </Link>
            </li>
          </ul>

          {/* Global Search Bar */}
          <form className="d-flex align-items-center me-lg-3 my-2 my-lg-0" onSubmit={handleSearchSubmit}>
            <div className="input-group" style={{ minWidth: '220px', maxWidth: '320px' }}>
              <input
                type="search"
                className="form-control rounded-pill-start border-end-0 bg-light"
                placeholder="Tìm nhân vật, bài viết..."
                aria-label="Tìm kiếm toàn cục"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                className="btn btn-outline-secondary border-start-0 bg-light rounded-pill-end text-primary"
                type="submit"
                aria-label="Nút tìm kiếm"
              >
                <i className="bi bi-search"></i>
              </button>
            </div>
          </form>

          {/* Action Icons & Dummy Auth */}
          <div className="d-flex align-items-center gap-2 mt-2 mt-lg-0">
            {/* Bookmarks Icon Button */}
            <Link
              to="/bookmarks"
              className="btn btn-light position-relative rounded-circle p-2"
              title="Danh sách đã lưu"
              aria-label="Xem danh sách bài viết đã bookmark"
              onClick={() => setIsNavCollapsed(true)}
            >
              <i className="bi bi-heart text-danger fs-5"></i>
              {bookmarkCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.7rem' }}>
                  {bookmarkCount}
                </span>
              )}
            </Link>

            {/* Cart Icon Button */}
            <button
              type="button"
              className="btn btn-light position-relative rounded-circle p-2"
              title="Mở giỏ hàng"
              aria-label="Mở giỏ hàng"
              onClick={() => {
                setIsCartOpen(true);
                setIsNavCollapsed(true);
              }}
            >
              <i className="bi bi-cart3 text-primary fs-5"></i>
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary" style={{ fontSize: '0.7rem' }}>
                  {cartCount}
                </span>
              )}
            </button>

            {/* Dummy Login / Signup Links */}
            <div className="d-flex align-items-center gap-1 ms-2 border-start ps-2">
              <Link
                to="/login"
                className="btn btn-sm btn-outline-fv px-3"
                onClick={() => setIsNavCollapsed(true)}
              >
                Đăng nhập
              </Link>
              <Link
                to="/signup"
                className="btn btn-sm btn-primary-fv px-3 d-none d-sm-inline-block"
                onClick={() => setIsNavCollapsed(true)}
              >
                Đăng ký
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
