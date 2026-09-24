import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORY_LIST } from '../constants.js';
import { dataService } from '../services/dataService.js';
import ContentCard from '../components/cards/ContentCard.jsx';
import EventCard from '../components/cards/EventCard.jsx';
import LightboxGallery from '../components/interactive/LightboxGallery.jsx';
import VideoModal from '../components/interactive/VideoModal.jsx';

export default function Home() {
  const featuredContents = dataService.getFeaturedContents();
  const latestTrailers = dataService.getAllTrailers().slice(0, 3);
  const upcomingEvents = dataService.getAllEvents().filter((e) => e.date >= new Date().toISOString().split('T')[0]).slice(0, 3);

  const [lightboxImages, setLightboxImages] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);

  const scrollToCategories = () => {
    const el = document.getElementById('category-grid-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section
        className="py-5 text-center text-lg-start position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(108, 92, 231, 0.08) 0%, rgba(255, 107, 129, 0.08) 100%)',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <div className="container py-4 py-lg-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-7 col-12">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-white shadow-xs border mb-3">
                <span className="badge bg-primary rounded-pill">Web Innovation</span>
                <span className="small text-secondary fw-medium">Nền tảng kết nối người hâm mộ toàn cầu</span>
              </div>

              <h1 className="font-heading display-4 fw-bold text-dark mb-3 lh-sm">
                Khám Phá <span className="text-primary">Vũ Trụ Fandom</span> Đa Chiều Của Bạn
              </h1>

              <p className="fs-5 text-secondary mb-4 leading-relaxed" style={{ maxWidth: '600px' }}>
                Hợp nhất 7 thế giới: Anime, Gaming, Phim ảnh, TV Shows, K-Pop, Comics và Manga trong một nền tảng trực quan, tốc độ cao và đầy cảm hứng.
              </p>

              <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start">
                <button
                  type="button"
                  className="btn btn-primary-fv btn-lg px-4 py-3 d-flex align-items-center gap-2 shadow-sm"
                  onClick={scrollToCategories}
                >
                  <span>Khám Phá Ngay</span>
                  <i className="bi bi-arrow-down-circle"></i>
                </button>
                <Link
                  to="/trailers"
                  className="btn btn-outline-fv btn-lg px-4 py-3 d-flex align-items-center gap-2"
                >
                  <i className="bi bi-play-circle text-danger"></i>
                  <span>Xem Trailers Mới</span>
                </Link>
              </div>
            </div>

            {/* Hero Visual Collage */}
            <div className="col-lg-5 col-12 d-none d-lg-block">
              <div className="position-relative">
                <div className="row g-3">
                  <div className="col-6">
                    <img
                      src="https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=80"
                      alt="Anime Fandom"
                      className="w-100 rounded-4 shadow-md object-fit-cover mb-3"
                      style={{ height: '220px' }}
                    />
                    <img
                      src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80"
                      alt="Gaming Fandom"
                      className="w-100 rounded-4 shadow-md object-fit-cover"
                      style={{ height: '170px' }}
                    />
                  </div>
                  <div className="col-6 pt-4">
                    <img
                      src="https://images.unsplash.com/photo-1635863138275-d9b33299680b?w=500&auto=format&fit=crop&q=80"
                      alt="Movie Superhero"
                      className="w-100 rounded-4 shadow-md object-fit-cover mb-3"
                      style={{ height: '170px' }}
                    />
                    <img
                      src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=80"
                      alt="K-Pop Concert"
                      className="w-100 rounded-4 shadow-md object-fit-cover"
                      style={{ height: '220px' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 7 CATEGORY HUBS GRID */}
      <section id="category-grid-section" className="py-5 container">
        <div className="text-center mb-5">
          <h2 className="font-heading fw-bold display-6 text-dark mb-2">7 Danh Mục Fandom Nổi Bật</h2>
          <p className="text-secondary mx-auto" style={{ maxWidth: '550px' }}>
            Lựa chọn vũ trụ đam mê của bạn để đắm chìm vào những câu chuyện hấp dẫn, nhân vật biểu tượng và sự kiện đáng nhớ.
          </p>
        </div>

        <div className="row g-4">
          {CATEGORY_LIST.map((cat) => (
            <div key={cat.id} className="col-xl-3 col-lg-4 col-md-6 col-12">
              <Link
                to={`/category/${cat.id}`}
                className={`card fv-card h-100 p-4 text-decoration-none accent-border-${cat.id} border-0 shadow-sm`}
              >
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: '54px',
                      height: '54px',
                      backgroundColor: 'var(--bg-surface-alt)',
                    }}
                  >
                    <i className={`bi ${cat.icon} fs-3 text-primary`}></i>
                  </div>
                  <h4 className="font-heading fw-bold text-dark mb-0">{cat.label}</h4>
                </div>
                <p className="text-secondary small mb-3 flex-grow-1 leading-relaxed">
                  {cat.description}
                </p>
                <div className="d-flex align-items-center justify-content-between text-primary small fw-semibold pt-2 border-top">
                  <span>Khám phá ngay</span>
                  <i className="bi bi-chevron-right"></i>
                </div>
              </Link>
            </div>
          ))}

          {/* 8th Card: Quick Link to Merchandise */}
          <div className="col-xl-3 col-lg-4 col-md-6 col-12">
            <Link
              to="/merchandise"
              className="card fv-card h-100 p-4 text-decoration-none border-0 shadow-sm bg-primary text-white"
            >
              <div className="d-flex align-items-center gap-3 mb-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center bg-white text-primary"
                  style={{ width: '54px', height: '54px' }}
                >
                  <i className="bi bi-bag-check-fill fs-3"></i>
                </div>
                <h4 className="font-heading fw-bold text-white mb-0">Gian Hàng</h4>
              </div>
              <p className="text-white-50 small mb-3 flex-grow-1 leading-relaxed">
                Hàng trăm mô hình Figure, áo thun, lightstick và phụ kiện chính hãng đang chờ đón bạn.
              </p>
              <div className="d-flex align-items-center justify-content-between text-white small fw-semibold pt-2 border-top border-white-50">
                <span>Vào Merchandise</span>
                <i className="bi bi-arrow-right"></i>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. FEATURED CONTENTS SHOWCASE */}
      <section className="py-5 bg-light border-top border-bottom">
        <div className="container">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-2">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="badge bg-warning text-dark fw-bold">SPOTLIGHT</span>
                <h2 className="font-heading fw-bold text-dark mb-0">Nội Dung Tiêu Điểm</h2>
              </div>
              <p className="text-secondary small mb-0">Các bài viết chuyên sâu và media nổi bật được tuyển chọn</p>
            </div>
          </div>

          <div className="row g-4">
            {featuredContents.slice(0, 6).map((item) => (
              <div key={item.id} className="col-lg-4 col-md-6 col-12">
                <ContentCard
                  item={item}
                  onOpenGallery={(g) => setLightboxImages(g.images)}
                  onOpenMedia={(v) => setActiveVideo(v)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. LATEST TRAILERS SECTION */}
      <section className="py-5 container">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-2">
          <div>
            <h2 className="font-heading fw-bold text-dark mb-1 d-flex align-items-center gap-2">
              <i className="bi bi-play-circle-fill text-danger"></i> Trailer Bom Tấn Mới Nhất
            </h2>
            <p className="text-secondary small mb-0">Những thước phim hé lộ các siêu phẩm sắp bùng nổ</p>
          </div>
          <Link to="/trailers" className="btn btn-sm btn-outline-danger rounded-pill px-3 py-2 fw-semibold">
            Xem tất cả Trailer <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>

        <div className="row g-4">
          {latestTrailers.map((t) => (
            <div key={t.id} className="col-lg-4 col-md-6 col-12">
              <div
                className={`card fv-card h-100 border-0 shadow-sm rounded-4 overflow-hidden accent-border-${t.category}`}
                style={{ cursor: 'pointer' }}
                onClick={() => setActiveVideo(t)}
              >
                <div className="position-relative" style={{ height: '200px', backgroundColor: '#000' }}>
                  <img src={t.thumbnail} alt={t.title} className="w-100 h-100 object-fit-cover opacity-85" />
                  <div className="position-absolute top-50 start-50 translate-middle">
                    <div className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center shadow-lg" style={{ width: '50px', height: '50px' }}>
                      <i className="bi bi-play-fill fs-3 ms-1"></i>
                    </div>
                  </div>
                  <span className="position-absolute top-0 end-0 m-2 badge bg-dark bg-opacity-75 text-white small">
                    {t.category.toUpperCase()}
                  </span>
                </div>
                <div className="p-3">
                  <h6 className="font-heading fw-bold text-dark mb-1 line-clamp-1">{t.title}</h6>
                  <span className="text-muted small">Khởi chiếu: {t.releaseDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. UPCOMING EVENTS HIGHLIGHT */}
      <section className="py-5 bg-white border-top">
        <div className="container">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-2">
            <div>
              <h2 className="font-heading fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                <i className="bi bi-calendar-event text-primary"></i> Sự Kiện Fandom Sắp Diễn Ra
              </h2>
              <p className="text-secondary small mb-0">Các ngày hội văn hóa, đại nhạc hội và triển lãm quy mô quốc tế</p>
            </div>
          </div>

          <div className="row g-3">
            {upcomingEvents.map((evt) => (
              <div key={evt.id} className="col-lg-4 col-md-6 col-12">
                <EventCard event={evt} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modals */}
      {lightboxImages && (
        <LightboxGallery
          images={lightboxImages}
          title="Thư viện ảnh tiêu điểm"
          onClose={() => setLightboxImages(null)}
        />
      )}

      {activeVideo && (
        <VideoModal item={activeVideo} onClose={() => setActiveVideo(null)} />
      )}
    </div>
  );
}
