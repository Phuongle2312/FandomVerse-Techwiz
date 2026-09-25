import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CATEGORY_LIST } from '../../constants.js';
import { searchService } from '../../services/searchService.js';
import { useCart } from '../../context/CartContext.jsx';
import { useBookmarks } from '../../context/BookmarkContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

const CONTENT_FILTER_IDS = [
  { id: 'character', icon: 'bi-person-badge' },
  { id: 'article', icon: 'bi-file-earmark-text' },
  { id: 'trailer', icon: 'bi-play-btn-fill' },
  { id: 'merchandise', icon: 'bi-bag-heart-fill' },
  { id: 'event', icon: 'bi-calendar-event' },
  { id: 'gallery', icon: 'bi-images' },
];

export default function Navbar() {
  const { t } = useTranslation();
  const { language, setLanguage, languages } = useLanguage();
  const CONTENT_FILTER_TYPES = CONTENT_FILTER_IDS.map((f) => ({
    ...f,
    label: t(`navbar.filterTypes.${f.id}`),
  }));
  const CATEGORY_LIST_LOCALIZED = CATEGORY_LIST.map((cat) => ({
    ...cat,
    label: t(`categories.${cat.id}.label`),
    description: t(`categories.${cat.id}.description`),
  }));
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState({
    kind: 'all',
    id: 'all',
    label: t('navbar.all'),
    icon: 'bi-grid-fill',
  });
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const languageRef = useRef(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [quickFilterType, setQuickFilterType] = useState('all');
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const searchContainerRef = useRef(null);
  const categoriesRef = useRef(null);
  const directionAnchorRef = useRef(0);
  const navigate = useNavigate();

  const { cartCount, setIsCartOpen } = useCart();
  const { bookmarkCount } = useBookmarks();
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated, currentUser, logout } = useAuth();

  useEffect(() => {
    setFilterMode((prev) => (prev.id === 'all' ? { ...prev, label: t('navbar.all') } : prev));
  }, [language, t]);

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

  useEffect(() => {
    // Note: this project enables global `scroll-behavior: smooth`, which makes a single
    // scroll gesture fire many tiny incremental scroll events. Comparing raw deltas
    // between consecutive events (a few px each) would almost never cross a threshold,
    // so instead we track cumulative movement since the last direction flip.
    const HIDE_THRESHOLD = 60;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 80) {
        setIsNavVisible(true);
        directionAnchorRef.current = currentScrollY;
        return;
      }
      const delta = currentScrollY - directionAnchorRef.current;
      if (delta > HIDE_THRESHOLD) {
        setIsNavVisible(false);
        directionAnchorRef.current = currentScrollY;
      } else if (delta < -HIDE_THRESHOLD) {
        setIsNavVisible(true);
        directionAnchorRef.current = currentScrollY;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsFilterOpen(false);
        setIsSuggestionsOpen(false);
      }
      if (categoriesRef.current && !categoriesRef.current.contains(e.target)) {
        setIsCategoriesOpen(false);
      }
      if (languageRef.current && !languageRef.current.contains(e.target)) {
        setIsLanguageOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const liveResults = useMemo(() => {
    const term = searchTerm.trim();
    if (!term) return [];
    let cat = filterMode.kind === 'category' ? filterMode.id : 'all';
    let typ = filterMode.kind === 'type' ? filterMode.id : (quickFilterType !== 'all' ? quickFilterType : 'all');
    return searchService.search(term, { category: cat, type: typ }).slice(0, 6);
  }, [searchTerm, filterMode, quickFilterType]);

  const totalResultsCount = useMemo(() => {
    const term = searchTerm.trim();
    if (!term) return 0;
    let cat = filterMode.kind === 'category' ? filterMode.id : 'all';
    let typ = filterMode.kind === 'type' ? filterMode.id : (quickFilterType !== 'all' ? quickFilterType : 'all');
    return searchService.search(term, { category: cat, type: typ }).length;
  }, [searchTerm, filterMode, quickFilterType]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const term = searchTerm.trim();
    if (term || filterMode.id !== 'all') {
      const params = new URLSearchParams();
      if (term) params.set('q', term);
      if (filterMode.kind === 'category') params.set('category', filterMode.id);
      if (filterMode.kind === 'type') {
        params.set('type', filterMode.id);
      } else if (quickFilterType !== 'all') {
        params.set('type', quickFilterType);
      }
      navigate(`/search?${params.toString()}`);
      setIsNavCollapsed(true);
      setIsSuggestionsOpen(false);
      setIsFilterOpen(false);
    }
  };

  const handleSelectFilter = (kind, id, label, icon) => {
    setFilterMode({ kind, id, label, icon });
    setIsFilterOpen(false);
    setQuickFilterType('all');
    if (searchTerm.trim()) {
      setIsSuggestionsOpen(true);
    }
  };

  const handleSuggestionClick = (targetUrl) => {
    setIsSuggestionsOpen(false);
    setIsFilterOpen(false);
    setIsNavCollapsed(true);
    const cleanPath = targetUrl.replace(/^#/, '');
    navigate(cleanPath);
  };

  return (
    <nav
      className="navbar navbar-expand-lg fixed-top py-2.5"
      style={{
        backgroundColor: 'transparent',
        borderBottom: 'none',
        boxShadow: 'none',
        zIndex: 1030,
        transform: isNavVisible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.35s ease',
      }}
    >
      <div className="container-fluid px-3 px-md-4 px-lg-5">
        {/* Brand Logo */}
        <Link
          to="/"
          className="navbar-brand d-flex align-items-center gap-2 fw-bold fs-4 text-decoration-none"
          onClick={() => setIsNavCollapsed(true)}
          style={{ textShadow: '0 1px 4px rgba(0, 0, 0, 0.6), 0 1px 10px rgba(0, 0, 0, 0.3)' }}
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
          <span className="font-heading tracking-wide fw-bold text-white">
            Fandom<span style={{ background: 'linear-gradient(135deg, #a29bfe, #ff7675)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Verse</span>
          </span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-0 shadow-none text-white"
          type="button"
          aria-controls="fandomNavbar"
          aria-expanded={!isNavCollapsed}
          aria-label={t('navbar.toggleNav')}
          onClick={() => setIsNavCollapsed(!isNavCollapsed)}
        >
          <i className={`bi ${isNavCollapsed ? 'bi-list' : 'bi-x-lg'} fs-3`}></i>
        </button>

        {/* Nav Content */}
        <div className={`collapse navbar-collapse ${isNavCollapsed ? '' : 'show'}`} id="fandomNavbar">
          {/* Main Links */}
          <ul
            className="navbar-nav me-auto mb-2 mb-lg-0 align-items-lg-center"
            style={{ textShadow: '0 1px 4px rgba(0, 0, 0, 0.6), 0 1px 10px rgba(0, 0, 0, 0.3)' }}
          >
            {/* 7 Categories Dropdown */}
            <li
              ref={categoriesRef}
              className={`nav-item dropdown ${isCategoriesOpen ? 'show' : ''}`}
            >
              <button
                type="button"
                className="nav-link dropdown-toggle fw-semibold px-3 d-flex align-items-center gap-1.5 bg-transparent border-0 text-white"
                id="categoriesDropdown"
                aria-expanded={isCategoriesOpen}
                onClick={() => setIsCategoriesOpen((open) => !open)}
              >
                <i className="bi bi-grid-3x3-gap-fill" style={{ color: '#a29bfe' }}></i>
                <span>{t('navbar.fandomUniverse')}</span>
              </button>
              <ul
                className={`dropdown-menu border-0 shadow-lg rounded-4 py-2 ${isDark ? 'dropdown-menu-dark' : ''} ${isCategoriesOpen ? 'show' : ''}`}
                style={{
                  backgroundColor: isDark ? '#12162a' : '#ffffff',
                  border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
                }}
                aria-labelledby="categoriesDropdown"
              >
                {CATEGORY_LIST_LOCALIZED.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      to={`/category/${cat.id}`}
                      className="dropdown-item d-flex align-items-center gap-2 py-2 px-3 fw-medium"
                      onClick={() => {
                        setIsNavCollapsed(true);
                        setIsCategoriesOpen(false);
                      }}
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
                className="nav-link fw-semibold px-3 d-flex align-items-center gap-1.5 text-white"
                onClick={() => setIsNavCollapsed(true)}
              >
                <i className="bi bi-play-circle-fill text-danger"></i>
                <span>{t('navbar.trailers')}</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/merchandise"
                className="nav-link fw-semibold px-3 d-flex align-items-center gap-1.5 text-white"
                onClick={() => setIsNavCollapsed(true)}
              >
                <i className="bi bi-bag-check-fill text-success"></i>
                <span>{t('navbar.merchandise')}</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/about"
                className="nav-link fw-medium px-2 text-white-50"
                onClick={() => setIsNavCollapsed(true)}
              >
                {t('navbar.about')}
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/contact"
                className="nav-link fw-medium px-2 text-white-50"
                onClick={() => setIsNavCollapsed(true)}
              >
                {t('navbar.contact')}
              </Link>
            </li>
          </ul>

          {/* Enhanced Global Search Bar with Integrated Filter & Live Suggestions */}
          <div
            ref={searchContainerRef}
            className="fv-search-wrapper me-lg-3 my-2 my-lg-0"
          >
            <form onSubmit={handleSearchSubmit} className="w-100">
              <div className="fv-search-group">
                {/* Filter Selector Button */}
                <button
                  type="button"
                  className={`btn fv-search-filter-btn ${isFilterOpen ? 'active' : ''}`}
                  onClick={() => {
                    setIsFilterOpen((prev) => !prev);
                    setIsSuggestionsOpen(false);
                  }}
                  aria-expanded={isFilterOpen}
                  title={t('navbar.searchFilterTitle')}
                >
                  <i className={`bi ${filterMode.icon}`}></i>
                  <span className="fv-search-filter-text">{filterMode.label}</span>
                  <i className={`bi bi-chevron-${isFilterOpen ? 'up' : 'down'}`} style={{ fontSize: '0.62rem' }}></i>
                </button>

                {/* Search Text Input */}
                <input
                  type="search"
                  className="form-control fv-search-input"
                  placeholder={
                    filterMode.id !== 'all'
                      ? t('navbar.searchPlaceholderIn', { label: filterMode.label })
                      : t('navbar.searchPlaceholderDefault')
                  }
                  aria-label={t('navbar.searchAriaLabel')}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (e.target.value.trim().length > 0) {
                      setIsSuggestionsOpen(true);
                    }
                  }}
                  onFocus={() => {
                    if (searchTerm.trim().length > 0) {
                      setIsSuggestionsOpen(true);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setIsSuggestionsOpen(false);
                      setIsFilterOpen(false);
                    }
                  }}
                />

                {/* Clear Button */}
                {searchTerm && (
                  <button
                    type="button"
                    className="btn fv-search-clear-btn"
                    onClick={() => {
                      setSearchTerm('');
                      setIsSuggestionsOpen(false);
                    }}
                    title={t('navbar.clearKeyword')}
                    aria-label={t('navbar.clearKeyword')}
                  >
                    <i className="bi bi-x-circle-fill"></i>
                  </button>
                )}

                {/* Submit Search Button */}
                <button
                  className="btn fv-search-submit-btn"
                  type="submit"
                  aria-label={t('navbar.searchButton')}
                  title={t('navbar.search')}
                >
                  <i className="bi bi-search fs-6"></i>
                </button>
              </div>
            </form>

            {/* Filter Dropdown Menu */}
            {isFilterOpen && (
              <div className="fv-search-filter-dropdown shadow-lg">
                <div className="fv-filter-dropdown-scroll">
                  {/* Reset / All */}
                  <button
                    type="button"
                    className={`fv-filter-item ${filterMode.id === 'all' ? 'active' : ''}`}
                    onClick={() => handleSelectFilter('all', 'all', t('navbar.all'), 'bi-grid-fill')}
                  >
                    <span className="d-flex align-items-center gap-2">
                      <i className="bi bi-grid-fill text-primary"></i>
                      <span>{t('navbar.allUniverses')}</span>
                    </span>
                    {filterMode.id === 'all' && <i className="bi bi-check2 text-primary fw-bold"></i>}
                  </button>

                  <hr className="my-1 border-secondary opacity-25" />

                  {/* Section 1: Categories */}
                  <div className="fv-filter-section-title">
                    <i className="bi bi-compass me-1"></i> {t('navbar.byUniverseCategory')}
                  </div>
                  {CATEGORY_LIST_LOCALIZED.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      className={`fv-filter-item ${filterMode.id === c.id ? 'active' : ''}`}
                      onClick={() => handleSelectFilter('category', c.id, c.label, c.icon)}
                    >
                      <span className="d-flex align-items-center gap-2">
                        <i className={`bi ${c.icon}`} style={{ color: c.accentColor }}></i>
                        <span>{c.label}</span>
                      </span>
                      {filterMode.id === c.id && <i className="bi bi-check2 text-primary fw-bold"></i>}
                    </button>
                  ))}

                  <hr className="my-1 border-secondary opacity-25" />

                  {/* Section 2: Content Types */}
                  <div className="fv-filter-section-title">
                    <i className="bi bi-layers me-1"></i> {t('navbar.byContentType')}
                  </div>
                  {CONTENT_FILTER_TYPES.map((ft) => (
                    <button
                      key={ft.id}
                      type="button"
                      className={`fv-filter-item ${filterMode.id === ft.id ? 'active' : ''}`}
                      onClick={() => handleSelectFilter('type', ft.id, ft.label, ft.icon)}
                    >
                      <span className="d-flex align-items-center gap-2">
                        <i className={`bi ${ft.icon} text-info`}></i>
                        <span>{ft.label}</span>
                      </span>
                      {filterMode.id === ft.id && <i className="bi bi-check2 text-primary fw-bold"></i>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Instant Live Suggestions Dropdown */}
            {isSuggestionsOpen && searchTerm.trim() && (
              <div className="fv-search-suggestions-dropdown shadow-xl">
                {/* Quick Type Filter Bar inside live suggestions */}
                <div className="fv-suggestions-quick-filters">
                  <span
                    className={`fv-quick-chip ${quickFilterType === 'all' ? 'active' : ''}`}
                    onClick={() => setQuickFilterType('all')}
                  >
                    {t('navbar.all')}
                  </span>
                  <span
                    className={`fv-quick-chip ${quickFilterType === 'character' ? 'active' : ''}`}
                    onClick={() => setQuickFilterType('character')}
                  >
                    👤 {t('navbar.filterTypes.character')}
                  </span>
                  <span
                    className={`fv-quick-chip ${quickFilterType === 'article' ? 'active' : ''}`}
                    onClick={() => setQuickFilterType('article')}
                  >
                    📰 {t('navbar.filterTypes.article')}
                  </span>
                  <span
                    className={`fv-quick-chip ${quickFilterType === 'trailer' ? 'active' : ''}`}
                    onClick={() => setQuickFilterType('trailer')}
                  >
                    🎥 {t('navbar.trailers')}
                  </span>
                  <span
                    className={`fv-quick-chip ${quickFilterType === 'merchandise' ? 'active' : ''}`}
                    onClick={() => setQuickFilterType('merchandise')}
                  >
                    🛍️ {t('navbar.filterTypes.merchandise')}
                  </span>
                </div>

                {/* Suggestions List */}
                <div className="fv-suggestions-list">
                  {liveResults.length === 0 ? (
                    <div className="p-3 text-center text-secondary small">
                      <i className="bi bi-search fs-4 d-block mb-1 opacity-50"></i>
                      {t('navbar.noResultsFor', { term: searchTerm })}
                    </div>
                  ) : (
                    liveResults.map((item) => (
                      <div
                        key={`${item.resultType}-${item.id}`}
                        className="fv-suggestion-item"
                        onClick={() => handleSuggestionClick(item.targetUrl)}
                      >
                        {item.thumbnail ? (
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="fv-suggestion-thumb"
                          />
                        ) : (
                          <div className="fv-suggestion-icon-thumb">
                            <i className="bi bi-file-earmark-text"></i>
                          </div>
                        )}
                        <div className="fv-suggestion-info">
                          <div className="fv-suggestion-title">{item.title}</div>
                          <div className="fv-suggestion-meta">
                            <span className={`badge-category badge-category-${item.category}`} style={{ fontSize: '0.62rem', padding: '0.15rem 0.4rem' }}>
                              {item.category?.toUpperCase()}
                            </span>
                            <span>•</span>
                            <span className="text-white-50">{item.resultType}</span>
                          </div>
                        </div>
                        <i className="bi bi-arrow-up-left small text-secondary opacity-75"></i>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer with Full Results Link */}
                <div className="fv-suggestions-footer">
                  <span className="text-secondary small">
                    {t('navbar.resultsFound', { count: totalResultsCount })}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSearchSubmit()}
                  >
                    {t('navbar.viewAll')} <i className="bi bi-arrow-right"></i>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Icons & Theme Switcher */}
          <div className="d-flex align-items-center gap-2 mt-2 mt-lg-0">
            {/* Language Switcher Dropdown */}
            <div ref={languageRef} className={`dropdown ${isLanguageOpen ? 'show' : ''}`}>
              <button
                type="button"
                className="btn position-relative rounded-circle p-2 shadow-xs d-flex align-items-center justify-content-center"
                style={{
                  width: '40px',
                  height: '40px',
                  background: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.05)',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.08)',
                  fontSize: '1.1rem',
                }}
                title={t('navbar.chooseLanguage')}
                aria-label={t('navbar.language')}
                aria-expanded={isLanguageOpen}
                onClick={() => setIsLanguageOpen((open) => !open)}
              >
                {languages.find((l) => l.code === language)?.flag}
              </button>
              <ul
                className={`dropdown-menu dropdown-menu-end border-0 shadow-lg rounded-4 py-2 ${isDark ? 'dropdown-menu-dark' : ''} ${isLanguageOpen ? 'show' : ''}`}
                style={{
                  backgroundColor: isDark ? '#12162a' : '#ffffff',
                  border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
                }}
              >
                {languages.map((l) => (
                  <li key={l.code}>
                    <button
                      type="button"
                      className={`dropdown-item d-flex align-items-center gap-2 py-2 px-3 fw-medium ${language === l.code ? 'active' : ''}`}
                      onClick={() => {
                        setLanguage(l.code);
                        setIsLanguageOpen(false);
                      }}
                    >
                      <span>{l.flag}</span>
                      <span>{l.label}</span>
                      {language === l.code && <i className="bi bi-check2 ms-auto"></i>}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

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
              title={isDark ? t('navbar.switchToLight') : t('navbar.switchToDark')}
              aria-label={t('navbar.toggleTheme')}
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
              title={t('navbar.bookmarksTitle')}
              aria-label={t('navbar.bookmarksAriaLabel')}
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
              title={t('navbar.cartTitle')}
              aria-label={t('navbar.cartAriaLabel')}
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
                    {t('navbar.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`btn btn-sm rounded-pill px-3 ${isDark ? 'btn-outline-light' : 'btn-outline-primary'}`}
                    onClick={() => setIsNavCollapsed(true)}
                  >
                    {t('navbar.login')}
                  </Link>
                  <Link
                    to="/signup"
                    className="btn btn-sm btn-primary-fv px-3 d-none d-sm-inline-block text-white"
                    onClick={() => setIsNavCollapsed(true)}
                  >
                    {t('navbar.signup')}
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

