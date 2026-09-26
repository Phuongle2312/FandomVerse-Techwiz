import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ToastNotification({ toast, onClose, duration = 2000 }) {
  const { t } = useTranslation();
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!toast) {
      setIsExiting(false);
      return;
    }

    setIsExiting(false);
    const toastDuration = toast.duration || duration || 2000;

    // Start fade out animation 250ms before duration ends
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, Math.max(0, toastDuration - 250));

    // Fully dismiss after duration
    const dismissTimer = setTimeout(() => {
      if (onClose) onClose();
    }, toastDuration);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(dismissTimer);
    };
  }, [toast?.id, toast?.message, duration, onClose]);

  if (!toast) return null;

  const bgClass =
    toast.type === 'error'
      ? 'bg-danger text-white'
      : toast.type === 'warning'
      ? 'bg-warning text-dark'
      : 'bg-dark text-white';

  const handleManualClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      if (onClose) onClose();
    }, 200);
  };

  return (
    <div
      className="position-fixed bottom-0 start-50 translate-middle-x p-3"
      style={{
        zIndex: 1100,
        minWidth: '320px',
        maxWidth: '90%',
        transition: 'opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: isExiting ? 0 : 1,
        transform: isExiting ? 'translate(-50%, 16px)' : 'translate(-50%, 0)',
        pointerEvents: isExiting ? 'none' : 'auto',
      }}
    >
      <div
        className={`toast show align-items-center ${bgClass} border-0 shadow-lg rounded-3`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        style={{
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
        }}
      >
        <div className="d-flex align-items-center">
          <div className="toast-body d-flex align-items-center gap-2 py-3 px-3">
            <i className={`bi ${toast.icon || 'bi-info-circle-fill'} fs-5`}></i>
            <span className="fw-medium">{toast.message}</span>
          </div>
          <button
            type="button"
            className="btn-close btn-close-white me-3 m-auto"
            aria-label={t('common.close')}
            onClick={handleManualClose}
          ></button>
        </div>
      </div>
    </div>
  );
}
