import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ToastNotification from '../components/common/ToastNotification.jsx';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '', remember: true });
  const [toast, setToast] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setToast({
      message: 'Chế độ demo — không xử lý đăng nhập thật (No-Backend Architecture)',
      type: 'info',
      icon: 'bi-info-circle-fill',
    });
  };

  return (
    <div className="container py-5 d-flex align-items-center justify-content-center" style={{ minHeight: '65vh' }}>
      <div className="card fv-card border-0 shadow-lg rounded-4 p-4 w-100" style={{ maxWidth: '420px' }}>
        <div className="text-center mb-4">
          <span style={{ fontSize: '2.5rem' }}>🌌</span>
          <h3 className="font-heading fw-bold text-dark mt-2 mb-1">Đăng Nhập</h3>
          <p className="text-secondary small mb-0">Truy cập tài khoản người hâm mộ FandomVerse</p>
        </div>

        <div className="alert alert-primary bg-primary-subtle border-0 rounded-3 small py-2 px-3 mb-3">
          <i className="bi bi-info-circle me-1 text-primary"></i> Chế độ minh họa giao diện (Dummy Login) theo yêu cầu SRS §1.6.13.
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">Email hoặc Tên đăng nhập</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <i className="bi bi-envelope"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 bg-light"
                placeholder="fan@fandomverse.io"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label className="form-label small fw-semibold text-secondary mb-0">Mật khẩu</label>
              <span className="small text-muted" style={{ fontSize: '0.75rem' }}>
                Quên mật khẩu?
              </span>
            </div>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <i className="bi bi-lock"></i>
              </span>
              <input
                type="password"
                className="form-control border-start-0 bg-light"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-check mb-4">
            <input
              type="checkbox"
              className="form-check-input"
              id="rememberMe"
              checked={formData.remember}
              onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
            />
            <label className="form-check-label small text-secondary" htmlFor="rememberMe">
              Ghi nhớ đăng nhập trên thiết bị này
            </label>
          </div>

          <button type="submit" className="btn btn-primary-fv w-100 py-2 fw-semibold">
            Đăng Nhập
          </button>
        </form>

        <div className="text-center mt-4 pt-3 border-top small text-muted">
          Chưa có tài khoản?{' '}
          <Link to="/signup" className="text-primary fw-semibold text-decoration-none">
            Đăng ký ngay
          </Link>
        </div>
      </div>

      <ToastNotification toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
