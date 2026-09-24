import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container py-5 text-center my-auto">
      <div className="display-1 text-primary fw-bold font-heading mb-3">404</div>
      <h2 className="font-heading fw-bold mb-3">Không Tìm Thấy Trang</h2>
      <p className="text-secondary mx-auto mb-4" style={{ maxWidth: '500px' }}>
        Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển trong vũ trụ FandomVerse. Hãy kiểm tra lại đường dẫn hoặc quay về trang chủ.
      </p>
      <Link to="/" className="btn btn-primary-fv px-4 py-2">
        <i className="bi bi-house-door me-2"></i> Quay Về Trang Chủ
      </Link>
    </div>
  );
}
