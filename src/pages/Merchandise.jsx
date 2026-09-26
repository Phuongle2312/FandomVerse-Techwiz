import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { dataService } from '../services/dataService.js';
import { CATEGORY_LIST, PRODUCT_TYPES } from '../constants.js';
import MerchCard from '../components/cards/MerchCard.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ToastNotification from '../components/common/ToastNotification.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function Merchandise() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSort, setSelectedSort] = useState('featured');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [toast, setToast] = useState(null);

  const { setIsCartOpen, cartCount, cartTotal } = useCart();

  const CATEGORY_LIST_LOCALIZED = useMemo(() => CATEGORY_LIST.map((cat) => ({
    ...cat,
    label: t(`categories.${cat.id}.label`) || cat.label,
  })), [t, language]);

  const PRODUCT_TYPES_LOCALIZED = useMemo(() => PRODUCT_TYPES.map((pt) => ({
    ...pt,
    label: t(`productTypes.${pt.id}`) || pt.label,
  })), [t, language]);

  const merchandise = useMemo(() => {
    let items = dataService.getMerchandiseByCategory(selectedCategory, {
      productType: selectedType,
      sort: selectedSort,
    });

    if (searchKeyword.trim()) {
      const q = searchKeyword.toLowerCase().trim();
      items = items.filter((m) =>
        m.name.toLowerCase().includes(q) ||
        m.shortDescription?.toLowerCase().includes(q) ||
        m.category?.toLowerCase().includes(q)
      );
    }

    return items;
  }, [selectedCategory, selectedType, selectedSort, searchKeyword, language]);

  const handleShowToast = (message) => {
    setToast({
      message,
      type: 'success',
      icon: 'bi-bag-check-fill',
    });
  };

  return (
    <div
      className="py-4"
      style={{
        backgroundColor: isDark ? '#0c0f1d' : '#F8F9FC',
        minHeight: 'calc(100vh - 80px)',
        transition: 'background-color 0.3s ease',
      }}
    >
      <div className="container-fluid px-3 px-md-4 px-lg-5">
        {/* Hero Spotlight Promo Banner with Background Image */}
        <div
          className="p-4 p-md-5 rounded-4 shadow-lg mb-4 position-relative overflow-hidden text-white"
          style={{
            border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(108, 92, 231, 0.25)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
          }}
        >
          {/* Background Image Layer */}
          <div
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1563089145-599997674d42?w=1600&auto=format&fit=crop&q=80")',
              backgroundSize: 'cover',
              backgroundPosition: 'center 35%',
              transform: 'scale(1.03)',
              filter: 'blur(1.5px)',
              zIndex: 0,
            }}
          />

          {/* Dark Cinematic Gradient Overlay Scrim for High Contrast Readability */}
          <div
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{
              background: isDark
                ? 'linear-gradient(90deg, rgba(12, 15, 29, 0.94) 0%, rgba(12, 15, 29, 0.82) 55%, rgba(108, 92, 231, 0.45) 100%)'
                : 'linear-gradient(90deg, rgba(18, 22, 42, 0.92) 0%, rgba(18, 22, 42, 0.8) 55%, rgba(108, 92, 231, 0.4) 100%)',
              zIndex: 1,
            }}
          />

          <div className="row align-items-center position-relative" style={{ zIndex: 2 }}>
            <div className="col-lg-8">
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="badge rounded-pill bg-success px-3 py-1 text-white small fw-bold d-inline-flex align-items-center gap-1 shadow-sm">
                  <i className="bi bi-shield-fill-check"></i> {t('merchandise.officialBadge') || '100% Official Licensed'}
                </span>
                <span
                  className="badge rounded-pill px-3 py-1 small fw-semibold text-white"
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <i className="bi bi-truck me-1"></i> {t('merchandise.freeShipping') || 'Free Shipping Demo'}
                </span>
              </div>
              <h1 className="font-heading display-6 fw-bold mb-2 text-white text-shadow-sm">
                <i className="bi bi-shop me-2" style={{ color: '#00b894' }}></i>
                {t('merchandise.title')}
              </h1>
              <p className="lead fs-6 mb-3 text-white-50" style={{ maxWidth: '650px' }}>
                {t('merchandise.subtitle')}
              </p>

              {/* Fast Perks Row */}
              <div className="d-flex align-items-center gap-3 gap-md-4 flex-wrap text-white-50 small" style={{ fontSize: '0.82rem' }}>
                <span className="d-flex align-items-center gap-1.5 text-white-50">
                  <i className="bi bi-stars text-warning fs-6"></i> {t('merchandise.perk1') || '7 Fandom Universes'}
                </span>
                <span className="d-flex align-items-center gap-1.5 text-white-50">
                  <i className="bi bi-box-seam text-info fs-6"></i> {t('merchandise.perk2') || '24+ Exclusive Memorabilia'}
                </span>
                <span className="d-flex align-items-center gap-1.5 text-white-50">
                  <i className="bi bi-heart-fill text-danger fs-6"></i> {t('merchandise.perk3') || 'Premium Collectibles'}
                </span>
              </div>
            </div>

            <div className="col-lg-4 mt-3 mt-lg-0 text-lg-end">
              {/* View Cart Banner Button */}
              <button
                type="button"
                className="btn btn-primary-fv px-4 py-3 rounded-pill d-inline-flex align-items-center gap-2 shadow-lg"
                onClick={() => setIsCartOpen(true)}
                style={{ fontSize: '1rem' }}
              >
                <i className="bi bi-bag-check-fill fs-5"></i>
                <span>{t('merchandise.viewCart', { count: cartCount })}</span>
                {cartTotal > 0 && (
                  <span className="badge bg-white text-primary rounded-pill ms-1 font-monospace px-2.5 py-1">
                    ${cartTotal.toFixed(2)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Category Scroll Chips (Universal) */}
        <div className="fv-chips-scroll mb-3.5 d-flex gap-2 pb-1" style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
          <button
            type="button"
            className={`btn btn-sm rounded-pill px-3.5 py-1.5 fw-semibold transition-normal ${
              selectedCategory === 'all'
                ? 'btn-primary text-white shadow-sm'
                : isDark
                ? 'btn-outline-light border-opacity-25 text-white-50'
                : 'btn-outline-secondary'
            }`}
            onClick={() => setSelectedCategory('all')}
          >
            {t('merchandise.allFandoms')}
          </button>
          {CATEGORY_LIST_LOCALIZED.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`btn btn-sm rounded-pill px-3.5 py-1.5 fw-semibold transition-normal d-inline-flex align-items-center gap-1.5 ${
                selectedCategory === c.id
                  ? 'btn-primary text-white shadow-sm'
                  : isDark
                  ? 'btn-outline-light border-opacity-25 text-white-50'
                  : 'btn-outline-secondary'
              }`}
              onClick={() => setSelectedCategory(c.id)}
            >
              <i className={`bi ${c.icon}`} style={{ color: selectedCategory === c.id ? '#ffffff' : `var(--accent-${c.id})` }}></i>
              <span>{c.label}</span>
            </button>
          ))}
        </div>

        {/* Unified Filter & Search Toolbar */}
        <div
          className="p-3 rounded-4 mb-4 shadow-xs"
          style={{
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#ffffff',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid var(--border-color)',
          }}
        >
          <div className="row g-2.5 align-items-center">
            {/* Search Input */}
            <div className="col-lg-4 col-md-5 col-12">
              <div className="input-group input-group-sm">
                <span
                  className="input-group-text border-end-0"
                  style={{
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#f8f9fa',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : '#ced4da',
                    color: isDark ? '#cbd5e1' : '#6c757d',
                  }}
                >
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control form-control-sm border-start-0"
                  style={{
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#f8f9fa',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : '#ced4da',
                    color: isDark ? '#ffffff' : '#212529',
                  }}
                  placeholder={t('merchandise.searchPlaceholder') || 'Search products...'}
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
                {searchKeyword && (
                  <button
                    className="btn btn-outline-secondary border-start-0"
                    type="button"
                    onClick={() => setSearchKeyword('')}
                  >
                    <i className="bi bi-x"></i>
                  </button>
                )}
              </div>
            </div>

            {/* Product Type Selector */}
            <div className="col-lg-3 col-md-3 col-6">
              <select
                className="form-select form-select-sm"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                style={{
                  backgroundColor: isDark ? '#12162a' : '#ffffff',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : '#ced4da',
                  color: isDark ? '#ffffff' : '#212529',
                  colorScheme: isDark ? 'dark' : 'light',
                }}
              >
                {PRODUCT_TYPES_LOCALIZED.map((pt) => (
                  <option
                    key={pt.id}
                    value={pt.id}
                    style={{
                      backgroundColor: isDark ? '#12162a' : '#ffffff',
                      color: isDark ? '#ffffff' : '#212529',
                    }}
                  >
                    {pt.icon ? `${pt.icon} ` : ''}{pt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Selector */}
            <div className="col-lg-3 col-md-4 col-6">
              <select
                className="form-select form-select-sm"
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                style={{
                  backgroundColor: isDark ? '#12162a' : '#ffffff',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : '#ced4da',
                  color: isDark ? '#ffffff' : '#212529',
                  colorScheme: isDark ? 'dark' : 'light',
                }}
              >
                <option value="featured" style={{ backgroundColor: isDark ? '#12162a' : '#ffffff', color: isDark ? '#ffffff' : '#212529' }}>
                  {t('merchandise.sortFeatured') || '✨ Featured & Popular'}
                </option>
                <option value="rating" style={{ backgroundColor: isDark ? '#12162a' : '#ffffff', color: isDark ? '#ffffff' : '#212529' }}>
                  {t('merchandise.sortRating') || '⭐ Top Rated'}
                </option>
                <option value="price-asc" style={{ backgroundColor: isDark ? '#12162a' : '#ffffff', color: isDark ? '#ffffff' : '#212529' }}>
                  {t('merchandise.sortPriceAsc') || '💵 Price: Low to High'}
                </option>
                <option value="price-desc" style={{ backgroundColor: isDark ? '#12162a' : '#ffffff', color: isDark ? '#ffffff' : '#212529' }}>
                  {t('merchandise.sortPriceDesc') || '💎 Price: High to Low'}
                </option>
              </select>
            </div>

            {/* Reset Filters / Counter */}
            <div className="col-lg-2 col-12 text-md-end d-flex align-items-center justify-content-between justify-content-lg-end gap-2">
              <span className={`small ${isDark ? 'text-white-50' : 'text-muted'}`}>
                {t('merchandise.productsCount', { count: merchandise.length })}
              </span>
              {(selectedCategory !== 'all' || selectedType !== 'all' || selectedSort !== 'featured' || searchKeyword) && (
                <button
                  type="button"
                  className="btn btn-sm btn-link text-decoration-none p-0 text-danger small fw-semibold"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedType('all');
                    setSelectedSort('featured');
                    setSearchKeyword('');
                  }}
                >
                  <i className="bi bi-arrow-counterclockwise me-1"></i>{t('merchandise.reset') || 'Reset'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Products Grid (Balanced 4-col on desktop) */}
        {merchandise.length === 0 ? (
          <EmptyState
            title={t('merchandise.noProductsTitle')}
            message={t('merchandise.noProductsMessage')}
            onAction={() => {
              setSelectedCategory('all');
              setSelectedType('all');
              setSelectedSort('featured');
              setSearchKeyword('');
            }}
            actionLabel={t('trailersHub.clearFilters')}
          />
        ) : (
          <div className="row g-3 g-md-4 fv-merch-grid mb-5">
            {merchandise.map((item) => (
              <div key={item.id} className="col-xl-3 col-lg-4 col-md-6 col-6">
                <MerchCard item={item} onToast={handleShowToast} />
              </div>
            ))}
          </div>
        )}
      </div>

      <ToastNotification toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
