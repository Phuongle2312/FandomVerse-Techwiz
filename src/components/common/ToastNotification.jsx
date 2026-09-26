import React from 'react';
import { useTranslation } from 'react-i18next';

export default function ToastNotification({ toast, onClose }) {
  const { t } = useTranslation();
  if (!toast) return null;

  const bgClass =
    toast.type === 'error'
      ? 'bg-danger text-white'
      : toast.type === 'warning'
      ? 'bg-warning text-dark'
      : 'bg-dark text-white';

  return (
    <div
      className="position-fixed bottom-0 start-50 translate-middle-x p-3"
      style={{ zIndex: 1100, minWidth: '320px', maxWidth: '90%' }}
    >
      <div className={`toast show align-items-center ${bgClass} border-0 shadow-lg rounded-3`} role="alert" aria-live="assertive" aria-atomic="true">
        <div className="d-flex align-items-center">
          <div className="toast-body d-flex align-items-center gap-2 py-3 px-3">
            <i className={`bi ${toast.icon || 'bi-info-circle-fill'} fs-5`}></i>
            <span className="fw-medium">{toast.message}</span>
          </div>
          <button
            type="button"
            className="btn-close btn-close-white me-3 m-auto"
            aria-label={t('common.close')}
            onClick={onClose}
          ></button>
        </div>
      </div>
    </div>
  );
}
