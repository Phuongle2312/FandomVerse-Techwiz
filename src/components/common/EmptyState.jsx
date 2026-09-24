import React from 'react';

export default function EmptyState({
  title = 'Không tìm thấy nội dung',
  message = 'Hiện tại không có mục nào phù hợp với bộ lọc hoặc từ khóa của bạn.',
  icon = 'bi-inbox',
  actionLabel,
  onAction,
}) {
  return (
    <div className="text-center py-5 px-3">
      <div className="mb-3 text-muted" style={{ fontSize: '3rem' }}>
        <i className={`bi ${icon}`}></i>
      </div>
      <h4 className="fw-semibold text-secondary mb-2">{title}</h4>
      <p className="text-muted mx-auto" style={{ maxWidth: '450px' }}>
        {message}
      </p>
      {actionLabel && onAction && (
        <button className="btn btn-outline-fv mt-3" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
