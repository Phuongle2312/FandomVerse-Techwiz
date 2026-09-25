import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCategoryData } from '../hooks/useCategoryData.js';
import { dataService } from '../services/dataService.js';
import ContentCard from '../components/cards/ContentCard.jsx';
import CharacterCard from '../components/cards/CharacterCard.jsx';
import EventCard from '../components/cards/EventCard.jsx';
import LightboxGallery from '../components/interactive/LightboxGallery.jsx';
import VideoModal from '../components/interactive/VideoModal.jsx';
import EmptyState from '../components/common/EmptyState.jsx';

export default function CategoryHub() {
  const { t } = useTranslation();
  const { categoryId } = useParams();
  const { categoryInfo, contents, characters, events, franchises, isValidCategory } = useCategoryData(categoryId);

  // Tab State: 'content' | 'characters' | 'events'
  const [activeTab, setActiveTab] = useState('content');

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
          title={t('categoryHub.notFoundTitle')}
          message={t('categoryHub.notFoundMessage', { categoryId })}
          actionLabel={t('categoryHub.backHome')}
          onAction={() => (window.location.hash = '#/')}
        />
      </div>
    );
  }

  return (
    <div className="container-fluid px-3 px-md-4 px-lg-5 py-4">
      {/* Category Header Banner */}
      <div
        className={`p-4 p-md-5 rounded-4 shadow-sm mb-4 bg-white border-0 accent-border-${categoryId} d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3`}
      >
        <div>
          <div className="d-flex align-items-center gap-2 mb-2">
            <span className={`badge-category badge-category-${categoryId} fs-6`}>
              <i className={`bi ${categoryInfo.icon} me-1`}></i> {t('navbar.fandomUniverse')}
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
          <div><i className="bi bi-file-text me-1 text-primary"></i> <strong>{contents.length}</strong> {t('categoryHub.articlesMediaLabel')}</div>
          <div><i className="bi bi-people me-1 text-success"></i> <strong>{characters.length}</strong> {t('categoryHub.charactersLabel')}</div>
          <div><i className="bi bi-calendar-event me-1 text-warning"></i> <strong>{events.length}</strong> {t('categoryHub.eventsLabel')}</div>
        </div>
      </div>

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
              <span>{t('categoryHub.tabContent', { count: contents.length })}</span>
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
              <span>{t('categoryHub.tabCharacters', { count: characters.length })}</span>
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
              <span>{t('categoryHub.tabEvents', { count: events.length })}</span>
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
              <span className="small fw-semibold text-secondary me-2">{t('categoryHub.formatLabel')}</span>
              <button
                type="button"
                className={`btn btn-sm rounded-pill px-3 py-1 ${
                  selectedType === 'all' ? 'btn-primary' : 'btn-outline-secondary'
                }`}
                onClick={() => setSelectedType('all')}
              >
                {t('navbar.all')}
              </button>
              <button
                type="button"
                className={`btn btn-sm rounded-pill px-3 py-1 ${
                  selectedType === 'article' ? 'btn-primary' : 'btn-outline-secondary'
                }`}
                onClick={() => setSelectedType('article')}
              >
                <i className="bi bi-file-text me-1"></i> {t('contentTypes.article')}
              </button>
              <button
                type="button"
                className={`btn btn-sm rounded-pill px-3 py-1 ${
                  selectedType === 'gallery' ? 'btn-primary' : 'btn-outline-secondary'
                }`}
                onClick={() => setSelectedType('gallery')}
              >
                <i className="bi bi-images me-1"></i> {t('categoryHub.filterGallery')}
              </button>
              <button
                type="button"
                className={`btn btn-sm rounded-pill px-3 py-1 ${
                  selectedType === 'video' ? 'btn-primary' : 'btn-outline-secondary'
                }`}
                onClick={() => setSelectedType('video')}
              >
                <i className="bi bi-play-circle me-1"></i> {t('contentTypes.video')}
              </button>
              <button
                type="button"
                className={`btn btn-sm rounded-pill px-3 py-1 ${
                  selectedType === 'audio' ? 'btn-primary' : 'btn-outline-secondary'
                }`}
                onClick={() => setSelectedType('audio')}
              >
                <i className="bi bi-soundwave me-1"></i> {t('categoryHub.filterAudio')}
              </button>
            </div>

            {/* Sort Options */}
            <div className="d-flex align-items-center gap-2">
              <label className="small fw-semibold text-secondary text-nowrap">{t('categoryHub.sortLabel')}</label>
              <select
                className="form-select form-select-sm bg-light"
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
          <div className="p-3 bg-white rounded-4 border mb-4 shadow-xs d-flex align-items-center gap-3">
            <span className="small fw-semibold text-secondary">{t('categoryHub.filterByFranchiseLabel')}</span>
            <select
              className="form-select form-select-sm bg-light"
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
            <span className="badge bg-secondary rounded-pill ms-auto">
              {t('categoryHub.charactersCountBadge', { count: filteredCharacters.length })}
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
              <span className="small fw-semibold text-secondary">{t('categoryHub.statusLabel')}</span>
              <div className="btn-group btn-group-sm">
                <button
                  type="button"
                  className={`btn ${selectedEventStatus === 'all' ? 'btn-dark' : 'btn-outline-secondary'}`}
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
                  className={`btn ${selectedEventStatus === 'past' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                  onClick={() => setSelectedEventStatus('past')}
                >
                  {t('categoryHub.statusPast')}
                </button>
              </div>
            </div>

            <span className="badge bg-secondary rounded-pill">
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
