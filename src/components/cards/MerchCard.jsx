import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../context/CartContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { CATEGORY_LIST } from '../../constants.js';

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80';

export default function MerchCard({ item, onToast }) {
  const { t } = useTranslation();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [isAdded, setIsAdded] = useState(false);
  const [imgSrc, setImgSrc] = useState(item.image);

  const category = CATEGORY_LIST.find((c) => c.id === item.category);
  const categoryLabel = category ? t(`categories.${category.id}.label`) : item.category;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      if (onToast) {
        onToast(t('cards.merch.loginToAddToCart'));
      }
      navigate('/login', { state: { from: window.location.hash ? window.location.hash.slice(1) : '/merchandise' } });
      return;
    }

    addItem(item.id, 1);
    setIsAdded(true);
    if (onToast) {
      onToast(t('cards.merch.addedToast', { name: item.name }));
    }
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  const handleImageError = () => {
    if (imgSrc !== DEFAULT_FALLBACK_IMAGE) {
      setImgSrc(DEFAULT_FALLBACK_IMAGE);
    }
  };

  return (
    <div
      className="card fv-card fv-merch-card h-100 border-0 shadow-sm overflow-hidden d-flex flex-column"
      style={{
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid var(--border-color)',
        boxShadow: isDark ? '0 4px 20px rgba(0, 0, 0, 0.25)' : '0 4px 20px rgba(0, 0, 0, 0.06)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
      }}
    >
      {/* Product Image 1:1 ratio */}
      <div className="position-relative overflow-hidden fv-merch-thumb-wrap" style={{ paddingTop: '100%', backgroundColor: '#181b30' }}>
        <img
          src={imgSrc}
          alt={item.name}
          onError={handleImageError}
          className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover fv-merch-img"
          loading="lazy"
        />

        {/* Top-left: Product Type Badge */}
        <span
          className="position-absolute top-0 start-0 m-2 badge bg-dark bg-opacity-75 text-white rounded-pill px-2.5 py-1 small"
          style={{ fontSize: '0.68rem', backdropFilter: 'blur(6px)', zIndex: 2 }}
        >
          {item.productType?.toUpperCase()}
        </span>

        {/* Top-right: Promotional Tag if present */}
        {item.badge && (
          <span
            className="position-absolute top-0 end-0 m-2 badge rounded-pill px-2.5 py-1 text-white small fw-semibold shadow-sm"
            style={{
              fontSize: '0.68rem',
              background: 'linear-gradient(135deg, #FF6B81 0%, #FF4757 100%)',
              zIndex: 2,
            }}
          >
            {item.badge}
          </span>
        )}
      </div>

      {/* Product Details */}
      <div className="card-body p-3 d-flex flex-column flex-grow-1">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span className={`badge-category badge-category-${item.category}`}>
            {categoryLabel}
          </span>
          {item.rating && (
            <span className="small d-inline-flex align-items-center gap-1 text-warning fw-semibold" style={{ fontSize: '0.78rem' }}>
              <i className="bi bi-star-fill"></i>
              <span className={isDark ? 'text-white' : 'text-dark'}>{item.rating}</span>
              {item.reviewsCount && (
                <span className={`small fw-normal ${isDark ? 'text-white-50' : 'text-muted'}`}>({item.reviewsCount})</span>
              )}
            </span>
          )}
        </div>

        <h5
          className={`card-title font-heading fs-6 fw-bold mb-1 line-clamp-2 ${isDark ? 'text-white' : 'text-dark'}`}
          title={item.name}
          style={{ minHeight: '2.5rem', lineHeight: 1.35 }}
        >
          {item.name}
        </h5>

        <p className={`card-text small flex-grow-1 line-clamp-2 mb-3 ${isDark ? 'text-white-50' : 'text-secondary'}`} style={{ fontSize: '0.82rem' }}>
          {item.shortDescription}
        </p>

        {/* Price and Add to Cart */}
        <div
          className="mt-auto pt-2.5 border-top d-flex flex-column gap-2"
          style={{ borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)' }}
        >
          <div className="d-flex align-items-baseline gap-1.5">
            <span className="fs-5 fw-bold font-heading" style={{ color: '#FF6B81' }}>
              ${item.price.toFixed(2)}
            </span>
            {item.priceMax && (
              <span className={`small fw-medium ${isDark ? 'text-white-50' : 'text-secondary'}`} style={{ fontSize: '0.75rem' }}>
                - ${item.priceMax.toFixed(2)}
              </span>
            )}
            <span className="ms-auto badge bg-success bg-opacity-10 text-success rounded-pill px-2 py-0.5 small" style={{ fontSize: '0.68rem' }}>
              <i className="bi bi-check2 me-0.5"></i>{t('cards.merch.inStock') || 'In Stock'}
            </span>
          </div>

          <button
            type="button"
            className={`btn w-100 py-2 rounded-pill fw-semibold shadow-xs d-flex align-items-center justify-content-center gap-2 fv-merch-action-btn ${
              isAdded
                ? 'btn-success text-white'
                : 'text-white'
            }`}
            style={{
              fontSize: '0.875rem',
              background: isAdded
                ? '#00b894'
                : 'linear-gradient(135deg, #6C5CE7 0%, #FF6B81 100%)',
              border: 'none',
              transition: 'all 0.25s ease',
            }}
            onClick={handleAddToCart}
            disabled={isAdded}
          >
            <i className={`bi ${isAdded ? 'bi-check-circle-fill fs-6' : 'bi-bag-plus-fill fs-6'}`}></i>
            <span>{isAdded ? t('cards.merch.added') : t('cards.merch.addToCart')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
