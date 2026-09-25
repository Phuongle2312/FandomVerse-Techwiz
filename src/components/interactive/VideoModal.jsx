import React, { useEffect } from 'react';

export default function VideoModal({ item, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item || !item.mediaUrl) return null;

  const isLocalVideo =
    item.mediaUrl.endsWith('.mp4') ||
    item.mediaUrl.endsWith('.webm') ||
    item.mediaUrl.startsWith('/GunDam.mp4') ||
    item.mediaUrl.startsWith('/hero-video.mp4') ||
    item.mediaUrl.startsWith('/movies-hero-video.mp4') ||
    (item.mediaUrl.startsWith('/') && !item.mediaUrl.includes('youtube'));

  const isAudioFile =
    item.mediaUrl.endsWith('.mp3') ||
    item.mediaUrl.endsWith('.wav') ||
    item.mediaUrl.endsWith('.ogg') ||
    item.type === 'audio';

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
              aria-label="Đóng video"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body p-0 mt-3">
            {isAudioFile && !isLocalVideo ? (
              <div className="p-4 text-center">
                <div className="mb-3">
                  <i className="bi bi-music-note-beamed text-info fs-1"></i>
                </div>
                <audio controls autoPlay className="w-100" src={item.mediaUrl} />
              </div>
            ) : isLocalVideo ? (
              <div className="ratio ratio-16x9 bg-black">
                <video
                  src={item.mediaUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-100 h-100 object-fit-contain"
                />
              </div>
            ) : (
              <div className="ratio ratio-16x9">
                <iframe
                  src={`${item.mediaUrl}${item.mediaUrl.includes('?') ? '&' : '?'}autoplay=1`}
                  title={item.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
