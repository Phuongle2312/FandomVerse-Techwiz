import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCategoryData } from '../hooks/useCategoryData.js';
import { useLanguage } from '../context/LanguageContext.jsx';
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
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { categoryId } = useParams();
  const { categoryInfo, contents, characters, events, franchises, isValidCategory } = useCategoryData(categoryId);
  const isMovies = categoryId === 'movies';
  const isGaming = categoryId === 'gaming';
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { isDark } = useTheme();

  // Gaming-only: Cyber HUD Scanner interactive mode
  const [gamingScannerActive, setGamingScannerActive] = useState(false);

  const toggleGamingScanner = () => {
    const nextState = !gamingScannerActive;
    setGamingScannerActive(nextState);
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(nextState ? 587.33 : 440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(nextState ? 1174.66 : 220, ctx.currentTime + 0.18);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch (e) {
      // AudioContext optional / user interaction
    }
  };

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

  // Manga-only: cinematic hero video state
  const [mangaHeroMuted, setMangaHeroMuted] = useState(true);
  const mangaVideoRef = useRef(null);

  const toggleMangaHeroAudio = () => {
    if (mangaVideoRef.current) {
      mangaVideoRef.current.muted = !mangaHeroMuted;
      setMangaHeroMuted(!mangaHeroMuted);
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
  }, [categoryId, selectedType, selectedSort, language]);

  // Filtered Characters
  const filteredCharacters = useMemo(() => {
    return dataService.getCharactersByCategory(categoryId, {
      franchise: selectedFranchise,
    });
  }, [categoryId, selectedFranchise, language]);

  // Movies-only: trailers power the cinematic hero spotlight
  const heroTrailers = useMemo(() => {
    if (!isMovies) return [];
    return dataService.getTrailersByCategory('movies').slice(0, 5);
  }, [isMovies, language]);

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
  }, [isMovies, language]);

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
  }, [categoryId, selectedEventStatus, language]);

  if (!isValidCategory) {
    return (
      <div className="container-fluid px-3 px-md-4 px-lg-5 py-5 text-center">
        <EmptyState
          title={t('categoryHub.notFoundTitle')}
          message={t('categoryHub.notFoundMessage', { categoryId })}
          actionLabel={t('categoryHub.backHome')}
          onAction={() => (window.location.hash = '#/')}
        />
      </div>
    );
  }

  return (
    <div className={`container-fluid px-3 px-md-4 px-lg-5 py-4 ${isGaming ? 'gaming-universe-container' : ''}`}>
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
        <div className="category-cinema-hero mb-4">
          <video
            ref={animeVideoRef}
            className="category-cinema-hero-bg"
            src="/GunDam.mp4"
            autoPlay
            loop
            muted={animeHeroMuted}
            playsInline
          />
          <div className="category-cinema-hero-scrim" />

          {/* Top-Right Stats Card */}
          <div className="category-cinema-hero-stats">
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

          <div className="category-cinema-hero-content">
            <div className="category-cinema-hero-eyebrow">
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

            <h1 className="category-cinema-hero-title">
              {categoryInfo.label}
              <span className="ms-2 fs-4 fw-normal text-white-50 d-block d-sm-inline">
                • Mobile Suit GunDam
              </span>
            </h1>

            <p className="category-cinema-hero-desc">
              Khám phá thế giới hoạt hình Nhật Bản đỉnh cao, các tác phẩm shounen huyền thoại cùng trailer bom tấn{' '}
              <strong className="text-white">Mobile Suit Gundam: Chiến Binh Thép Tái Xuất</strong> với những màn đại chiến mecha mãn nhãn.
            </p>

            <div className="category-cinema-hero-actions">
              <button
                type="button"
                className="category-cinema-hero-cta"
                onClick={() => setActiveVideo({
                  id: 'anime-trailer-002',
                  title: 'Mobile Suit Gundam: Chiến Binh Thép Tái Xuất',
                  mediaUrl: '/GunDam.mp4',
                })}
              >
                <i className="bi bi-arrows-fullscreen fs-6"></i>
                <span>Xem Bản Chi Tiết (Full Video)</span>
              </button>

              <button
                type="button"
                className="category-cinema-hero-btn-secondary"
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
      ) : categoryId === 'manga' ? (
        /* CINEMATIC MANGA HERO BANNER */
        <div className="category-cinema-hero mb-4">
          <video
            ref={mangaVideoRef}
            className="category-cinema-hero-bg"
            src="/manga-hero-video.mp4"
            autoPlay
            loop
            muted={mangaHeroMuted}
            playsInline
          />
          <div className="category-cinema-hero-scrim" />

          {/* Top-Right Stats Card */}
          <div className="category-cinema-hero-stats">
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

          <div className="category-cinema-hero-content">
            <div className="category-cinema-hero-eyebrow">
              <span className="badge-category badge-category-manga fs-6">
                <i className={`bi ${categoryInfo.icon} me-1`}></i> Fandom Universe
              </span>
              <span
                className="badge rounded-pill px-3 py-1 text-white small d-inline-flex align-items-center gap-1"
                style={{
                  background: 'linear-gradient(135deg, #E17055, #f0a48a)',
                  boxShadow: '0 2px 8px rgba(225, 112, 85, 0.35)',
                }}
              >
                <i className="bi bi-stars"></i> Manga Exclusive
              </span>
              <span
                className="badge rounded-pill px-3 py-1 text-white small d-inline-flex align-items-center gap-1"
                style={{
                  background: 'linear-gradient(135deg, #d35400, #E17055)',
                  boxShadow: '0 2px 8px rgba(211, 84, 0, 0.35)',
                }}
              >
                <i className="bi bi-play-circle-fill"></i> Video Nổi Bật
              </span>
            </div>

            <h1 className="category-cinema-hero-title">
              {categoryInfo.label}
            </h1>

            <p className="category-cinema-hero-desc">
              {categoryInfo.description}
            </p>

            <div className="category-cinema-hero-actions">
              <button
                type="button"
                className="category-cinema-hero-cta"
                style={{ background: 'linear-gradient(135deg, #d35400, #E17055)', boxShadow: '0 8px 24px rgba(211, 84, 0, 0.4)' }}
                onClick={() => setActiveVideo({
                  id: 'manga-hero-video',
                  title: `Video Nổi Bật — ${categoryInfo.label}`,
                  mediaUrl: '/manga-hero-video.mp4',
                })}
              >
                <i className="bi bi-arrows-fullscreen fs-6"></i>
                <span>Xem Bản Chi Tiết (Full Video)</span>
              </button>

              <button
                type="button"
                className="category-cinema-hero-btn-secondary"
                onClick={toggleMangaHeroAudio}
                title={mangaHeroMuted ? 'Bật âm thanh video' : 'Tắt tiếng video'}
              >
                <i className={`bi ${mangaHeroMuted ? 'bi-volume-mute-fill' : 'bi-volume-up-fill'} fs-6`}></i>
                <span>{mangaHeroMuted ? 'Bật Âm Thanh' : 'Tắt Âm Thanh'}</span>
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
      ) : categoryId === 'gaming' ? (
        /* EXCLUSIVE SCI-FI CYBERPUNK GAMING HUD HERO BANNER */
        <div className="gaming-cyber-hero mb-4 position-relative overflow-hidden">
          {/* Cyber Grid Background lines */}
          <div className="gaming-cyber-grid-bg"></div>
          <div className="gaming-cyber-scanlines"></div>

          {/* Active Laser Radar Scan Beam */}
          {gamingScannerActive && <div className="gaming-laser-scanner"></div>}

          {/* Corner HUD Brackets */}
          <div className="gaming-hud-corner corner-tl"></div>
          <div className="gaming-hud-corner corner-tr"></div>
          <div className="gaming-hud-corner corner-bl"></div>
          <div className="gaming-hud-corner corner-br"></div>

          {/* Telemetry Status Bar */}
          <div className="gaming-telemetry-bar">
            <span><i className="bi bi-cpu-fill text-warning me-1"></i>[ SYS: ONLINE ]</span>
            <span><i className="bi bi-broadcast me-1 text-info"></i>PING: 12ms // 144 FPS</span>
            <span><i className="bi bi-shield-lock-fill text-success me-1"></i>SEC_LVL: 09</span>
            <span><i className="bi bi-terminal-fill me-1"></i>CORE: SCI-FI_CYBERPUNK</span>
            <span className="ms-auto text-white-50 d-none d-md-inline">// PROTOCOL: FANDOM_v4.2</span>
          </div>

          <div className="row align-items-center position-relative" style={{ zIndex: 3 }}>
            <div className="col-lg-8">
              <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                <span className="badge-category badge-category-gaming fs-6">
                  <i className="bi bi-controller me-1"></i> [ GAMING.EXE ]
                </span>
                <span className="badge gaming-stat-chip">
                  <i className="bi bi-lightning-charge-fill me-1 text-warning"></i>CYBERPUNK & FUTURE TECH
                </span>
                <span className="badge gaming-stat-chip text-white-50">
                  <i className="bi bi-soundwave me-1"></i>SYNTH_ENGINE
                </span>
              </div>

              <h1 className="gaming-hero-title">
                GAMING & ESPORTS
              </h1>

              <p className="gaming-hero-desc">
                Thế giới game đỉnh cao, eSports, các tựa game bom tấn AAA và những kiệt tác khoa học viễn tưởng.
                Khám phá thế giới mở tương lai, các chiến binh Cyberpunk và những trận đại chiến ngoạn mục.
              </p>

              <div className="d-flex align-items-center gap-2 flex-wrap">
                <button
                  type="button"
                  className="gaming-btn-cyber-primary d-flex align-items-center gap-2"
                  onClick={toggleGamingScanner}
                  title="Kích hoạt rada quét laser Cyber HUD"
                >
                  <i className={`bi ${gamingScannerActive ? 'bi-radar text-warning' : 'bi-crosshair'}`}></i>
                  <span>{gamingScannerActive ? '[ RADAR QUÉT: ĐANG BẬT ]' : '[ KÍCH HOẠT CYBER RADAR ]'}</span>
                </button>

                <button
                  type="button"
                  className="gaming-btn-cyber-secondary d-flex align-items-center gap-1"
                  onClick={() => {
                    const el = document.getElementById('gaming-content-tabs');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <i className="bi bi-arrow-down-short fs-6"></i>
                  <span>// TRUY CẬP DỮ LIỆU</span>
                </button>
              </div>
            </div>

            <div className="col-lg-4 mt-4 mt-lg-0">
              <div className="p-3 rounded-3" style={{ background: 'rgba(0, 255, 204, 0.04)', border: '1px solid rgba(0, 255, 204, 0.2)' }}>
                <div className="gaming-font-mono text-warning small mb-2 d-flex align-items-center justify-content-between">
                  <span>// TELEMETRY_STATS</span>
                  <span className="badge bg-success p-1" style={{ width: '6px', height: '6px' }}></span>
                </div>
                <div className="d-flex flex-column gap-2 gaming-font-mono" style={{ fontSize: '0.85rem' }}>
                  <div className="d-flex justify-content-between text-white-50 border-bottom border-secondary border-opacity-25 pb-1">
                    <span>SYS.DATABASE:</span>
                    <strong className="text-white">{contents.length} TITLES</strong>
                  </div>
                  <div className="d-flex justify-content-between text-white-50 border-bottom border-secondary border-opacity-25 pb-1">
                    <span>ROSTER.ACTIVE:</span>
                    <strong className="text-white">{characters.length} OPERATORS</strong>
                  </div>
                  <div className="d-flex justify-content-between text-white-50">
                    <span>OPS.MISSION:</span>
                    <strong className="text-white">{events.length} TOURNAMENTS</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Category Header Banner (default categories) */
        <div
          className={`p-4 p-md-5 rounded-4 shadow-sm mb-4 accent-border-${categoryId} d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3`}
          style={{
            backgroundColor: isDark ? '#12162a' : '#ffffff',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)',
          }}
        >
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className={`badge-category badge-category-${categoryId} fs-6`}>
                <i className={`bi ${categoryInfo.icon} me-1`}></i> Fandom Universe
              </span>
            </div>
            <h1 className={`font-heading display-5 fw-bold mb-2 ${isDark ? 'text-white' : 'text-dark'}`} style={{ color: isDark ? '#ffffff' : '#0f172a' }}>
              {categoryInfo.label}
            </h1>
            <p className={`lead fs-6 mb-0 ${isDark ? 'text-white-50' : 'text-secondary'}`} style={{ maxWidth: '650px', color: isDark ? '#94a3b8' : '#475569' }}>
              {categoryInfo.description}
            </p>
          </div>

          <div className={`d-flex flex-row flex-md-column gap-2 text-md-end ${isDark ? 'text-white-50' : 'text-muted'} small`}>
            <div><i className="bi bi-file-text me-1 text-primary"></i> <strong className={isDark ? 'text-white' : 'text-dark'}>{contents.length}</strong> bài viết & media</div>
            <div><i className="bi bi-people me-1 text-success"></i> <strong className={isDark ? 'text-white' : 'text-dark'}>{characters.length}</strong> nhân vật tiêu biểu</div>
            <div><i className="bi bi-calendar-event me-1 text-warning"></i> <strong className={isDark ? 'text-white' : 'text-dark'}>{events.length}</strong> sự kiện nổi bật</div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div
        id="gaming-content-tabs"
        className="p-2 rounded-4 mb-4 shadow-xs"
        style={{
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#ffffff',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)',
        }}
      >
        <ul className="nav nav-pills fv-chips-scroll justify-content-start justify-content-md-center gap-2 p-1" role="tablist">
          <li className="nav-item">
            <button
              className={`nav-link rounded-pill py-2 px-3 fw-semibold text-nowrap d-flex align-items-center justify-content-center gap-2 ${
                activeTab === 'content' ? 'active shadow-sm text-white' : isDark ? 'text-white-50' : 'text-secondary'
              }`}
              style={{
                background: activeTab === 'content' ? 'linear-gradient(135deg, #6C5CE7, #8075e8)' : 'transparent',
                fontWeight: 600,
              }}
              onClick={() => setActiveTab('content')}
            >
              <i className="bi bi-collection-play-fill"></i>
              <span>{t('categoryHub.tabContent', { count: contents.length })}</span>
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link rounded-pill py-2 px-3 fw-semibold text-nowrap d-flex align-items-center justify-content-center gap-2 ${
                activeTab === 'characters' ? 'active shadow-sm text-white' : isDark ? 'text-white-50' : 'text-secondary'
              }`}
              style={{
                background: activeTab === 'characters' ? 'linear-gradient(135deg, #6C5CE7, #8075e8)' : 'transparent',
                fontWeight: 600,
              }}
              onClick={() => setActiveTab('characters')}
            >
              <i className="bi bi-people-fill"></i>
              <span>{t('categoryHub.tabCharacters', { count: characters.length })}</span>
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link rounded-pill py-2 px-3 fw-semibold text-nowrap d-flex align-items-center justify-content-center gap-2 ${
                activeTab === 'events' ? 'active shadow-sm text-white' : isDark ? 'text-white-50' : 'text-secondary'
              }`}
              style={{
                background: activeTab === 'events' ? 'linear-gradient(135deg, #6C5CE7, #8075e8)' : 'transparent',
                fontWeight: 600,
              }}
              onClick={() => setActiveTab('events')}
            >
              <i className="bi bi-calendar-check-fill"></i>
              <span>{t('categoryHub.tabEvents', { count: events.length })}</span>
            </button>
          </li>
        </ul>
      </div>

      {/* TAB 1: CONTENTS */}
      {activeTab === 'content' && (
        <div>
          {/* Filter & Sort Bar */}
          <div
            className="p-3 rounded-4 mb-4 shadow-xs d-flex flex-wrap gap-3 align-items-center justify-content-between"
            style={{
              backgroundColor: isDark ? '#12162a' : '#ffffff',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)',
            }}
          >
            {/* Type Filters */}
            <div className="fv-chips-scroll flex-grow-1 align-items-center me-md-2">
              <button
                type="button"
                className={`btn btn-sm rounded-pill px-3 py-1 ${
                  selectedType === 'all' ? 'btn-primary' : isDark ? 'btn-outline-light text-white-50' : 'btn-outline-secondary'
                }`}
                onClick={() => setSelectedType('all')}
              >
                {t('navbar.all')} ({formatCounts.all})
              </button>
              <button
                type="button"
                className={`btn btn-sm rounded-pill px-3 py-1 ${
                  selectedType === 'article' ? 'btn-primary' : isDark ? 'btn-outline-light text-white-50' : 'btn-outline-secondary'
                }`}
                onClick={() => setSelectedType('article')}
              >
                <i className="bi bi-file-text me-1"></i> {t('contentTypes.article')} ({formatCounts.article})
              </button>
              <button
                type="button"
                className={`btn btn-sm rounded-pill px-3 py-1 ${
                  selectedType === 'gallery' ? 'btn-primary' : isDark ? 'btn-outline-light text-white-50' : 'btn-outline-secondary'
                }`}
                onClick={() => setSelectedType('gallery')}
              >
                <i className="bi bi-images me-1"></i> {t('categoryHub.filterGallery')} ({formatCounts.gallery})
              </button>
              <button
                type="button"
                className={`btn btn-sm rounded-pill px-3 py-1 ${
                  selectedType === 'video' ? 'btn-primary' : isDark ? 'btn-outline-light text-white-50' : 'btn-outline-secondary'
                }`}
                onClick={() => setSelectedType('video')}
              >
                <i className="bi bi-play-circle me-1"></i> {t('contentTypes.video')} ({formatCounts.video})
              </button>
              <button
                type="button"
                className={`btn btn-sm rounded-pill px-3 py-1 ${
                  selectedType === 'audio' ? 'btn-primary' : isDark ? 'btn-outline-light text-white-50' : 'btn-outline-secondary'
                }`}
                onClick={() => setSelectedType('audio')}
              >
                <i className="bi bi-soundwave me-1"></i> {t('categoryHub.filterAudio')} ({formatCounts.audio})
              </button>
            </div>

            {/* Sort Options */}
            <div className="d-flex align-items-center gap-2">
              <label className={`small fw-semibold text-nowrap ${isDark ? 'text-white-50' : 'text-secondary'}`}>{t('categoryHub.sortLabel')}</label>
              <select
                className={`form-select form-select-sm rounded-pill ${isDark ? 'bg-dark text-white border-secondary' : 'bg-white text-dark'}`}
                style={{ width: '160px' }}
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
              >
                <option value="newest">{t('categoryHub.sortNewest')}</option>
                <option value="alphabetical">{t('categoryHub.sortAlpha')}</option>
                <option value="featured">{t('categoryHub.sortFeatured')}</option>
              </select>
            </div>
          </div>

          {/* Content Cards Grid */}
          {filteredContents.length === 0 ? (
            <EmptyState
              title={t('categoryHub.noContentTitle')}
              message={t('categoryHub.noContentMessage')}
              onAction={() => setSelectedType('all')}
              actionLabel={t('categoryHub.viewAllContent')}
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
          <div
            className="p-3 rounded-4 mb-4 shadow-xs d-flex align-items-center gap-3"
            style={{
              backgroundColor: isDark ? '#12162a' : '#ffffff',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)',
            }}
          >
            <span className={`small fw-semibold ${isDark ? 'text-white-50' : 'text-secondary'}`}>{t('categoryHub.filterByFranchiseLabel')}</span>
            <select
              className={`form-select form-select-sm rounded-pill ${isDark ? 'bg-dark text-white border-secondary' : 'bg-white text-dark'}`}
              style={{ maxWidth: '280px' }}
              value={selectedFranchise}
              onChange={(e) => setSelectedFranchise(e.target.value)}
            >
              <option value="all">{t('categoryHub.allFranchise')}</option>
              {franchises.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
            <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 rounded-pill ms-auto px-3 py-1.5">
              {t('categoryHub.charactersCountBadge', { count: filteredCharacters.length })}
            </span>
          </div>

          {/* Characters Grid (>=5 characters) */}
          <div className="row g-2 g-md-4">
            {filteredCharacters.map((char) => (
              <div key={char.id} className="col-xl-2 col-lg-3 col-md-4 col-6">
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
          <div
            className="p-3 rounded-4 mb-4 shadow-xs d-flex align-items-center justify-content-between"
            style={{
              backgroundColor: isDark ? '#12162a' : '#ffffff',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)',
            }}
          >
            <div className="d-flex align-items-center gap-2">
              <span className={`small fw-semibold ${isDark ? 'text-white-50' : 'text-secondary'}`}>{t('categoryHub.statusLabel')}</span>
              <div className="btn-group btn-group-sm">
                <button
                  type="button"
                  className={`btn rounded-pill-start ${selectedEventStatus === 'all' ? (isDark ? 'btn-light' : 'btn-dark') : 'btn-outline-secondary'}`}
                  onClick={() => setSelectedEventStatus('all')}
                >
                  {t('navbar.all')}
                </button>
                <button
                  type="button"
                  className={`btn ${selectedEventStatus === 'upcoming' ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary'}`}
                  onClick={() => setSelectedEventStatus('upcoming')}
                >
                  {t('categoryHub.statusUpcoming')}
                </button>
                <button
                  type="button"
                  className={`btn rounded-pill-end ${selectedEventStatus === 'past' ? 'btn-secondary text-white' : 'btn-outline-secondary'}`}
                  onClick={() => setSelectedEventStatus('past')}
                >
                  {t('categoryHub.statusPast')}
                </button>
              </div>
            </div>

            <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 rounded-pill px-3 py-1.5">
              {t('categoryHub.eventsCountBadge', { count: filteredEvents.length })}
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
          title={t('categoryHub.galleryTitle', { label: categoryInfo.label })}
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
