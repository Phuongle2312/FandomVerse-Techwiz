import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function VideoModal({ item, onClose }) {
  const { t } = useTranslation();
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item || !item.mediaUrl) return null;

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1080 }}
      onClick={onClose}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content bg-dark border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="modal-header border-0 pb-0 text-white">
            <h5 className="modal-title font-heading fs-6 fw-bold text-truncate me-3">
              {item.title}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label={t('videoModal.closeAria')}
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body p-0 mt-3">
            <div className="ratio ratio-16x9">
              <iframe
                src={`${item.mediaUrl}?autoplay=1`}
                title={item.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
