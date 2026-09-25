import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCategoryData } from '../hooks/useCategoryData.js';
import { dataService } from '../services/dataService.js';
import ContentCard from '../components/cards/ContentCard.jsx';
import CharacterCard from '../components/cards/CharacterCard.jsx';
import EventCard from '../components/cards/EventCard.jsx';
import LightboxGallery from '../components/interactive/LightboxGallery.jsx';
import VideoModal from '../components/interactive/VideoModal.jsx';
import SakuraEffect from '../components/interactive/SakuraEffect.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import { useBookmarks } from '../context/BookmarkContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

function formatVietnameseDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function isRecentlyAdded(dateStr, days = 21) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return false;
  const diffDays = (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= days;
}

export default function CategoryHub() {
  const { categoryId } = useParams();
  const { categoryInfo, contents, characters, events, franchises, isValidCategory } = useCategoryData(categoryId);
  const isMovies = categoryId === 'movies';
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { isDark } = useTheme();

  // Tab State: 'content' | 'characters' | 'events'
  const [activeTab, setActiveTab] = useState('content');

  // Movies-only: cinematic hero spotlight + "Mới ra mắt" carousel
  const [heroIndex, setHeroIndex] = useState(0);
  const moviesCarouselRef = useRef(null);
  const moviesHeroVideoRef = useRef(null);

  // Loop only the first 15s of the hero background video
  const handleMoviesHeroTimeUpdate = () => {
    const v = moviesHeroVideoRef.current;
    if (v && v.currentTime >= 15) {
      v.currentTime = 0;
      v.play();
    }
  };

  // Watchdog: some unrelated re-render elsewhere in the app can leave the hero
  // video paused after it loops back to 0. Auto-resume it if that happens.
  useEffect(() => {
    if (!isMovies) return;
    const interval = setInterval(() => {
      const v = moviesHeroVideoRef.current;
      if (v && v.paused && !document.hidden) {
        v.play().catch(() => {});
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isMovies]);

  // Anime-only: cinematic Gundam hero video state
  const [animeHeroMuted, setAnimeHeroMuted] = useState(true);
  const animeVideoRef = useRef(null);

  const toggleAnimeHeroAudio = () => {
    if (animeVideoRef.current) {
      animeVideoRef.current.muted = !animeHeroMuted;
      setAnimeHeroMuted(!animeHeroMuted);
    }
  };

  // Content Filters
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSort, setSelectedSort] = useState('newest');

  // Character Filter
  const [selectedFranchise, setSelectedFranchise] = useState('all');

  // Event Filter
  const [selectedEventStatus, setSelectedEventStatus] = useState('all');

  // Modals
  const [lightboxImages, setLightboxImages] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);

  // Dynamic format count mapping for badges
  const formatCounts = useMemo(() => {
    const counts = { all: contents.length, article: 0, gallery: 0, video: 0, audio: 0 };
    contents.forEach((c) => {
      if (counts[c.type] !== undefined) {
        counts[c.type]++;
      }
    });
    return counts;
  }, [contents]);

  // Google SEO / Lighthouse optimization: dynamic title, meta description & Schema.org JSON-LD
  useEffect(() => {
    if (categoryInfo) {
      const prevTitle = document.title;
      document.title = `${categoryInfo.name || categoryInfo.label} Hub — Vũ Trụ Anime, Bài Viết & Nhân Vật | FandomVerse`;

      let metaDesc = document.querySelector('meta[name="description"]');
      let createdMeta = false;
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
        createdMeta = true;
      }
      const prevMetaDesc = metaDesc.content;
      metaDesc.content = `${categoryInfo.description} Khám phá ${contents.length} bài viết & media, ${characters.length} nhân vật tiêu biểu và ${events.length} sự kiện nổi bật trong vũ trụ ${categoryInfo.label}.`;

      // Schema.org JSON-LD CollectionPage
      const scriptId = 'schema-category-hub';
      let script = document.getElementById(scriptId);
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      const schemaData = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `${categoryInfo.label} Hub — FandomVerse`,
        description: categoryInfo.description,
        url: window.location.href,
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: contents.length,
          itemListElement: contents.map((c, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: c.title,
            description: c.shortDescription,
            image: c.thumbnail,
            url: `${window.location.origin}${window.location.pathname}#/category/${categoryId}/article/${c.id}`,
          })),
        },
      };
      script.textContent = JSON.stringify(schemaData);

      return () => {
        document.title = prevTitle;
        if (createdMeta && metaDesc) {
          metaDesc.remove();
        } else if (metaDesc) {
          metaDesc.content = prevMetaDesc;
        }
        const existingScript = document.getElementById(scriptId);
        if (existingScript) existingScript.remove();
      };
    }
  }, [categoryInfo, contents, characters, events, categoryId]);

  // Filtered & Sorted Contents
  const filteredContents = useMemo(() => {
    return dataService.getContentsByCategory(categoryId, {
      type: selectedType,
      sort: selectedSort,
    });
  }, [categoryId, selectedType, selectedSort]);

  // Filtered Characters
  const filteredCharacters = useMemo(() => {
    return dataService.getCharactersByCategory(categoryId, {
      franchise: selectedFranchise,
    });
  }, [categoryId, selectedFranchise]);

  // Movies-only: trailers power the cinematic hero spotlight
  const heroTrailers = useMemo(() => {
    if (!isMovies) return [];
    return dataService.getTrailersByCategory('movies').slice(0, 5);
  }, [isMovies]);

  // Movies-only: combine content + trailers into one "Mới ra mắt" poster rail
  const moviesLatest = useMemo(() => {
    if (!isMovies) return [];
    const contentItems = dataService.getContentsByCategory('movies', { sort: 'newest' }).map((c) => ({
      id: c.id,
      title: c.title,
      thumbnail: c.thumbnail,
      dateAdded: c.dateAdded,
      kind: 'content',
      source: c,
    }));
    const trailerItems = dataService.getTrailersByCategory('movies').map((t) => ({
      id: t.id,
      title: t.title,
      thumbnail: t.thumbnail,
      dateAdded: t.releaseDate,
      kind: 'trailer',
      source: t,
    }));
    return [...contentItems, ...trailerItems].sort(
      (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)
    );
  }, [isMovies]);

  const activeHeroTrailer = heroTrailers[heroIndex] || null;

  const scrollMoviesCarousel = (direction) => {
    const el = moviesCarouselRef.current;
    if (!el) return;
    const cardWidth = el.querySelector('.movies-poster-card')?.offsetWidth || 200;
    el.scrollBy({ left: direction * (cardWidth + 20) * 2, behavior: 'smooth' });
  };

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return dataService.getEventsByCategory(categoryId, {
      status: selectedEventStatus,
    });
  }, [categoryId, selectedEventStatus]);

  if (!isValidCategory) {
    return (
      <div className="container-fluid px-3 px-md-4 px-lg-5 py-5 text-center">
        <EmptyState
          title="Không tìm thấy danh mục"
          message={`Danh mục '${categoryId}' không tồn tại trong hệ thống 7 vũ trụ FandomVerse.`}
          actionLabel="Quay lại trang chủ"
          onAction={() => (window.location.hash = '#/')}
        />
      </div>
    );
  }

  return (
    <div className="container-fluid px-3 px-md-4 px-lg-5 py-4">
      {isMovies ? (
        <>
          {/* MOVIES CINEMATIC HERO — spotlight rotates through latest trailers */}
          {activeHeroTrailer && (
            <div className="movies-hero mb-4">
              <video
                ref={moviesHeroVideoRef}
                className="movies-hero-bg"
                src="/movies-hero-video.mp4"
                autoPlay
                loop
                muted
                playsInline
                onTimeUpdate={handleMoviesHeroTimeUpdate}
              />
              <div className="movies-hero-scrim" />

              <div className="movies-hero-content">
                <span className="movies-hero-eyebrow">
                  <i className="bi bi-film"></i> Trailer Nổi Bật
                </span>
                <h1 className="movies-hero-title">{activeHeroTrailer.title}</h1>
                <div className="movies-hero-meta">
                  <span><i className="bi bi-calendar3 me-1"></i>{formatVietnameseDate(activeHeroTrailer.releaseDate)}</span>
                  <span className="dot"></span>
                  <span className={`badge-category badge-category-movies`}>
                    <i className={`bi ${categoryInfo.icon} me-1`}></i> {categoryInfo.label}
                  </span>
                  {activeHeroTrailer.status === 'upcoming' && (
                    <>
                      <span className="dot"></span>
                      <span className="text-warning fw-semibold">
                        <i className="bi bi-lightning-charge-fill me-1"></i>Sắp ra mắt
                      </span>
                    </>
                  )}
                </div>
                <div className="movies-hero-actions">
                  <button
                    type="button"
                    className="movies-hero-cta"
                    onClick={() => setActiveVideo(activeHeroTrailer)}
                  >
                    <i className="bi bi-play-fill fs-5"></i> Xem Trailer
                  </button>
                  <button
                    type="button"
                    className={`movies-hero-icon-btn ${isBookmarked(activeHeroTrailer.id) ? 'is-active' : ''}`}
                    onClick={() => toggleBookmark({ ...activeHeroTrailer, category: 'movies', type: 'trailer' })}
                    aria-label="Lưu trailer"
                    title="Lưu vào danh sách của bạn"
                  >
                    <i className={`bi ${isBookmarked(activeHeroTrailer.id) ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                  </button>
                  <button
                    type="button"
                    className="movies-hero-icon-btn"
                    aria-label="Chia sẻ"
                    title="Sao chép liên kết chia sẻ"
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.href);
                    }}
                  >
                    <i className="bi bi-share-fill"></i>
                  </button>
                </div>
              </div>

              {/* Thumbnail selector rail */}
              <div className="movies-hero-rail">
                {heroTrailers.map((t, idx) => (
                  <button
                    key={t.id}
                    type="button"
                    className={`movies-hero-thumb ${idx === heroIndex ? 'is-active' : ''}`}
                    onClick={() => setHeroIndex(idx)}
                    aria-label={t.title}
                    title={t.title}
                  >
                    <img src={t.thumbnail} alt={t.title} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* MOVIES "MỚI RA MẮT" POSTER CAROUSEL */}
          {moviesLatest.length > 0 && (
            <div className="mb-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h2 className={`font-heading fw-bold h4 mb-0 ${isDark ? 'text-white' : 'text-dark'}`}>
                  <i className="bi bi-stars me-2" style={{ color: '#0984E3' }}></i>
                  Mới Ra Mắt
                </h2>
                <div className="d-flex align-items-center gap-2">
                  <button type="button" className="movies-carousel-arrow" onClick={() => scrollMoviesCarousel(-1)} aria-label="Trước">
                    <i className="bi bi-chevron-left"></i>
                  </button>
                  <button type="button" className="movies-carousel-arrow" onClick={() => scrollMoviesCarousel(1)} aria-label="Tiếp theo">
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </div>
              </div>

              <div className="movies-carousel-track" ref={moviesCarouselRef}>
                {moviesLatest.map((item) => (
                  <div
                    key={item.id}
                    className="movies-poster-card"
                    onClick={() => {
                      if (item.kind === 'trailer') {
                        setActiveVideo(item.source);
                      } else if (item.source.type === 'video') {
                        setActiveVideo(item.source);
                      } else if (item.source.type === 'gallery') {
                        setLightboxImages(item.source.images);
                      } else {
                        window.location.hash = `#/category/movies/article/${item.id}`;
                      }
                    }}
                  >
                    <img src={item.thumbnail} alt={item.title} loading="lazy" />
                    <div className="poster-scrim" />
                    <span
                      className="poster-badge"
                      style={{
                        background: isRecentlyAdded(item.dateAdded)
                          ? 'linear-gradient(135deg, #FF6B81, #ee5253)'
                          : 'rgba(9, 132, 227, 0.9)',
                      }}
                    >
                      {isRecentlyAdded(item.dateAdded) ? 'Mới' : item.kind === 'trailer' ? 'Trailer' : 'Bài viết'}
                    </span>
                    <div className="poster-info">
                      <div className="poster-title">{item.title}</div>
                      <div className="poster-date">{formatVietnameseDate(item.dateAdded)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : categoryId === 'anime' ? (
        /* EXCLUSIVE CINEMATIC GUNDAM ANIME HERO BANNER */
        <div className="anime-hero mb-4">
          <video
            ref={animeVideoRef}
            className="anime-hero-bg"
            src="/GunDam.mp4"
            autoPlay
            loop
            muted={animeHeroMuted}
            playsInline
          />
          <div className="anime-hero-scrim" />

          {/* Top-Right Stats Card */}
          <div className="anime-hero-stats">
            <div>
              <i className="bi bi-file-text me-1 text-primary"></i>{' '}
              <strong className="text-white">{contents.length}</strong> bài viết & media
            </div>
            <div>
              <i className="bi bi-people me-1 text-success"></i>{' '}
              <strong className="text-white">{characters.length}</strong> nhân vật tiêu biểu
            </div>
            <div>
              <i className="bi bi-calendar-event me-1 text-warning"></i>{' '}
              <strong className="text-white">{events.length}</strong> sự kiện nổi bật
            </div>
          </div>

          <div className="anime-hero-content">
            <div className="anime-hero-eyebrow">
              <span className="badge-category badge-category-anime fs-6">
                <i className={`bi ${categoryInfo.icon} me-1`}></i> Fandom Universe
              </span>
              <span
                className="badge rounded-pill px-3 py-1 text-white small d-inline-flex align-items-center gap-1"
                style={{
                  background: 'linear-gradient(135deg, #ff758c, #ff7eb3)',
                  boxShadow: '0 2px 8px rgba(255, 117, 140, 0.35)',
                }}
              >
                <i className="bi bi-stars"></i> Anime Exclusive
              </span>
              <span
                className="badge rounded-pill px-3 py-1 text-white small d-inline-flex align-items-center gap-1"
                style={{
                  background: 'linear-gradient(135deg, #e84118, #ff6b81)',
                  boxShadow: '0 2px 8px rgba(232, 65, 24, 0.35)',
                }}
              >
                <i className="bi bi-play-circle-fill"></i> GunDam Video
              </span>
              <SakuraEffect autoStart={true} />
            </div>

            <h1 className="anime-hero-title">
              {categoryInfo.label}
              <span className="ms-2 fs-4 fw-normal text-white-50 d-block d-sm-inline">
                • Mobile Suit GunDam
              </span>
            </h1>

            <p className="anime-hero-desc">
              Khám phá thế giới hoạt hình Nhật Bản đỉnh cao, các tác phẩm shounen huyền thoại cùng trailer bom tấn{' '}
              <strong className="text-white">Mobile Suit Gundam: Chiến Binh Thép Tái Xuất</strong> với những màn đại chiến mecha mãn nhãn.
            </p>

            <div className="anime-hero-actions">
              <button
                type="button"
                className="anime-hero-cta"
                onClick={() => {
                  const gundamItem = contents.find((c) => c.id === 'anime-video-gundam');
                  if (gundamItem) setActiveVideo(gundamItem);
                }}
              >
                <i className="bi bi-arrows-fullscreen fs-6"></i>
                <span>Xem Bản Chi Tiết (Full Video)</span>
              </button>

              <button
                type="button"
                className="anime-hero-btn-secondary"
                onClick={toggleAnimeHeroAudio}
                title={animeHeroMuted ? 'Bật âm thanh video Gundam' : 'Tắt tiếng video Gundam'}
              >
                <i className={`bi ${animeHeroMuted ? 'bi-volume-mute-fill' : 'bi-volume-up-fill'} fs-6`}></i>
                <span>{animeHeroMuted ? 'Bật Âm Thanh' : 'Tắt Âm Thanh'}</span>
              </button>

              <button
                type="button"
                className="movies-hero-icon-btn"
                aria-label="Chia sẻ"
                title="Sao chép liên kết chia sẻ"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                }}
              >
                <i className="bi bi-share-fill"></i>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Category Header Banner (default categories) */
        <div
          className={`p-4 p-md-5 rounded-4 shadow-sm mb-4 bg-white border-0 accent-border-${categoryId} d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3`}
        >
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className={`badge-category badge-category-${categoryId} fs-6`}>
                <i className={`bi ${categoryInfo.icon} me-1`}></i> Fandom Universe
              </span>
            </div>
            <h1 className="font-heading display-5 fw-bold text-dark mb-2">
              {categoryInfo.label}
            </h1>
            <p className="text-secondary lead fs-6 mb-0" style={{ maxWidth: '650px' }}>
              {categoryInfo.description}
            </p>
          </div>

          <div className="d-flex flex-row flex-md-column gap-2 text-md-end text-muted small">
            <div><i className="bi bi-file-text me-1 text-primary"></i> <strong>{contents.length}</strong> bài viết & media</div>
            <div><i className="bi bi-people me-1 text-success"></i> <strong>{characters.length}</strong> nhân vật tiêu biểu</div>
            <div><i className="bi bi-calendar-event me-1 text-warning"></i> <strong>{events.length}</strong> sự kiện nổi bật</div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-light p-2 rounded-4 border mb-4 shadow-xs">
        <ul className="nav nav-pills nav-fill gap-2" role="tablist">
          <li className="nav-item">
            <button
              className={`nav-link rounded-pill py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 ${
                activeTab === 'content' ? 'active shadow-sm' : 'text-secondary'
              }`}
              onClick={() => setActiveTab('content')}
            >
              <i className="bi bi-collection-play-fill"></i>
              <span>Nội Dung & Media ({contents.length})</span>
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link rounded-pill py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 ${
                activeTab === 'characters' ? 'active shadow-sm' : 'text-secondary'
              }`}
              onClick={() => setActiveTab('characters')}
            >
              <i className="bi bi-people-fill"></i>
              <span>Nhân Vật ({characters.length})</span>
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link rounded-pill py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 ${
                activeTab === 'events' ? 'active shadow-sm' : 'text-secondary'
              }`}
              onClick={() => setActiveTab('events')}
            >
              <i className="bi bi-calendar-check-fill"></i>
              <span>Sự Kiện ({events.length})</span>
            </button>
          </li>
        </ul>
      </div>

      {/* TAB 1: CONTENTS */}
      {activeTab === 'content' && (
        <div>
          {/* Filter & Sort Bar */}
          <div className="p-3 bg-white rounded-4 border mb-4 shadow-xs d-flex flex-wrap gap-3 align-items-center justify-content-between">
            {/* Type Filters */}
            <div className="d-flex flex-wrap gap-1 align-items-center">
              <span className="small fw-semibold text-secondary me-2">Định dạng:</span>
              <button
                type="button"
                className={`btn btn-sm rounded-pill px-3 py-1 ${
                  selectedType === 'all' ? 'btn-primary' : 'btn-outline-secondary'
                }`}
                onClick={() => setSelectedType('all')}
              >
                Tất cả ({formatCounts.all})
              </button>
              <button
                type="button"
                className={`btn btn-sm rounded-pill px-3 py-1 ${
                  selectedType === 'article' ? 'btn-primary' : 'btn-outline-secondary'
                }`}
                onClick={() => setSelectedType('article')}
              >
                <i className="bi bi-file-text me-1"></i> Bài viết ({formatCounts.article})
              </button>
              <button
                type="button"
                className={`btn btn-sm rounded-pill px-3 py-1 ${
                  selectedType === 'gallery' ? 'btn-primary' : 'btn-outline-secondary'
                }`}
                onClick={() => setSelectedType('gallery')}
              >
                <i className="bi bi-images me-1"></i> Bộ ảnh ({formatCounts.gallery})
              </button>
              <button
                type="button"
                className={`btn btn-sm rounded-pill px-3 py-1 ${
                  selectedType === 'video' ? 'btn-primary' : 'btn-outline-secondary'
                }`}
                onClick={() => setSelectedType('video')}
              >
                <i className="bi bi-play-circle me-1"></i> Video ({formatCounts.video})
              </button>
              <button
                type="button"
                className={`btn btn-sm rounded-pill px-3 py-1 ${
                  selectedType === 'audio' ? 'btn-primary' : 'btn-outline-secondary'
                }`}
                onClick={() => setSelectedType('audio')}
              >
                <i className="bi bi-soundwave me-1"></i> Audio ({formatCounts.audio})
              </button>
            </div>

            {/* Sort Options */}
            <div className="d-flex align-items-center gap-2">
              <label className="small fw-semibold text-secondary text-nowrap">Sắp xếp:</label>
              <select
                className="form-select form-select-sm bg-light"
                style={{ width: '160px' }}
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
              >
                <option value="newest">Mới nhất</option>
                <option value="alphabetical">Tên (A-Z)</option>
                <option value="featured">Nổi bật trước</option>
              </select>
            </div>
          </div>

          {/* Content Cards Grid */}
          {filteredContents.length === 0 ? (
            <EmptyState
              title="Không có nội dung phù hợp"
              message="Không có bài viết hoặc media nào khớp với định dạng bạn đã chọn."
              onAction={() => setSelectedType('all')}
              actionLabel="Xem tất cả nội dung"
            />
          ) : (
            <div className="row g-4">
              {filteredContents.map((item) => (
                <div key={item.id} className="col-xl-3 col-lg-4 col-md-6 col-12">
                  <ContentCard
                    item={item}
                    onOpenGallery={(g) => setLightboxImages(g.images)}
                    onOpenMedia={(v) => setActiveVideo(v)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CHARACTERS */}
      {activeTab === 'characters' && (
        <div>
          {/* Franchise Filter Toolbar */}
          <div className="p-3 bg-white rounded-4 border mb-4 shadow-xs d-flex align-items-center gap-3">
            <span className="small fw-semibold text-secondary">Lọc theo Franchise:</span>
            <select
              className="form-select form-select-sm bg-light"
              style={{ maxWidth: '280px' }}
              value={selectedFranchise}
              onChange={(e) => setSelectedFranchise(e.target.value)}
            >
              <option value="all">Tất cả Franchise</option>
              {franchises.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
            <span className="badge bg-secondary rounded-pill ms-auto">
              {filteredCharacters.length} nhân vật
            </span>
          </div>

          {/* Characters Grid (>=5 characters) */}
          <div className="row g-4">
            {filteredCharacters.map((char) => (
              <div key={char.id} className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12">
                <CharacterCard character={char} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: EVENTS */}
      {activeTab === 'events' && (
        <div>
          {/* Event Status Filter Toolbar */}
          <div className="p-3 bg-white rounded-4 border mb-4 shadow-xs d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <span className="small fw-semibold text-secondary">Trạng thái:</span>
              <div className="btn-group btn-group-sm">
                <button
                  type="button"
                  className={`btn ${selectedEventStatus === 'all' ? 'btn-dark' : 'btn-outline-secondary'}`}
                  onClick={() => setSelectedEventStatus('all')}
                >
                  Tất cả
                </button>
                <button
                  type="button"
                  className={`btn ${selectedEventStatus === 'upcoming' ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary'}`}
                  onClick={() => setSelectedEventStatus('upcoming')}
                >
                  ⚡ Sắp diễn ra
                </button>
                <button
                  type="button"
                  className={`btn ${selectedEventStatus === 'past' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                  onClick={() => setSelectedEventStatus('past')}
                >
                  ✓ Đã diễn ra
                </button>
              </div>
            </div>

            <span className="badge bg-secondary rounded-pill">
              {filteredEvents.length} sự kiện
            </span>
          </div>

          {/* Events List (>=3 events) */}
          <div className="row g-3">
            {filteredEvents.map((evt) => (
              <div key={evt.id} className="col-xl-4 col-lg-6 col-12">
                <EventCard event={evt} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Gallery Modal */}
      {lightboxImages && (
        <LightboxGallery
          images={lightboxImages}
          title={`${categoryInfo.label} Gallery`}
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
