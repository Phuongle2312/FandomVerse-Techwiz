import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ToastNotification from '../components/common/ToastNotification.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', fandomInterest: 'anime' });
  const [toast, setToast] = useState(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = register(formData);
    if (result.success) {
      navigate('/');
    } else {
      setToast({
        message: result.message,
        type: 'error',
        icon: 'bi-exclamation-triangle-fill',
      });
    }
  };

  return (
    <div className="container py-5 d-flex align-items-center justify-content-center" style={{ minHeight: '70vh' }}>
      <div className="card fv-card border-0 shadow-lg rounded-4 p-4 w-100" style={{ maxWidth: '440px' }}>
        <div className="text-center mb-4">
          <span style={{ fontSize: '2.5rem' }}>🌌</span>
          <h3 className="font-heading fw-bold text-dark mt-2 mb-1">Tạo Tài Khoản</h3>
          <p className="text-secondary small mb-0">Gia nhập cộng đồng người hâm mộ FandomVerse</p>
        </div>

        <div className="alert alert-primary bg-primary-subtle border-0 rounded-3 small py-2 px-3 mb-3">
          <i className="bi bi-info-circle me-1 text-primary"></i> Chế độ minh họa giao diện (Dummy Signup) theo yêu cầu SRS §1.6.13.
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">Họ và tên</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <i className="bi bi-person"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 bg-light"
                placeholder="Nguyễn Văn A"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">Địa chỉ Email</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <i className="bi bi-envelope"></i>
              </span>
              <input
                type="email"
                className="form-control border-start-0 bg-light"
                placeholder="fan@fandomverse.io"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">Mật khẩu</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <i className="bi bi-lock"></i>
              </span>
              <input
                type="password"
                className="form-control border-start-0 bg-light"
                placeholder="Tối thiểu 8 ký tự"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                minLength={8}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label small fw-semibold text-secondary">Fandom bạn quan tâm nhất</label>
            <select
              className="form-select bg-light"
              value={formData.fandomInterest}
              onChange={(e) => setFormData({ ...formData, fandomInterest: e.target.value })}
            >
              <option value="anime">Anime (Hoạt hình Nhật Bản)</option>
              <option value="gaming">Gaming (Trò chơi điện tử)</option>
              <option value="movies">Movies (Điện ảnh Hollywood)</option>
              <option value="tvshows">TV Shows (Phim truyền hình)</option>
              <option value="kpop">K-Pop (Âm nhạc thần tượng)</option>
              <option value="comics">Comics (Truyện tranh phương Tây)</option>
              <option value="manga">Manga (Truyện tranh Nhật Bản)</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary-fv w-100 py-2 fw-semibold">
            Đăng Ký Tài Khoản
          </button>
        </form>

        <div className="text-center mt-4 pt-3 border-top small text-muted">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-primary fw-semibold text-decoration-none">
            Đăng nhập
          </Link>
        </div>
      </div>

      <ToastNotification toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
