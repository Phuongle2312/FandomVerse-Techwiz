import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CATEGORY_LIST } from '../constants.js';

export default function About() {
  const { t } = useTranslation();
  const CATEGORY_LIST_LOCALIZED = CATEGORY_LIST.map((cat) => ({
    ...cat,
    label: t(`categories.${cat.id}.label`),
    description: t(`categories.${cat.id}.description`),
  }));

  return (
    <div className="container-fluid px-3 px-md-4 px-lg-5 py-4">
      {/* Hero Section */}
      <div className="text-center py-5 mb-5 bg-primary bg-opacity-10 rounded-4 px-3">
        <span style={{ fontSize: '3rem' }}>🌌</span>
        <h1 className="font-heading display-5 fw-bold text-primary mb-3">{t('about.title')}</h1>
        <p className="lead text-secondary mx-auto" style={{ maxWidth: '700px' }}>
          {t('about.subtitle')}
        </p>
        <div className="badge bg-primary px-3 py-2 fs-6 rounded-pill mt-2">
          {t('about.contestBadge')}
        </div>
      </div>

      {/* Vision & Problem Statement */}
      <div className="row g-4 align-items-center mb-5">
        <div className="col-lg-6">
          <h2 className="font-heading fw-bold text-dark mb-3">{t('about.missionTitle')}</h2>
          <p className="text-secondary leading-relaxed">
            {t('about.missionP1')}
          </p>
          <p className="text-secondary leading-relaxed">
            <strong>FandomVerse</strong> {t('about.missionP2')}
          </p>
        </div>
        <div className="col-lg-6">
          <div className="p-4 bg-white rounded-4 border shadow-sm">
            <h4 className="font-heading fw-bold text-primary mb-3">{t('about.techTitle')}</h4>
            <ul className="list-unstyled mb-0 d-flex flex-column gap-3">
              <li className="d-flex align-items-start gap-2">
                <i className="bi bi-cpu text-primary fs-5 mt-1"></i>
                <div>
                  <strong>{t('about.tech1Title')}</strong> {t('about.tech1Desc')}
                </div>
              </li>
              <li className="d-flex align-items-start gap-2">
                <i className="bi bi-robot text-success fs-5 mt-1"></i>
                <div>
                  <strong>{t('about.tech2Title')}</strong> {t('about.tech2Desc')}
                </div>
              </li>
              <li className="d-flex align-items-start gap-2">
                <i className="bi bi-phone text-warning fs-5 mt-1"></i>
                <div>
                  <strong>{t('about.tech3Title')}</strong> {t('about.tech3Desc')}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 7 Fandom Universes Grid */}
      <div className="mb-5">
        <h3 className="font-heading fw-bold text-center mb-4">{t('about.universesTitle')}</h3>
        <div className="row g-3">
          {CATEGORY_LIST_LOCALIZED.map((cat) => (
            <div key={cat.id} className="col-md-4 col-sm-6">
              <div className={`card fv-card h-100 p-3 accent-border-${cat.id} border-0 shadow-sm`}>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className={`badge-category badge-category-${cat.id}`}>
                    <i className={`bi ${cat.icon} me-1`}></i> {cat.label}
                  </span>
                </div>
                <p className="text-secondary small mb-3 flex-grow-1">{cat.description}</p>
                <Link to={`/category/${cat.id}`} className="btn btn-sm btn-outline-fv w-100">
                  {t('about.exploreCategory', { label: cat.label })}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Aptech Credential Box */}
      <div className="p-4 bg-light rounded-4 text-center border">
        <h5 className="font-heading fw-bold mb-2">{t('about.creditsTitle')}</h5>
        <p className="text-muted small mx-auto mb-3" style={{ maxWidth: '600px' }}>
          {t('about.creditsDesc')}
        </p>
        <Link to="/" className="btn btn-primary-fv px-4 py-2">
          {t('about.startJourney')}
        </Link>
      </div>
    </div>
  );
}
