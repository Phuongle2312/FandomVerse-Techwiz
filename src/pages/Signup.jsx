import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ToastNotification from '../components/common/ToastNotification.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Signup() {
  const { t } = useTranslation();
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
          <h3 className="font-heading fw-bold text-dark mt-2 mb-1">{t('signup.title')}</h3>
          <p className="text-secondary small mb-0">{t('signup.subtitle')}</p>
        </div>

        <div className="alert alert-primary bg-primary-subtle border-0 rounded-3 small py-2 px-3 mb-3">
          <i className="bi bi-info-circle me-1 text-primary"></i> {t('signup.dummyNotice')}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">{t('signup.nameLabel')}</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <i className="bi bi-person"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 bg-light"
                placeholder={t('common.samplePersonName')}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">{t('common.emailAddressLabel')}</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <i className="bi bi-envelope"></i>
              </span>
              <input
                type="email"
                className="form-control border-start-0 bg-light"
                placeholder={t('common.demoEmailPlaceholder')}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">{t('common.passwordLabel')}</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <i className="bi bi-lock"></i>
              </span>
              <input
                type="password"
                className="form-control border-start-0 bg-light"
                placeholder={t('signup.passwordPlaceholder')}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                minLength={8}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label small fw-semibold text-secondary">{t('signup.fandomInterestLabel')}</label>
            <select
              className="form-select bg-light"
              value={formData.fandomInterest}
              onChange={(e) => setFormData({ ...formData, fandomInterest: e.target.value })}
            >
              <option value="anime">{t('signup.fandomOptions.anime')}</option>
              <option value="gaming">{t('signup.fandomOptions.gaming')}</option>
              <option value="movies">{t('signup.fandomOptions.movies')}</option>
              <option value="tvshows">{t('signup.fandomOptions.tvshows')}</option>
              <option value="kpop">{t('signup.fandomOptions.kpop')}</option>
              <option value="comics">{t('signup.fandomOptions.comics')}</option>
              <option value="manga">{t('signup.fandomOptions.manga')}</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary-fv w-100 py-2 fw-semibold">
            {t('signup.submitButton')}
          </button>
        </form>

        <div className="text-center mt-4 pt-3 border-top small text-muted">
          {t('signup.haveAccount')}{' '}
          <Link to="/login" className="text-primary fw-semibold text-decoration-none">
            {t('footer.login')}
          </Link>
        </div>
      </div>

      <ToastNotification toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
