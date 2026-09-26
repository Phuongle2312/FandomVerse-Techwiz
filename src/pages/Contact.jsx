import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext.jsx';
import ToastNotification from '../components/common/ToastNotification.jsx';

export default function Contact() {
  const { t, i18n } = useTranslation();
  const { isDark } = useTheme();
  const mapLang = i18n.language && i18n.language.startsWith('vi') ? 'vi' : 'en';
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [toast, setToast] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setToast({
      message: t('contact.toastSuccess'),
      type: 'success',
      icon: 'bi-check-circle-fill',
    });
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="container-fluid px-3 px-md-4 px-lg-5 py-4">
      {/* Page Title */}
      <div
        className="position-relative overflow-hidden text-center rounded-4 mb-5 px-3 py-5"
        style={{
          background: isDark
            ? 'radial-gradient(120% 140% at 50% -10%, rgba(108, 92, 231, 0.22) 0%, rgba(12, 15, 29, 0) 55%)'
            : 'linear-gradient(135deg, rgba(108, 92, 231, 0.08) 0%, rgba(255, 107, 129, 0.06) 100%)',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid var(--border-color)',
        }}
      >
        <div className="ambient-glow" style={{ width: '260px', height: '260px', top: '-90px', left: '-70px', background: 'rgba(108, 92, 231, 0.35)' }}></div>
        <div className="ambient-glow" style={{ width: '220px', height: '220px', bottom: '-80px', right: '-50px', background: 'rgba(255, 107, 129, 0.3)' }}></div>

        <div className="position-relative" style={{ zIndex: 1 }}>
          <div
            className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-2"
            style={{
              background: isDark ? 'rgba(108, 92, 231, 0.2)' : 'rgba(108, 92, 231, 0.1)',
              color: isDark ? '#a29bfe' : '#6C5CE7',
              border: isDark ? '1px solid rgba(108, 92, 231, 0.3)' : 'none',
            }}
          >
            <i className="bi bi-envelope-heart-fill"></i>
            <span className="small fw-bold text-uppercase">{t('contact.badge')}</span>
          </div>
          <h1 className="font-heading fw-bold display-6 text-dark mb-2">{t('contact.title')}</h1>
          <p className="text-secondary mx-auto mb-4" style={{ maxWidth: '600px' }}>
            {t('contact.subtitle')}
          </p>

          <div className="d-flex flex-wrap justify-content-center gap-2">
            <span
              className="badge rounded-pill px-3 py-2 d-inline-flex align-items-center gap-2 fw-semibold"
              style={{
                background: isDark ? 'rgba(255, 255, 255, 0.06)' : '#ffffff',
                color: isDark ? '#e2e8f0' : '#2D3436',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid var(--border-color)',
              }}
            >
              <i className="bi bi-clock-history text-warning"></i> {t('contact.chipResponse')}
            </span>
            <span
              className="badge rounded-pill px-3 py-2 d-inline-flex align-items-center gap-2 fw-semibold"
              style={{
                background: isDark ? 'rgba(255, 255, 255, 0.06)' : '#ffffff',
                color: isDark ? '#e2e8f0' : '#2D3436',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid var(--border-color)',
              }}
            >
              <i className="bi bi-stars" style={{ color: 'var(--color-primary)' }}></i> {t('contact.chipCommunity')}
            </span>
            <span
              className="badge rounded-pill px-3 py-2 d-inline-flex align-items-center gap-2 fw-semibold"
              style={{
                background: isDark ? 'rgba(255, 255, 255, 0.06)' : '#ffffff',
                color: isDark ? '#e2e8f0' : '#2D3436',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid var(--border-color)',
              }}
            >
              <i className="bi bi-shield-check" style={{ color: 'var(--color-success)' }}></i> {t('contact.chipSecure')}
            </span>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-5">
        {/* Contact Form */}
        <div className="col-lg-6">
          <div className="card fv-card border-0 shadow-sm rounded-4 p-4 h-100 d-flex flex-column">
            <div
              style={{
                height: '4px',
                margin: '-1.5rem -1.5rem 1.5rem',
                borderRadius: '1rem 1rem 0 0',
                background: 'linear-gradient(90deg, #6C5CE7 0%, #FF6B81 100%)',
              }}
            ></div>
            <h4 className="font-heading fw-bold text-primary mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-chat-square-dots"></i> {t('contact.formTitle')}
            </h4>
            <form onSubmit={handleSubmit} className="d-flex flex-column flex-grow-1">
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">{t('contact.nameLabel')}</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted">
                    <i className="bi bi-person"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0 bg-light"
                    placeholder={t('common.samplePersonName')}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">{t('contact.subjectLabel')}</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted">
                    <i className="bi bi-tag"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0 bg-light"
                    placeholder={t('contact.subjectPlaceholder')}
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold text-secondary">{t('contact.messageLabel')}</label>
                <textarea
                  className="form-control bg-light"
                  rows="4"
                  placeholder={t('contact.messagePlaceholder')}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary-fv px-4 py-2 mt-auto align-self-start">
                <i className="bi bi-send me-2"></i> {t('contact.sendButton')}
              </button>
            </form>
          </div>
        </div>

        {/* Contact Information & GPS details */}
        <div className="col-lg-6">
          <div className="card fv-card border-0 shadow-sm rounded-4 p-4 h-100">
            <div
              style={{
                height: '4px',
                margin: '-1.5rem -1.5rem 1.5rem',
                borderRadius: '1rem 1rem 0 0',
                background: 'linear-gradient(90deg, #FF6B81 0%, #6C5CE7 100%)',
              }}
            ></div>
            <h4 className="font-heading fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-geo-alt-fill text-danger"></i> {t('contact.infoTitle')}
            </h4>

            <div className="d-flex flex-column gap-3 mb-4">
              <div className="d-flex align-items-start gap-3 p-3 bg-light rounded-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center shadow-xs flex-shrink-0"
                  style={{
                    width: '44px',
                    height: '44px',
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'var(--bg-surface-alt)',
                    border: '1.5px solid var(--color-primary)',
                    boxShadow: '0 0 14px rgba(108, 92, 231, 0.35)',
                  }}
                >
                  <i className="bi bi-building fs-5" style={{ color: 'var(--color-primary)' }}></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1">{t('contact.addressTitle')}</h6>
                  <p className="text-secondary small mb-0">
                    {t('contact.addressValue')}
                  </p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3 p-3 bg-light rounded-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center shadow-xs flex-shrink-0"
                  style={{
                    width: '44px',
                    height: '44px',
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'var(--bg-surface-alt)',
                    border: '1.5px solid var(--color-success)',
                    boxShadow: '0 0 14px rgba(0, 184, 148, 0.35)',
                  }}
                >
                  <i className="bi bi-compass fs-5" style={{ color: 'var(--color-success)' }}></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1">{t('contact.gpsTitle')}</h6>
                  <p className="text-secondary small mb-0 font-monospace">
                    {t('contact.latitudeLabel')} <strong>21.0368° N</strong>
                    <br />
                    {t('contact.longitudeLabel')} <strong>105.8195° E</strong>
                  </p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3 p-3 bg-light rounded-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center shadow-xs flex-shrink-0"
                  style={{
                    width: '44px',
                    height: '44px',
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'var(--bg-surface-alt)',
                    border: '1.5px solid var(--color-info)',
                    boxShadow: '0 0 14px rgba(9, 132, 227, 0.35)',
                  }}
                >
                  <i className="bi bi-telephone-outbound fs-5" style={{ color: 'var(--color-info)' }}></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1">{t('contact.channelTitle')}</h6>
                  <p className="text-secondary small mb-0">
                    {t('contact.hotlineLabel')} <strong>+84 (024) 3762 3456</strong>
                    <br />
                    {t('contact.supportEmailLabel')} <strong>support@fandomverse.techwir.vn</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Embedded Google Maps iframe */}
            <div className="rounded-3 overflow-hidden border shadow-xs" style={{ height: '220px' }}>
              <iframe
                title={t('contact.mapTitle')}
                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.924403889028!2d105.81729867597148!3d21.03571068753896!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab0d127a01e7%3A0xab069cd4f9143592!2zMjg1IMSQ4buZaSBD4bqlbiwgTGnhu4d1IEdpYWksIEJhIMSQw6xuaCwgSMOgIE7hu5lpLCBWaeG7h3QgTmFt!5e0!3m2!1s${mapLang}!2s!4v1711200000000!5m2!1s${mapLang}!2s`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      <ToastNotification toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
