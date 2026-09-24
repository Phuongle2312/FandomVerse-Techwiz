import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORY_LIST } from '../constants.js';
import { dataService } from '../services/dataService.js';
import { useTheme } from '../context/ThemeContext.jsx';
import ContentCard from '../components/cards/ContentCard.jsx';
import EventCard from '../components/cards/EventCard.jsx';
import LightboxGallery from '../components/interactive/LightboxGallery.jsx';
import VideoModal from '../components/interactive/VideoModal.jsx';

export default function Home() {
  const { isDark } = useTheme();
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
    <div style={{ backgroundColor: isDark ? '#0c0f1d' : '#F8F9FC', transition: 'background-color 0.3s ease' }}>
      {/* 1. CINEMATIC FULL-BLEED PANORAMA HERO SECTION */}
      <section className="cinematic-hero-wrap position-relative text-center text-lg-start py-2 py-lg-3">
        {/* Ambient Glow Lights */}
        <div
          className="ambient-glow position-absolute"
          style={{
            top: '0%',
            right: '10%',
            width: '450px',
            height: '450px',
            background: 'radial-gradient(circle, rgba(108, 92, 231, 0.4) 0%, rgba(108, 92, 231, 0) 70%)',
            zIndex: 1,
          }}
        ></div>
        <div
          className="ambient-glow position-absolute"
          style={{
            bottom: '0%',
            left: '5%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(255, 107, 129, 0.3) 0%, rgba(255, 107, 129, 0) 70%)',
            animationDelay: '-4s',
            zIndex: 1,
          }}
        ></div>

        {/* Main Hero Content Deck - Zero Gap Spacing */}
        <div className="container-fluid px-3 px-md-5 py-2 py-lg-3 position-relative d-flex align-items-center" style={{ zIndex: 2 }}>
          <div className="row align-items-center g-4 g-xl-5 w-100 mx-0">
            {/* Left Column: Ultra Frosted Glass Deck */}
            <div className="col-lg-6 col-12">
              <div className="p-4 p-md-5 ultra-glass-deck">
                <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill mb-3" style={{ background: 'rgba(255, 255, 255, 0.12)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                  <span className="badge rounded-pill" style={{ background: 'linear-gradient(135deg, #FF6B81 0%, #6C5CE7 100%)', color: '#fff' }}>
                    <i className="bi bi-stars me-1"></i> Web Innovation
                  </span>
                  <span className="small text-white fw-semibold">Vũ Trụ Fandom Toàn Cầu</span>
                </div>

                <h1 className="font-heading display-4 fw-extrabold text-white mb-3 lh-sm" style={{ fontWeight: 800 }}>
                  Khám Phá <span style={{ background: 'linear-gradient(135deg, #a29bfe 0%, #ff7675 50%, #55efc4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Vũ Trụ Fandom</span> Đa Chiều Của Bạn
                </h1>

                <p className="fs-5 text-white-50 mb-4 leading-relaxed">
                  Hợp nhất <strong className="text-white">7 thế giới</strong>: Anime, Gaming, Phim ảnh, TV Shows, K-Pop, Comics và Manga trong một nền tảng giải trí trực quan, tốc độ cao và đầy cảm hứng.
                </p>

                {/* Action Buttons */}
                <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start mb-4">
                  <button
                    type="button"
                    className="btn btn-primary-fv btn-lg px-4 py-3 d-flex align-items-center gap-2"
                    onClick={scrollToCategories}
                  >
                    <span>Khám Phá 7 Vũ Trụ</span>
                    <i className="bi bi-arrow-down-circle-fill fs-5"></i>
                  </button>
                  <Link
                    to="/trailers"
                    className="btn btn-outline-fv btn-lg px-4 py-3 d-flex align-items-center gap-2"
                  >
                    <i className="bi bi-play-circle-fill text-danger fs-5"></i>
                    <span>Xem Trailers Mới</span>
                  </Link>
                </div>

                {/* Real-Time Fandom Stats Bar */}
                <div className="row g-2 pt-3 border-top border-white-50 text-center text-md-start">
                  <div className="col-4">
                    <div className="fw-bold fs-4 text-warning">7+</div>
                    <div className="text-white-50 small">Vũ Trụ Fandom</div>
                  </div>
                  <div className="col-4 border-start border-white-50">
                    <div className="fw-bold fs-4" style={{ color: '#55efc4' }}>500+</div>
                    <div className="text-white-50 small">Nội Dung 4K</div>
                  </div>
                  <div className="col-4 border-start border-white-50">
                    <div className="fw-bold fs-4" style={{ color: '#ff7675' }}>100%</div>
                    <div className="text-white-50 small">Bản Quyền Chính Hãng</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: 4 Interactive Media Bento Hub */}
            <div className="col-lg-6 col-12">
              <div className="row g-3">
                {/* Bento 1: Anime Hot */}
                <div className="col-sm-6 col-12">
                  <div
                    className="ultra-glass-card position-relative mb-3 cursor-pointer"
                    style={{ height: '210px' }}
                    onClick={() => {
                      const animeTrailer = latestTrailers.find((t) => t.category === 'anime') || latestTrailers[0];
                      if (animeTrailer) setActiveVideo(animeTrailer);
                    }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1578632767115-351597cf2477?w=700&auto=format&fit=crop&q=80"
                      alt="Anime Fandom"
                      className="w-100 h-100 object-fit-cover"
                    />
                    <div
                      className="position-absolute w-100 h-100 top-0 start-0"
                      style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(12,15,29,0.85) 100%)' }}
                    ></div>
                    <span className="position-absolute top-0 start-0 m-3 badge rounded-pill px-2.5 py-1.5" style={{ background: 'rgba(255, 107, 129, 0.95)' }}>
                      🔥 Trending Anime
                    </span>
                    <div className="position-absolute bottom-0 start-0 end-0 p-3 text-white text-start">
                      <div className="fw-bold fs-6 mb-0">Demon Slayer: Hashira Training</div>
                      <span className="text-white-50 small d-flex align-items-center gap-1">
                        <i className="bi bi-eye-fill text-warning"></i> 98.5K lượt xem • 4K
                      </span>
                    </div>
                  </div>

                  {/* Bento 2: Gaming Live */}
                  <div
                    className="ultra-glass-card position-relative cursor-pointer"
                    style={{ height: '190px' }}
                    onClick={() => {
                      const gamingTrailer = latestTrailers.find((t) => t.category === 'gaming') || latestTrailers[0];
                      if (gamingTrailer) setActiveVideo(gamingTrailer);
                    }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=700&auto=format&fit=crop&q=80"
                      alt="Gaming Fandom"
                      className="w-100 h-100 object-fit-cover"
                    />
                    <div
                      className="position-absolute w-100 h-100 top-0 start-0"
                      style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(12,15,29,0.85) 100%)' }}
                    ></div>
                    <span className="position-absolute top-0 start-0 m-3 badge rounded-pill px-2.5 py-1.5 d-flex align-items-center gap-1.5" style={{ background: 'rgba(0, 184, 148, 0.95)' }}>
                      <span className="d-flex align-items-center gap-1 me-1">
                        <span className="equalizer-bar"></span>
                        <span className="equalizer-bar"></span>
                        <span className="equalizer-bar"></span>
                      </span>
                      Gaming Esports Live
                    </span>
                    <div className="position-absolute bottom-0 start-0 end-0 p-3 text-white text-start">
                      <div className="fw-bold fs-6 mb-0">Cyberpunk & RPG Worlds</div>
                      <span className="text-white-50 small">Giải đấu thế giới đang diễn ra</span>
                    </div>
                  </div>
                </div>

                {/* Bento 3 & 4 */}
                <div className="col-sm-6 col-12">
                  {/* Bento 3: Marvel Movies */}
                  <div
                    className="ultra-glass-card position-relative mb-3 cursor-pointer"
                    style={{ height: '190px' }}
                    onClick={() => {
                      const movieTrailer = latestTrailers.find((t) => t.category === 'movies') || latestTrailers[0];
                      if (movieTrailer) setActiveVideo(movieTrailer);
                    }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1635863138275-d9b33299680b?w=700&auto=format&fit=crop&q=80"
                      alt="Movie Superhero"
                      className="w-100 h-100 object-fit-cover"
                    />
                    <div
                      className="position-absolute w-100 h-100 top-0 start-0"
                      style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(12,15,29,0.85) 100%)' }}
                    ></div>
                    <span className="position-absolute top-0 start-0 m-3 badge rounded-pill px-2.5 py-1.5" style={{ background: 'rgba(9, 132, 227, 0.95)' }}>
                      🎬 Marvel & DC 4K
                    </span>
                    <div className="position-absolute bottom-0 start-0 end-0 p-3 text-white text-start">
                      <div className="fw-bold fs-6 mb-0">Vũ Trụ Siêu Anh Hùng</div>
                      <span className="text-white-50 small">Trailers & Tin tức độc quyền</span>
                    </div>
                  </div>

                  {/* Bento 4: K-Pop Live */}
                  <div
                    className="ultra-glass-card position-relative cursor-pointer"
                    style={{ height: '210px' }}
                    onClick={() => {
                      const kpopTrailer = latestTrailers.find((t) => t.category === 'kpop') || latestTrailers[0];
                      if (kpopTrailer) setActiveVideo(kpopTrailer);
                    }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=700&auto=format&fit=crop&q=80"
                      alt="K-Pop Concert"
                      className="w-100 h-100 object-fit-cover"
                    />
                    <div
                      className="position-absolute w-100 h-100 top-0 start-0"
                      style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(12,15,29,0.85) 100%)' }}
                    ></div>
                    <span className="position-absolute top-0 start-0 m-3 badge rounded-pill px-2.5 py-1.5" style={{ background: 'rgba(232, 67, 147, 0.95)' }}>
                      🎤 K-Pop Idol Stage
                    </span>
                    <div className="position-absolute bottom-0 start-0 end-0 p-3 text-white text-start">
                      <div className="fw-bold fs-6 mb-0">World Tour & Music Video</div>
                      <span className="text-white-50 small d-flex align-items-center gap-1">
                        <i className="bi bi-heart-fill text-danger"></i> 142.3K Fans bình chọn
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edge-to-Edge 7 Fandom Universe Interactive Ribbon */}
        <div
          className="w-100 py-3 px-3 px-lg-5 position-relative"
          style={{
            background: 'rgba(12, 15, 29, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            zIndex: 3,
          }}
        >
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
            <span className="small text-white-50 fw-bold text-uppercase d-flex align-items-center gap-2" style={{ letterSpacing: '1px', fontSize: '0.8rem' }}>
              <span className="badge rounded-pill bg-warning text-dark">LIVE</span> 7 Vũ Trụ Fandom Đang Hoạt Động:
            </span>

            <div className="d-flex flex-wrap align-items-center gap-2">
              {CATEGORY_LIST.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.id}`}
                  className="fandom-nav-pill d-flex align-items-center gap-1.5"
                >
                  <i className={`bi ${cat.icon}`}></i>
                  <span>{cat.label}</span>
                </Link>
              ))}
              <Link
                to="/merchandise"
                className="fandom-nav-pill text-white"
                style={{ background: 'linear-gradient(135deg, #6C5CE7 0%, #FF6B81 100%)', border: 'none' }}
              >
                <i className="bi bi-bag-check-fill text-white"></i>
                <span>Merchandise</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 7 CATEGORY HUBS GRID - DYNAMIC THEME */}
      <section
        id="category-grid-section"
        className="py-4"
        style={{
          backgroundColor: isDark ? '#0e1224' : '#F1F2F9',
          borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid var(--border-color)',
          transition: 'background-color 0.3s ease',
        }}
      >
        <div className="container">
          <div className="text-center mb-4">
            <div
              className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-2"
              style={{
                background: isDark ? 'rgba(108, 92, 231, 0.2)' : 'rgba(108, 92, 231, 0.1)',
                color: isDark ? '#a29bfe' : '#6C5CE7',
                border: isDark ? '1px solid rgba(108, 92, 231, 0.3)' : 'none',
              }}
            >
              <i className="bi bi-compass-fill"></i>
              <span className="small fw-bold text-uppercase">Khám Phá Toàn Diện</span>
            </div>
            <h2 className={`font-heading fw-bold display-6 mb-2 ${isDark ? 'text-white' : 'text-dark'}`}>
              7 Danh Mục Fandom Nổi Bật
            </h2>
            <p className={`mx-auto ${isDark ? 'text-white-50' : 'text-secondary'}`} style={{ maxWidth: '580px' }}>
              Lựa chọn vũ trụ đam mê của bạn để đắm chìm vào những câu chuyện hấp dẫn, nhân vật biểu tượng và sự kiện đáng nhớ.
            </p>
          </div>

          <div className="row g-4">
            {CATEGORY_LIST.map((cat) => {
              const categoryImages = {
                anime: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=80',
                gaming: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80',
                movies: 'https://images.unsplash.com/photo-1635863138275-d9b33299680b?w=500&auto=format&fit=crop&q=80',
                tvshows: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=500&auto=format&fit=crop&q=80',
                kpop: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=80',
                comics: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop&q=80',
                manga: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=500&auto=format&fit=crop&q=80',
              };

              return (
                <div key={cat.id} className="col-xl-3 col-lg-4 col-md-6 col-12">
                  <Link
                    to={`/category/${cat.id}`}
                    className={`category-visual-card h-100 p-4 accent-border-${cat.id}`}
                    style={{
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid var(--border-color)',
                    }}
                  >
                    {/* Ambient Category Artwork */}
                    {categoryImages[cat.id] && (
                      <img
                        src={categoryImages[cat.id]}
                        alt={cat.label}
                        className="category-bg-art"
                        style={{ opacity: isDark ? 0.35 : 0.15 }}
                      />
                    )}

                    <div className="d-flex align-items-center gap-3 mb-3 position-relative" style={{ zIndex: 2 }}>
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center shadow-xs"
                        style={{
                          width: '54px',
                          height: '54px',
                          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'var(--bg-surface-alt)',
                          border: `1.5px solid var(--accent-${cat.id})`,
                        }}
                      >
                        <i className={`bi ${cat.icon} fs-3`} style={{ color: `var(--accent-${cat.id})` }}></i>
                      </div>
                      <div>
                        <h4 className={`font-heading fw-bold mb-0 ${isDark ? 'text-white' : 'text-dark'}`}>{cat.label}</h4>
                        <span
                          className="badge rounded-pill px-2 py-0.5"
                          style={{
                            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(108, 92, 231, 0.08)',
                            color: `var(--accent-${cat.id})`,
                            fontSize: '0.7rem',
                          }}
                        >
                          Khám phá vũ trụ
                        </span>
                      </div>
                    </div>

                    <p className={`small mb-3 flex-grow-1 leading-relaxed position-relative ${isDark ? 'text-white-50' : 'text-secondary'}`} style={{ zIndex: 2 }}>
                      {cat.description}
                    </p>

                    <div className="d-flex align-items-center justify-content-between small fw-bold pt-2 border-top border-white-50 border-opacity-10 position-relative" style={{ color: `var(--accent-${cat.id})`, zIndex: 2 }}>
                      <span>Xem nội dung & nhân vật</span>
                      <i className="bi bi-arrow-right"></i>
                    </div>
                  </Link>
                </div>
              );
            })}

            {/* 8th Card: Quick Link to Merchandise */}
            <div className="col-xl-3 col-lg-4 col-md-6 col-12">
              <Link
                to="/merchandise"
                className="category-visual-card h-100 p-4 text-white position-relative"
                style={{
                  background: 'linear-gradient(135deg, #6C5CE7 0%, #FF6B81 100%)',
                  border: 'none',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1563089145-599997674d42?w=500&auto=format&fit=crop&q=80"
                  alt="Merchandise Store"
                  className="category-bg-art"
                  style={{ opacity: 0.3 }}
                />
                <div className="d-flex align-items-center gap-3 mb-3 position-relative" style={{ zIndex: 2 }}>
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center bg-white shadow-sm"
                    style={{ width: '54px', height: '54px' }}
                  >
                    <i className="bi bi-bag-check-fill fs-3" style={{ color: '#6C5CE7' }}></i>
                  </div>
                  <div>
                    <h4 className="font-heading fw-bold text-white mb-0">Gian Hàng</h4>
                    <span className="badge bg-warning text-dark rounded-pill px-2 py-0.5" style={{ fontSize: '0.7rem' }}>
                      Mô hình & Phụ kiện
                    </span>
                  </div>
                </div>
                <p className="text-white-50 small mb-3 flex-grow-1 leading-relaxed position-relative" style={{ zIndex: 2 }}>
                  Hàng trăm mô hình Figure, áo thun, lightstick và phụ kiện chính hãng đang chờ đón bạn.
                </p>
                <div className="d-flex align-items-center justify-content-between text-white small fw-bold pt-2 border-top border-white-50 position-relative" style={{ zIndex: 2 }}>
                  <span>Vào Merchandise Shop</span>
                  <i className="bi bi-arrow-right"></i>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED CONTENTS SHOWCASE - DYNAMIC THEME */}
      <section
        className="py-4"
        style={{
          backgroundColor: isDark ? '#0c0f1d' : '#FFFFFF',
          borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid var(--border-color)',
          borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid var(--border-color)',
          transition: 'background-color 0.3s ease',
        }}
      >
        <div className="container">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-2">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="badge bg-warning text-dark fw-bold">SPOTLIGHT</span>
                <h2 className={`font-heading fw-bold mb-0 ${isDark ? 'text-white' : 'text-dark'}`}>Nội Dung Tiêu Điểm</h2>
              </div>
              <p className={`small mb-0 ${isDark ? 'text-white-50' : 'text-secondary'}`}>Các bài viết chuyên sâu và media nổi bật được tuyển chọn</p>
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

      {/* 4. LATEST TRAILERS SECTION - DYNAMIC THEME */}
      <section className="py-4" style={{ backgroundColor: isDark ? '#0e1224' : '#F8F9FC', transition: 'background-color 0.3s ease' }}>
        <div className="container">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-2">
            <div>
              <h2 className={`font-heading fw-bold mb-1 d-flex align-items-center gap-2 ${isDark ? 'text-white' : 'text-dark'}`}>
                <i className="bi bi-play-circle-fill text-danger"></i> Trailer Bom Tấn Mới Nhất
              </h2>
              <p className={`small mb-0 ${isDark ? 'text-white-50' : 'text-secondary'}`}>Những thước phim hé lộ các siêu phẩm sắp bùng nổ</p>
            </div>
            <Link to="/trailers" className="btn btn-sm btn-outline-danger rounded-pill px-3 py-2 fw-semibold">
              Xem tất cả Trailer <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>

          <div className="row g-4">
            {latestTrailers.map((t) => (
              <div key={t.id} className="col-lg-4 col-md-6 col-12">
                <div
                  className={`card fv-card h-100 rounded-4 overflow-hidden accent-border-${t.category}`}
                  style={{
                    cursor: 'pointer',
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid var(--border-color)',
                  }}
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
                    <h6 className={`font-heading fw-bold mb-1 line-clamp-1 ${isDark ? 'text-white' : 'text-dark'}`}>{t.title}</h6>
                    <span className={`small ${isDark ? 'text-white-50' : 'text-muted'}`}>Khởi chiếu: {t.releaseDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. UPCOMING EVENTS HIGHLIGHT - DYNAMIC THEME */}
      <section
        className="py-4"
        style={{
          backgroundColor: isDark ? '#0c0f1d' : '#FFFFFF',
          borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid var(--border-color)',
          transition: 'background-color 0.3s ease',
        }}
      >
        <div className="container">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-2">
            <div>
              <h2 className={`font-heading fw-bold mb-1 d-flex align-items-center gap-2 ${isDark ? 'text-white' : 'text-dark'}`}>
                <i className="bi bi-calendar-event" style={{ color: '#a29bfe' }}></i> Sự Kiện Fandom Sắp Diễn Ra
              </h2>
              <p className={`small mb-0 ${isDark ? 'text-white-50' : 'text-secondary'}`}>Các ngày hội văn hóa, đại nhạc hội và triển lãm quy mô quốc tế</p>
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
