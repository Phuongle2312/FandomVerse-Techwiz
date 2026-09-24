import React, { useState, useMemo } from 'react';
import { dataService } from '../services/dataService.js';
import { CATEGORY_LIST } from '../constants.js';
import VideoModal from '../components/interactive/VideoModal.jsx';
import EmptyState from '../components/common/EmptyState.jsx';

export default function TrailersHub() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeTrailer, setActiveTrailer] = useState(null);

  const trailers = useMemo(() => {
    return dataService.getTrailersByCategory(selectedCategory, {
      status: selectedStatus,
    });
  }, [selectedCategory, selectedStatus]);

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="font-heading display-6 fw-bold text-dark mb-2 d-flex align-items-center gap-2">
          <i className="bi bi-play-btn-fill text-danger"></i> Trung Tâm Trailers & Teaser
        </h1>
        <p className="text-secondary">
          Cập nhật các đoạn giới thiệu video bom tấn mới nhất từ Anime, Game, Điện ảnh Hollywood, K-Pop và Comics.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="p-3 bg-light rounded-4 border mb-4 d-flex flex-wrap gap-3 align-items-center justify-content-between">
        {/* Category Pills */}
        <div className="d-flex flex-wrap gap-1 align-items-center">
          <span className="small fw-semibold text-secondary me-2">Danh mục:</span>
          <button
            type="button"
            className={`btn btn-sm rounded-pill px-3 py-1 ${
              selectedCategory === 'all' ? 'btn-primary' : 'btn-outline-secondary bg-white'
            }`}
            onClick={() => setSelectedCategory('all')}
          >
            Tất cả
          </button>
          {CATEGORY_LIST.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`btn btn-sm rounded-pill px-3 py-1 ${
                selectedCategory === c.id ? 'btn-primary' : 'btn-outline-secondary bg-white'
              }`}
              onClick={() => setSelectedCategory(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Status Toggle */}
        <div className="d-flex align-items-center gap-2">
          <span className="small fw-semibold text-secondary">Trạng thái:</span>
          <div className="btn-group btn-group-sm" role="group">
            <button
              type="button"
              className={`btn ${selectedStatus === 'all' ? 'btn-dark' : 'btn-outline-secondary bg-white'}`}
              onClick={() => setSelectedStatus('all')}
            >
              Tất cả
            </button>
            <button
              type="button"
              className={`btn ${selectedStatus === 'upcoming' ? 'btn-warning text-dark fw-semibold' : 'btn-outline-secondary bg-white'}`}
              onClick={() => setSelectedStatus('upcoming')}
            >
              ⚡ Sắp chiếu
            </button>
            <button
              type="button"
              className={`btn ${selectedStatus === 'released' ? 'btn-success text-white' : 'btn-outline-secondary bg-white'}`}
              onClick={() => setSelectedStatus('released')}
            >
              ✓ Đã ra mắt
            </button>
          </div>
        </div>
      </div>

      {/* Trailers Grid */}
      {trailers.length === 0 ? (
        <EmptyState
          title="Không có trailer nào phù hợp"
          message="Không có trailer nào khớp với bộ lọc hiện tại. Hãy chọn 'Tất cả' để xem toàn bộ danh sách."
          onAction={() => {
            setSelectedCategory('all');
            setSelectedStatus('all');
          }}
          actionLabel="Xóa bộ lọc"
        />
      ) : (
        <div className="row g-4">
          {trailers.map((t) => (
            <div key={t.id} className="col-lg-4 col-md-6 col-12">
              <div
                className={`card fv-card h-100 border-0 shadow-sm rounded-4 overflow-hidden accent-border-${t.category}`}
                style={{ cursor: 'pointer' }}
                onClick={() => setActiveTrailer(t)}
              >
                {/* Thumbnail with Play Icon */}
                <div className="position-relative overflow-hidden" style={{ height: '210px', backgroundColor: '#000' }}>
                  <img
                    src={t.thumbnail}
                    alt={t.title}
                    className="w-100 h-100 object-fit-cover opacity-85"
                    loading="lazy"
                  />
                  {/* Play Button Overlay */}
                  <div className="position-absolute top-50 start-50 translate-middle">
                    <div
                      className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center shadow-lg"
                      style={{ width: '56px', height: '56px' }}
                    >
                      <i className="bi bi-play-fill fs-2 ms-1"></i>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`position-absolute top-0 end-0 m-2 badge rounded-pill px-3 py-1 ${
                      t.status === 'upcoming' ? 'bg-warning text-dark fw-bold' : 'bg-success text-white'
                    }`}
                  >
                    {t.status === 'upcoming' ? '⚡ SẮP CHIẾU' : '✓ ĐÃ RA MẮT'}
                  </span>
                </div>

                {/* Card Body */}
                <div className="card-body p-3 d-flex flex-column">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className={`badge-category badge-category-${t.category}`} style={{ fontSize: '0.7rem' }}>
                      {t.category.toUpperCase()}
                    </span>
                    <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
                      <i className="bi bi-calendar-event me-1"></i>
                      {t.releaseDate}
                    </span>
                  </div>

                  <h5 className="font-heading fs-6 fw-bold mb-3 text-dark line-clamp-2">
                    {t.title}
                  </h5>

                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger w-100 rounded-pill mt-auto py-2 d-flex align-items-center justify-content-center gap-2"
                  >
                    <i className="bi bi-play-circle"></i> Xem Trailer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Modal */}
      {activeTrailer && (
        <VideoModal item={activeTrailer} onClose={() => setActiveTrailer(null)} />
      )}
    </div>
  );
}
