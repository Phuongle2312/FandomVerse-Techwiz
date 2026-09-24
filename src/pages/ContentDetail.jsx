import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dataService } from '../services/dataService.js';
import { CATEGORY_LIST } from '../constants.js';
import { useBookmarks } from '../context/BookmarkContext.jsx';
import ContentCard from '../components/cards/ContentCard.jsx';
import LightboxGallery from '../components/interactive/LightboxGallery.jsx';
import VideoModal from '../components/interactive/VideoModal.jsx';
import EmptyState from '../components/common/EmptyState.jsx';

export default function ContentDetail() {
  const { categoryId, contentId } = useParams();
  const content = dataService.getContentById(contentId);

  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = content ? isBookmarked(content.id) : false;

  const [lightboxImages, setLightboxImages] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);

  if (!content) {
    return (
      <div className="container-fluid px-3 px-md-4 px-lg-5 py-5">
        <EmptyState
          title="Không tìm thấy bài viết"
          message="Bài viết bạn đang tìm không tồn tại hoặc đã bị xóa."
          actionLabel="Quay lại danh mục"
          onAction={() => (window.location.hash = `#/category/${categoryId || 'anime'}`)}
        />
      </div>
    );
  }

  const category = CATEGORY_LIST.find((c) => c.id === content.category);
  const categoryLabel = category ? category.label : content.category;
  const related = dataService.getRelatedContents(content.category, content.id, 3);

  return (
    <div className="container-fluid px-3 px-md-4 px-lg-5 py-4">
      <div className="row g-4 justify-content-center">
        {/* Main Article Content */}
        <div className="col-lg-9 col-12">
          {/* Article Header */}
          <div className="mb-4">
            <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
              <Link
                to={`/category/${content.category}`}
                className={`badge-category badge-category-${content.category} text-decoration-none`}
              >
                {categoryLabel}
              </Link>
              <span className="text-muted small">
                <i className="bi bi-calendar3 me-1"></i> {content.dateAdded}
              </span>
              <span className="text-muted small">
                <i className="bi bi-person-fill me-1"></i> Ban Biên Tập FandomVerse
              </span>
            </div>

            <h1 className="font-heading display-6 fw-bold text-dark mb-3">
              {content.title}
            </h1>

            <p className="lead text-secondary fw-normal mb-4">
              {content.shortDescription}
            </p>

            {/* Action Bar (Bookmark & Share) */}
            <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded-4 border mb-4">
              <button
                type="button"
                className={`btn btn-sm d-flex align-items-center gap-2 px-3 py-2 rounded-pill ${
                  bookmarked ? 'btn-danger text-white' : 'btn-outline-danger'
                }`}
                onClick={() => toggleBookmark(content)}
              >
                <i className={`bi ${bookmarked ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                <span>{bookmarked ? 'Đã Lưu Vào Bookmark' : 'Lưu Vào Bookmark'}</span>
              </button>

              <Link
                to={`/category/${content.category}`}
                className="btn btn-sm btn-outline-secondary rounded-pill px-3 py-2"
              >
                <i className="bi bi-arrow-left me-1"></i> Trở Về {categoryLabel}
              </Link>
            </div>
          </div>

          {/* Main Featured Image */}
          <div className="rounded-4 overflow-hidden shadow-sm mb-4" style={{ maxHeight: '480px' }}>
            <img
              src={content.thumbnail}
              alt={content.title}
              className="w-100 h-100 object-fit-cover"
            />
          </div>

          {/* Article Body */}
          <div className="article-body bg-white p-4 p-md-5 rounded-4 shadow-sm border mb-5">
            {content.body ? (
              content.body.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="fs-5 leading-relaxed text-secondary mb-4">
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="fs-5 text-secondary">{content.shortDescription}</p>
            )}

            {/* Additional Gallery if available */}
            {content.images && content.images.length > 0 && (
              <div className="mt-5 pt-4 border-top">
                <h4 className="font-heading fw-bold mb-3 d-flex align-items-center gap-2">
                  <i className="bi bi-images text-warning"></i> Thư Viện Hình Ảnh Đính Kèm ({content.images.length})
                </h4>
                <div className="row g-2">
                  {content.images.map((img, i) => (
                    <div key={img + i} className="col-md-4 col-6">
                      <div
                        className="rounded-3 overflow-hidden shadow-xs position-relative"
                        style={{ height: '140px', cursor: 'pointer' }}
                        onClick={() => setLightboxImages(content.images)}
                      >
                        <img src={img} alt={`Ảnh minh họa ${i + 1}`} className="w-100 h-100 object-fit-cover hover-scale" />
                        <div className="position-absolute bottom-0 end-0 m-1 badge bg-dark bg-opacity-75 text-white small">
                          <i className="bi bi-zoom-in"></i>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub Tags */}
            {content.subTags && (
              <div className="d-flex flex-wrap gap-2 mt-4 pt-3 border-top">
                <span className="small text-muted me-2 align-self-center">Từ khóa:</span>
                {content.subTags.map((tag) => (
                  <span key={tag} className="badge bg-light text-secondary border px-3 py-2 rounded-pill">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Related Contents */}
          {related.length > 0 && (
            <div className="mb-5">
              <h3 className="font-heading fw-bold text-dark mb-4">Nội Dung Liên Quan Trong {categoryLabel}</h3>
              <div className="row g-3">
                {related.map((item) => (
                  <div key={item.id} className="col-md-4 col-12">
                    <ContentCard
                      item={item}
                      onOpenGallery={(g) => setLightboxImages(g.images)}
                      onOpenMedia={(v) => setActiveVideo(v)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Gallery Modal */}
      {lightboxImages && (
        <LightboxGallery
          images={lightboxImages}
          title={content.title}
          onClose={() => setLightboxImages(null)}
        />
      )}

      {/* Video Modal */}
      {activeVideo && (
        <VideoModal item={activeVideo} onClose={() => setActiveVideo(null)} />
      )}
    </div>
  );
}
