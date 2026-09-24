import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CATEGORY_LIST } from '../../constants.js';
import { dataService } from '../../services/dataService.js';

export default function Breadcrumb() {
  const location = useLocation();
  const path = location.pathname;

  // Don't show breadcrumb on Home page
  if (path === '/' || path === '') {
    return null;
  }

  const parts = path.split('/').filter(Boolean);
  const crumbs = [{ label: 'Trang chủ', to: '/' }];

  if (parts[0] === 'category') {
    const categoryId = parts[1];
    const cat = CATEGORY_LIST.find((c) => c.id === categoryId);
    const catLabel = cat ? cat.label : categoryId;
    crumbs.push({ label: catLabel, to: `/category/${categoryId}` });

    if (parts[2] === 'article' && parts[3]) {
      const contentId = parts[3];
      const content = dataService.getContentById(contentId);
      crumbs.push({
        label: content ? content.title : 'Chi tiết bài viết',
        to: `/category/${categoryId}/article/${contentId}`,
      });
    }
  } else if (parts[0] === 'trailers') {
    crumbs.push({ label: 'Trung Tâm Trailers', to: '/trailers' });
  } else if (parts[0] === 'merchandise') {
    crumbs.push({ label: 'Gian Hàng Merchandise', to: '/merchandise' });
  } else if (parts[0] === 'bookmarks') {
    crumbs.push({ label: 'Bookmarks & Ghi Chú', to: '/bookmarks' });
  } else if (parts[0] === 'search') {
    crumbs.push({ label: 'Kết Quả Tìm Kiếm', to: '/search' });
  } else if (parts[0] === 'contact') {
    crumbs.push({ label: 'Liên Hệ', to: '/contact' });
  } else if (parts[0] === 'about') {
    crumbs.push({ label: 'Giới Thiệu', to: '/about' });
  } else if (parts[0] === 'login') {
    crumbs.push({ label: 'Đăng Nhập', to: '/login' });
  } else if (parts[0] === 'signup') {
    crumbs.push({ label: 'Đăng Ký', to: '/signup' });
  } else {
    crumbs.push({ label: 'Trang', to: path });
  }

  return (
    <nav aria-label="breadcrumb" className="bg-light py-2 px-3 rounded-3 mb-4 shadow-sm">
      <ol className="breadcrumb mb-0 align-items-center">
        {crumbs.map((crumb, idx) => {
          const isLast = idx === crumbs.length - 1;
          return (
            <li
              key={crumb.to + idx}
              className={`breadcrumb-item ${isLast ? 'active text-secondary fw-semibold' : ''}`}
              aria-current={isLast ? 'page' : undefined}
            >
              {isLast ? (
                <span className="text-truncate d-inline-block" style={{ maxWidth: '300px' }}>
                  {crumb.label}
                </span>
              ) : (
                <Link to={crumb.to} className="text-decoration-none text-primary">
                  {idx === 0 && <i className="bi bi-house-door me-1"></i>}
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
