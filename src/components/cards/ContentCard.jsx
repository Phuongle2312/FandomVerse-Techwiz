import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useBookmarks } from '../../context/BookmarkContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { CATEGORY_LIST } from '../../constants.js';

export default function ContentCard({ item, onOpenMedia, onOpenGallery }) {
  const { t } = useTranslation();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { isDark } = useTheme();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const bookmarked = isBookmarked(item.id);

  const category = CATEGORY_LIST.find((c) => c.id === item.category);
  const categoryLabel = category ? t(`categories.${category.id}.label`) : item.category;
  const categoryColor = `var(--accent-${item.category}, #6C5CE7)`;

  const handleBookmarkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: window.location.hash ? window.location.hash.slice(1) : '/' } });
      return;
    }
    toggleBookmark(item);
  };

  const handleCardClick = () => {
    if ((item.type === 'video' || item.type === 'audio') && onOpenMedia) {
      onOpenMedia(item);
    } else if (item.type === 'gallery' && onOpenGallery) {
      onOpenGallery(item);
    } else if (item.type === 'article') {
      navigate(`/category/${item.category}/article/${item.id}`);
    }
  };

  // Type-specific icons & colors
  const typeConfig = {
    video: {
      label: 'VIDEO',
      color: '#ff4757',
      bgGlow: 'rgba(255, 71, 87, 0.45)',
      icon: 'bi-play-fill',
      actionText: 'Xem video',
      actionIcon: 'bi-play-circle',
    },
    gallery: {
      label: `BỘ ẢNH (${item.images?.length || 2})`,
      color: '#feca57',
      bgGlow: 'rgba(254, 202, 87, 0.45)',
      icon: 'bi-images',
      actionText: 'Xem bộ ảnh',
      actionIcon: 'bi-eye',
    },
    audio: {
      label: 'AUDIO / PODCAST',
      color: '#00cec9',
      bgGlow: 'rgba(0, 206, 201, 0.45)',
      icon: 'bi-soundwave',
      actionText: 'Nghe audio',
      actionIcon: 'bi-headphones',
    },
    article: {
      label: 'BÀI VIẾT',
      color: '#a29bfe',
      bgGlow: 'rgba(108, 92, 231, 0.45)',
      icon: 'bi-book-half',
      actionText: 'Đọc chi tiết',
      actionIcon: 'bi-arrow-right-circle',
    },
  }[item.type] || {
    label: 'NỘI DUNG',
    color: '#6C5CE7',
    bgGlow: 'rgba(108, 92, 231, 0.45)',
    icon: 'bi-star-fill',
    actionText: 'Khám phá',
    actionIcon: 'bi-arrow-right',
  };

  return (
    <div
      className={`card fv-card fv-content-card fv-trailer-card-item h-100 overflow-hidden shadow-sm accent-border-${item.category}`}
      style={{
        cursor: 'pointer',
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid var(--border-color)',
        borderRadius: '1.15rem',
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease',
      }}
      onClick={handleCardClick}
    >
      {/* Thumbnail with Trailer-like Dark Gradient & Centered Icon */}
      <div
        className="position-relative overflow-hidden fv-trailer-thumb-wrap"
        style={{ backgroundColor: '#000', height: '190px' }}
      >
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-100 h-100 object-fit-cover"
          style={{
            opacity: 0.88,
            transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          loading="lazy"
        />

        {/* Cinematic Vignette Overlay */}
        <div
          className="position-absolute inset-0 w-100 h-100 top-0 start-0"
          style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(10,13,26,0.75) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Centered Trailer-style Glowing Play/Action Button */}
        <div
          className="position-absolute top-50 start-50 translate-middle"
          style={{ pointerEvents: 'none', zIndex: 3 }}
        >
          <div
            className="fv-trailer-play-icon"
            style={{
              background: typeConfig.color,
              boxShadow: `0 8px 24px ${typeConfig.bgGlow}`,
              color: item.type === 'gallery' ? '#000' : '#ffffff',
            }}
          >
            <i className={`bi ${typeConfig.icon} fs-4`}></i>
          </div>
        </div>

        {/* Category Badge Top-Left */}
        <span
          className="position-absolute top-0 start-0 m-2.5 badge rounded-pill px-2.5 py-1 text-white text-uppercase"
          style={{
            backgroundColor: categoryColor,
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
            zIndex: 4,
          }}
        >
          {categoryLabel}
        </span>

        {/* Format / Type Badge Top-Right */}
        <div
          className="position-absolute top-0 end-0 m-2.5 d-flex align-items-center gap-1.5"
          style={{ zIndex: 4 }}
        >
          <span
            className="badge rounded-pill px-2.5 py-1 text-white small"
            style={{
              background: 'rgba(10, 13, 26, 0.82)',
              backdropFilter: 'blur(8px)',
              border: `1px solid ${typeConfig.color}40`,
              color: typeConfig.color,
              fontSize: '0.68rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
            }}
          >
            {typeConfig.label}
          </span>

          {/* Bookmark Button */}
          <button
            type="button"
            className="btn btn-sm p-1 rounded-circle shadow-sm border-0 d-flex align-items-center justify-content-center"
            style={{
              width: '28px',
              height: '28px',
              background: 'rgba(10, 13, 26, 0.8)',
              backdropFilter: 'blur(8px)',
              color: bookmarked ? '#ff4757' : '#ffffff',
            }}
            onClick={handleBookmarkClick}
            aria-label={bookmarked ? t('common.unsave') : t('common.save')}
            title={bookmarked ? t('common.unsave') : t('common.save')}
          >
            <i className={`bi ${bookmarked ? 'bi-heart-fill' : 'bi-heart'}`} style={{ fontSize: '0.85rem' }}></i>
          </button>
        </div>
      </div>

      {/* Card Info */}
      <div className="p-3 d-flex flex-column flex-grow-1 justify-content-between fv-trailer-card-body">
        <div>
          <h6
            className={`font-heading fw-bold mb-2 ${isDark ? 'text-white' : 'text-dark'}`}
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '2.5rem',
              lineHeight: 1.3,
              fontSize: '0.95rem',
            }}
            title={item.title}
          >
            {item.title}
          </h6>

          {item.shortDescription && (
            <p
              className={`small mb-2 ${isDark ? 'text-white-50' : 'text-secondary'}`}
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                fontSize: '0.82rem',
                lineHeight: 1.35,
              }}
            >
              {item.shortDescription}
            </p>
          )}

          {/* Subtags */}
          {item.subTags && item.subTags.length > 0 && (
            <div className="d-flex flex-wrap gap-1 mb-2">
              {item.subTags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="badge rounded-pill small"
                  style={{
                    fontSize: '0.68rem',
                    background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(108,92,231,0.08)',
                    color: isDark ? '#cbd5e1' : '#6C5CE7',
                    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(108,92,231,0.15)',
                  }}
                >
                  #{typeof tag === 'object' ? tag.vi || tag.en : tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Bar matching Trailer Card */}
        <div className="d-flex align-items-center justify-content-between pt-2 border-top border-white-50 border-opacity-10 small mt-auto">
          <span className={`${isDark ? 'text-white-50' : 'text-muted'}`} style={{ fontSize: '0.78rem' }}>
            <i className="bi bi-calendar3 me-1"></i> {item.dateAdded || '2026'}
          </span>
          <span
            className="fw-bold d-inline-flex align-items-center gap-1.5"
            style={{ color: typeConfig.color, fontSize: '0.82rem' }}
          >
            <span>{typeConfig.actionText}</span>
            <i className={`bi ${typeConfig.actionIcon}`}></i>
          </span>
        </div>
      </div>
    </div>
  );
}
