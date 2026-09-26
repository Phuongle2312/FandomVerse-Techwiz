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
    if ((item.type === 'video' || item.type === 'audio') && item.mediaUrl && onOpenMedia) {
      onOpenMedia(item);
    } else if (item.type === 'gallery' && item.images && item.images.length > 0 && onOpenGallery) {
      onOpenGallery(item);
    }
  };

  return (
    <div
      className={`card fv-card fv-content-card h-100 accent-border-${item.category} overflow-hidden`}
      style={{
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid var(--border-color)',
        boxShadow: isDark ? '0 4px 20px rgba(0, 0, 0, 0.25)' : '0 4px 20px rgba(0, 0, 0, 0.06)',
      }}
    >
      {/* Thumbnail Container */}
      <div className="position-relative overflow-hidden fv-content-card-thumb" style={{ backgroundColor: '#181b30' }}>
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-100 h-100 object-fit-cover"
          loading="lazy"
        />

        {/* Bookmark Action Button */}
        <button
          type="button"
          className="btn btn-sm position-absolute top-0 end-0 m-2 rounded-circle shadow-sm fv-bookmark-btn"
          style={{
            zIndex: 2,
            background: isDark ? 'rgba(12, 15, 29, 0.75)' : 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(8px)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)',
          }}
          onClick={handleBookmarkClick}
          aria-label={bookmarked ? t('common.unsave') : t('common.save')}
          title={bookmarked ? t('common.unsave') : t('common.save')}
        >
          <i className={`bi ${bookmarked ? 'bi-heart-fill text-danger' : isDark ? 'bi-heart text-white' : 'bi-heart text-dark'}`}></i>
        </button>

        {/* Content Type Badge */}
        {item.type !== 'article' && (
          <span className="position-absolute bottom-0 start-0 m-2 badge bg-dark bg-opacity-75 rounded-pill px-2 py-1 text-white small">
            {item.type === 'video' && <i className="bi bi-play-circle-fill me-1 text-danger"></i>}
            {item.type === 'audio' && <i className="bi bi-soundwave me-1 text-info"></i>}
            {item.type === 'gallery' && <i className="bi bi-images me-1 text-warning"></i>}
            {item.type.toUpperCase()}
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="card-body d-flex flex-column fv-content-card-body p-3">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span className={`badge-category badge-category-${item.category}`}>
            {categoryLabel}
          </span>
          <span className={`small ${isDark ? 'text-white-50' : 'text-muted'}`} style={{ fontSize: '0.75rem' }}>
            <i className="bi bi-calendar3 me-1"></i>
            {item.dateAdded}
          </span>
        </div>

        <h5 className="card-title font-heading fw-bold mb-2 line-clamp-2">
          {item.type === 'article' ? (
            <Link
              to={`/category/${item.category}/article/${item.id}`}
              className={`text-decoration-none hover-text-primary ${isDark ? 'text-white' : 'text-dark'}`}
            >
              {item.title}
            </Link>
          ) : (
            <span
              style={{ cursor: 'pointer' }}
              className={`hover-text-primary ${isDark ? 'text-white' : 'text-dark'}`}
              onClick={handleCardClick}
            >
              {item.title}
            </span>
          )}
        </h5>

        {/* Subtags */}
        {item.subTags && item.subTags.length > 0 && (
          <div className="d-flex flex-wrap gap-1 mb-3">
            {item.subTags.map((tag) => (
              <span
                key={tag}
                className="badge rounded-pill small"
                style={{
                  fontSize: '0.7rem',
                  background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(108,92,231,0.08)',
                  color: isDark ? '#a29bfe' : '#6C5CE7',
                  border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(108,92,231,0.15)',
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Card Footer Action */}
        <div
          className="mt-auto pt-2 d-flex align-items-center justify-content-between"
          style={{
            borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.08)',
          }}
        >
          {item.type === 'article' ? (
            <Link
              to={`/category/${item.category}/article/${item.id}`}
              className="btn btn-sm fw-semibold p-0 text-decoration-none d-flex align-items-center gap-1"
              style={{ color: '#6C5CE7' }}
            >
              {t('common.viewDetails')} <i className="bi bi-arrow-right"></i>
            </Link>
          ) : item.type === 'video' ? (
            <button
              type="button"
              className="btn btn-sm btn-outline-danger rounded-pill px-3 py-1"
              onClick={handleCardClick}
            >
              <i className="bi bi-play-fill me-1"></i> {t('common.playVideo')}
            </button>
          ) : item.type === 'gallery' ? (
            <button
              type="button"
              className="btn btn-sm btn-outline-warning rounded-pill px-3 py-1"
              onClick={handleCardClick}
            >
              <i className="bi bi-eye-fill me-1"></i> {t('cards.content.viewGalleryCount', { count: item.images?.length || 0 })}
            </button>
          ) : item.type === 'audio' ? (
            <button
              type="button"
              className="btn btn-sm btn-outline-info rounded-pill px-3 py-1"
              onClick={handleCardClick}
            >
              <i className="bi bi-soundwave me-1"></i> {t('common.audioTrack')}
            </button>
          ) : (
            <span className={`small ${isDark ? 'text-white-50' : 'text-muted'}`}>{t('common.audioTrack')}</span>
          )}
        </div>
      </div>
    </div>
  );
}

