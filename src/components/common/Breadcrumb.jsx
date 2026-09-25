import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CATEGORY_LIST } from '../../constants.js';
import { dataService } from '../../services/dataService.js';
import { useTheme } from '../../context/ThemeContext.jsx';

export default function Breadcrumb() {
  const { t } = useTranslation();
  const location = useLocation();
  const path = location.pathname;
  const { isDark } = useTheme();

  // Don't show breadcrumb on Home page
  if (path === '/' || path === '') {
    return null;
  }

  const parts = path.split('/').filter(Boolean);
  const crumbs = [{ label: t('breadcrumb.home'), to: '/' }];

  if (parts[0] === 'category') {
    const categoryId = parts[1];
    const cat = CATEGORY_LIST.find((c) => c.id === categoryId);
    const catLabel = cat ? t(`categories.${cat.id}.label`) : categoryId;
    crumbs.push({ label: catLabel, to: `/category/${categoryId}` });

    if (parts[2] === 'article' && parts[3]) {
      const contentId = parts[3];
      const content = dataService.getContentById(contentId);
      crumbs.push({
        label: content ? content.title : t('breadcrumb.articleDetail'),
        to: `/category/${categoryId}/article/${contentId}`,
      });
    }
  } else if (parts[0] === 'trailers') {
    crumbs.push({ label: t('breadcrumb.trailersHub'), to: '/trailers' });
  } else if (parts[0] === 'merchandise') {
    crumbs.push({ label: t('breadcrumb.merchandiseShop'), to: '/merchandise' });
  } else if (parts[0] === 'bookmarks') {
    crumbs.push({ label: t('breadcrumb.bookmarksNotes'), to: '/bookmarks' });
  } else if (parts[0] === 'search') {
    crumbs.push({ label: t('breadcrumb.searchResults'), to: '/search' });
  } else if (parts[0] === 'contact') {
    crumbs.push({ label: t('breadcrumb.contact'), to: '/contact' });
  } else if (parts[0] === 'about') {
    crumbs.push({ label: t('breadcrumb.about'), to: '/about' });
  } else if (parts[0] === 'login') {
    crumbs.push({ label: t('breadcrumb.login'), to: '/login' });
  } else if (parts[0] === 'signup') {
    crumbs.push({ label: t('breadcrumb.signup'), to: '/signup' });
  } else {
    crumbs.push({ label: t('breadcrumb.genericPage'), to: path });
  }

  return (
    <div className="container-fluid px-3 px-md-4 px-lg-5 pt-3">
      <nav
        aria-label="breadcrumb"
        className="py-2 px-3 rounded-3 mb-4 shadow-sm"
        style={{
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#f8f9fa',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid transparent',
        }}
      >
        <ol className="breadcrumb mb-0 align-items-center">
        {crumbs.map((crumb, idx) => {
          const isLast = idx === crumbs.length - 1;
          return (
            <li
              key={crumb.to + idx}
              className={`breadcrumb-item ${isLast ? 'fw-semibold' : ''}`}
              aria-current={isLast ? 'page' : undefined}
              style={isLast ? { color: isDark ? '#a0a4b8' : '#6c757d' } : undefined}
            >
              {isLast ? (
                <span className="text-truncate d-inline-block" style={{ maxWidth: '300px' }}>
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.to}
                  className="text-decoration-none"
                  style={{ color: isDark ? '#a29bfe' : '#6C5CE7' }}
                >
                  {idx === 0 && <i className="bi bi-house-door me-1"></i>}
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  </div>
);
}
