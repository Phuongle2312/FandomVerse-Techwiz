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
import CategoryContentRow from '../components/interactive/CategoryContentRow.jsx';
import SakuraEffect from '../components/interactive/SakuraEffect.jsx';
import KpopSparkleEffect from '../components/interactive/KpopSparkleEffect.jsx';
import MoviesProjectorEffect from '../components/interactive/MoviesProjectorEffect.jsx';
import MangaActionEffect from '../components/interactive/MangaActionEffect.jsx';
import GamingHextechEffect from '../components/interactive/GamingHextechEffect.jsx';
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
  const isAnime = categoryId === 'anime';
  const isKpop = categoryId === 'kpop';
  const isManga = categoryId === 'manga';
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

  // Unified Cinematic Hero Video state (matching Anime across all categories)
  const [heroMuted, setHeroMuted] = useState(true);
  const heroVideoRef = useRef(null);

  const toggleHeroAudio = () => {
    if (heroVideoRef.current) {
      heroVideoRef.current.muted = !heroMuted;
      setHeroMuted(!heroMuted);
    }
  };

  useEffect(() => {
    setHeroMuted(true);
    if (heroVideoRef.current) {
      heroVideoRef.current.muted = true;
      heroVideoRef.current.play().catch(() => {});
    }
  }, [categoryId]);

  const heroConfig = useMemo(() => {
    const configs = {
      anime: {
        videoSrc: '/GunDam.mp4',
        badgeText: 'Anime Exclusive',
        badgeGradient: 'linear-gradient(135deg, #FF6B81, #ff4757)',
        badgeShadow: 'rgba(255, 107, 129, 0.35)',
        videoTitle: 'Mobile Suit Gundam: Chiến Binh Thép Tái Xuất',
        heroSubtitle: '• Mobile Suit GunDam',
        heroDesc: 'Khám phá thế giới hoạt hình Nhật Bản đỉnh cao, các tác phẩm shounen huyền thoại cùng trailer bom tấn Mobile Suit Gundam: Chiến Binh Thép Tái Xuất với những màn đại chiến mecha mãn nhãn.',
        effect: <SakuraEffect autoStart={true} />,
      },
      gaming: {
        videoSrc: '/video_lol.mp4',
        badgeText: 'Gaming Exclusive',
        badgeGradient: 'linear-gradient(135deg, #00cec9, #0984e3)',
        badgeShadow: 'rgba(0, 206, 201, 0.35)',
        videoTitle: 'League of Legends: Cinematic eSports',
        heroSubtitle: '• League of Legends & eSports',
        heroDesc: 'Thế giới game đỉnh cao, eSports chuyên nghiệp, các tựa game bom tấn AAA cùng trailer bom tấn League of Legends Cinematic với những trận đại chiến huyền thoại và đồ họa tương lai mãn nhãn.',
        effect: <GamingHextechEffect autoStart={true} />,
      },
      manga: {
        videoSrc: '/manga-hero-video.mp4',
        badgeText: 'Manga Exclusive',
        badgeGradient: 'linear-gradient(135deg, #d35400, #E17055)',
        badgeShadow: 'rgba(211, 84, 0, 0.35)',
        videoTitle: 'Manga Shounen Jump & Seinen Masterpieces',
        heroSubtitle: '• Kho Tàng Truyện Tranh Huyền Thoại',
        heroDesc: 'Đắm chìm vào những trang truyện tranh kinh điển, các nét vẽ mực đỉnh cao từ Eiichiro Oda, Gege Akutami, Kentaro Miura đến thế giới shounen bùng nổ cảm xúc.',
        effect: <MangaActionEffect autoStart={true} />,
      },
      movies: {
        videoSrc: '/movies-hero-video.mp4',
        badgeText: 'Cinema Exclusive',
        badgeGradient: 'linear-gradient(135deg, #0984E3, #00a8ff)',
        badgeShadow: 'rgba(9, 132, 227, 0.35)',
        videoTitle: 'Hollywood & Vũ Trụ Điện Ảnh Marvel/DC',
        heroSubtitle: '• Bom Tấn Màn Bạc & Kỹ Xảo Điện Ảnh',
        heroDesc: 'Hòa mình vào vũ trụ điện ảnh đỉnh cao, những kiệt tác màn ảnh rộng, vũ trụ đa chiều MCU & DC cùng kỹ xảo CGI mãn nhãn hàng đầu thế giới.',
        effect: <MoviesProjectorEffect autoStart={true} />,
      },
      tvshows: {
        videoSrc: '/hero-video.mp4',
        badgeText: 'TV Series Exclusive',
        badgeGradient: 'linear-gradient(135deg, #6C5CE7, #a29bfe)',
        badgeShadow: 'rgba(108, 92, 231, 0.35)',
        videoTitle: 'Top TV Series & Streaming Originals',
        heroSubtitle: '• Series Truyền Hình Bom Tấn',
        heroDesc: 'Thưởng thức những mùa phim truyền hình gây bão toàn cầu, từ Stranger Things, House of the Dragon đến các tác phẩm kịch tính đỉnh cao trên các nền tảng streaming.',
        effect: <GamingHextechEffect autoStart={true} />,
      },
      kpop: {
        videoSrc: '/0925 (1).mp4',
        badgeText: 'K-Pop Universe',
        badgeGradient: 'linear-gradient(135deg, #FD79A8, #e84393)',
        badgeShadow: 'rgba(253, 121, 168, 0.35)',
        videoTitle: 'K-Pop Global Live Stage & MV Teasers',
        heroSubtitle: '• Làn Sóng Hallyu Toàn Cầu',
        heroDesc: 'Thế giới âm nhạc bùng nổ của BTS, BLACKPINK, aespa, NewJeans với các màn trình diễn vũ đạo đỉnh cao, lightstick rực rỡ và đại nhạc hội quốc tế.',
        effect: <KpopSparkleEffect autoStart={true} />,
      },
      comics: {
        videoSrc: '/hero-video.mp4',
        badgeText: 'Comics Universe',
        badgeGradient: 'linear-gradient(135deg, #FDCB6E, #e17055)',
        badgeShadow: 'rgba(253, 203, 110, 0.35)',
        videoTitle: 'Marvel & DC Comics Epic Sagas',
        heroSubtitle: '• Kỷ Nguyên Siêu Anh Hùng Đồ Họa',
        heroDesc: 'Khám phá lịch sử truyện tranh phương Tây, những huyền thoại Avengers, Batman, Spider-Man cùng các ấn bản graphic novel kinh điển.',
        effect: <MangaActionEffect autoStart={true} />,
      },
    };
    return configs[categoryId] || configs.anime;
  }, [categoryId]);

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

  // Divided Content Collections for 'All' View
  const videoContents = useMemo(() => {
    return dataService.getContentsByCategory(categoryId, { type: 'video', sort: selectedSort });
  }, [categoryId, selectedSort, language]);

  const galleryContents = useMemo(() => {
    return dataService.getContentsByCategory(categoryId, { type: 'gallery', sort: selectedSort });
  }, [categoryId, selectedSort, language]);

  const articleContents = useMemo(() => {
    return dataService.getContentsByCategory(categoryId, { type: 'article', sort: selectedSort });
  }, [categoryId, selectedSort, language]);

  const audioContents = useMemo(() => {
    return dataService.getContentsByCategory(categoryId, { type: 'audio', sort: selectedSort });
  }, [categoryId, selectedSort, language]);

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
    <div className={`container-fluid px-3 px-md-4 px-lg-5 py-4 ${isGaming ? 'gaming-universe-container' : ''} ${isAnime ? 'anime-universe-container' : ''} ${isKpop ? 'kpop-universe-container' : ''} ${isMovies ? 'movies-universe-container' : ''} ${isManga ? 'manga-universe-container' : ''}`}>
      {/* EXCLUSIVE CINEMATIC HERO BANNER — UNIFIED ACROSS ALL 7 CATEGORIES (MATCHING ANIME) */}
      <div className={`category-cinema-hero ${categoryId}-cinema-hero mb-4`}>
        <video
          key={heroConfig.videoSrc}
          ref={heroVideoRef}
          className="category-cinema-hero-bg"
          src={heroConfig.videoSrc}
          autoPlay
          loop
          muted={heroMuted}
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
            <span className={`badge-category badge-category-${categoryId} fs-6`}>
              <i className={`bi ${categoryInfo.icon} me-1`}></i> Fandom Universe
            </span>
            <span
              className="badge rounded-pill px-3 py-1 text-white small d-inline-flex align-items-center gap-1"
              style={{
                background: heroConfig.badgeGradient,
                boxShadow: `0 2px 8px ${heroConfig.badgeShadow}`,
              }}
            >
              <i className="bi bi-stars"></i> {heroConfig.badgeText}
            </span>
            <span
              className="badge rounded-pill px-3 py-1 text-white small d-inline-flex align-items-center gap-1"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.06))',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              <i className="bi bi-play-circle-fill"></i> Video Nổi Bật
            </span>
            {heroConfig.effect}
          </div>

          <h1 className="category-cinema-hero-title">
            {categoryInfo.label}
            <span className="ms-2 fs-4 fw-normal text-white-50 d-block d-sm-inline">
              {heroConfig.heroSubtitle}
            </span>
          </h1>

          <p className="category-cinema-hero-desc">
            {heroConfig.heroDesc}
          </p>

          <div className="category-cinema-hero-actions">
            <button
              type="button"
              className="category-cinema-hero-cta"
              style={{
                background: heroConfig.badgeGradient,
                boxShadow: `0 8px 24px ${heroConfig.badgeShadow}`,
              }}
              onClick={() => setActiveVideo({
                id: `${categoryId}-hero-video`,
                title: heroConfig.videoTitle,
                mediaUrl: heroConfig.videoSrc,
              })}
            >
              <i className="bi bi-arrows-fullscreen fs-6"></i>
              <span>Xem Bản Chi Tiết (Full Video)</span>
            </button>

            <button
              type="button"
              className="category-cinema-hero-btn-secondary"
              onClick={toggleHeroAudio}
              title={heroMuted ? 'Bật âm thanh video' : 'Tắt tiếng video'}
            >
              <i className={`bi ${heroMuted ? 'bi-volume-mute-fill' : 'bi-volume-up-fill'} fs-6`}></i>
              <span>{heroMuted ? 'Bật Âm Thanh' : 'Tắt Âm Thanh'}</span>
            </button>

            <button
              type="button"
              className="movies-hero-icon-btn"
              aria-label="Chia sẻ"
              title="Sao chép liên kết chia sẻ"
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                alert('Đã sao chép liên kết vũ trụ ' + categoryInfo.label + ' vào bộ nhớ tạm!');
              }}
            >
              <i className="bi bi-share-fill"></i>
            </button>
          </div>
        </div>
      </div>

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

          {/* Content Cards: Divided Distinct Rows for 'All' View OR Filtered Grid */}
          {selectedType === 'all' ? (
            <div className="category-divided-content-sections">
              {/* 1. Video Row */}
              <CategoryContentRow
                title="Video & Phân Cảnh Đặc Sắc"
                subtitle="Các đoạn video clip, trailer bom tấn và hoạt cảnh đại chiến mãn nhãn"
                icon="bi-play-circle-fill"
                color="#ff4757"
                badgeText={`${videoContents.length} Video`}
                items={videoContents}
                onOpenMedia={(v) => setActiveVideo(v)}
                onOpenGallery={(g) => setLightboxImages(g.images)}
                onFilterSelf={() => setSelectedType('video')}
              />

              {/* 2. Gallery Row */}
              <CategoryContentRow
                title="Bộ Sưu Tập Ảnh & Concept Art"
                subtitle="Phòng trưng bày hình nền 4K, bản vẽ phác thảo mecha và minh họa độc quyền"
                icon="bi-images"
                color="#feca57"
                badgeText={`${galleryContents.length} Bộ Ảnh`}
                items={galleryContents}
                onOpenMedia={(v) => setActiveVideo(v)}
                onOpenGallery={(g) => setLightboxImages(g.images)}
                onFilterSelf={() => setSelectedType('gallery')}
              />

              {/* 3. Article Row */}
              <CategoryContentRow
                title="Bài Viết Chuyên Sâu & Phân Tích"
                subtitle="Đánh giá tác phẩm, phân tích nhân vật và các bài xã luận văn hóa đặc sắc"
                icon="bi-file-text-fill"
                color="#a29bfe"
                badgeText={`${articleContents.length} Bài Viết`}
                items={articleContents}
                onOpenMedia={(v) => setActiveVideo(v)}
                onOpenGallery={(g) => setLightboxImages(g.images)}
                onFilterSelf={() => setSelectedType('article')}
              />

              {/* 4. Audio Row */}
              <CategoryContentRow
                title="Podcast & Bản Âm Thanh Fandom"
                subtitle="Nhạc nền OST kinh điển và các số radio thảo luận cùng cộng đồng"
                icon="bi-soundwave"
                color="#00cec9"
                badgeText={`${audioContents.length} Audio`}
                items={audioContents}
                onOpenMedia={(v) => setActiveVideo(v)}
                onOpenGallery={(g) => setLightboxImages(g.images)}
                onFilterSelf={() => setSelectedType('audio')}
              />
            </div>
          ) : filteredContents.length === 0 ? (
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
