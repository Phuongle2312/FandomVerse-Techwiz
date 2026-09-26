import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { dataService } from '../services/dataService.js';
import { CATEGORY_LIST, PRODUCT_TYPES } from '../constants.js';
import MerchCard from '../components/cards/MerchCard.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ToastNotification from '../components/common/ToastNotification.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Merchandise() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [toast, setToast] = useState(null);

  const { setIsCartOpen, cartCount, cartTotal } = useCart();

  const CATEGORY_LIST_LOCALIZED = CATEGORY_LIST.map((cat) => ({
    ...cat,
    label: t(`categories.${cat.id}.label`),
  }));

  const PRODUCT_TYPES_LOCALIZED = PRODUCT_TYPES.map((pt) => ({
    ...pt,
    label: t(`productTypes.${pt.id}`),
  }));

  const merchandise = useMemo(() => {
    return dataService.getMerchandiseByCategory(selectedCategory, {
      productType: selectedType,
    });
  }, [selectedCategory, selectedType]);

  const handleShowToast = (message) => {
    setToast({
      message,
      type: 'success',
      icon: 'bi-bag-check-fill',
    });
  };

  return (
    <div className="container-fluid px-3 px-md-4 px-lg-5 py-4">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <h1 className="font-heading display-6 fw-bold text-dark mb-1 d-flex align-items-center gap-2">
            <i className="bi bi-shop text-success"></i> {t('merchandise.title')}
          </h1>
          <p className="text-secondary small mb-0">
            {t('merchandise.subtitle')}
          </p>
        </div>

        {/* View Cart Banner Button */}
        <button
          type="button"
          className="btn btn-primary-fv px-4 py-2 d-flex align-items-center gap-2 shadow-sm"
          onClick={() => setIsCartOpen(true)}
        >
          <i className="bi bi-cart3 fs-5"></i>
          <span>{t('merchandise.viewCart', { count: cartCount })}</span>
          {cartTotal > 0 && (
            <span className="badge bg-white text-primary ms-1 font-monospace">
              ${cartTotal.toFixed(2)}
            </span>
          )}
        </button>
      </div>

      {/* Quick Category Scroll Chips */}
      <div className="fv-chips-scroll mb-3">
        <button
          type="button"
          className={`btn btn-sm rounded-pill px-3 py-1 ${selectedCategory === 'all' ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => setSelectedCategory('all')}
        >
          {t('merchandise.allFandoms')}
        </button>
        {CATEGORY_LIST_LOCALIZED.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`btn btn-sm rounded-pill px-3 py-1 ${selectedCategory === c.id ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setSelectedCategory(c.id)}
          >
            <i className={`bi ${c.icon} me-1`}></i>
            {c.label}
          </button>
        ))}
      </div>

      {/* Filter Toolbar (collapsible / secondary) */}
      <div className="p-3 bg-light rounded-4 border mb-4">
        <div className="row g-3 align-items-center">
          {/* Category Filter */}
          <div className="col-md-6 col-12 d-flex align-items-center gap-2">
            <label className="small fw-semibold text-secondary text-nowrap">{t('merchandise.categoryLabel')}</label>
            <select
              className="form-select form-select-sm bg-white"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">{t('merchandise.allFandoms')}</option>
              {CATEGORY_LIST_LOCALIZED.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Product Type Filter */}
          <div className="col-md-6 col-12 d-flex align-items-center gap-2">
            <label className="small fw-semibold text-secondary text-nowrap">{t('merchandise.typeLabel')}</label>
            <select
              className="form-select form-select-sm bg-white"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {PRODUCT_TYPES_LOCALIZED.map((pt) => (
                <option key={pt.id} value={pt.id}>
                  {pt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {merchandise.length === 0 ? (
        <EmptyState
          title={t('merchandise.noProductsTitle')}
          message={t('merchandise.noProductsMessage')}
          onAction={() => {
            setSelectedCategory('all');
            setSelectedType('all');
          }}
          actionLabel={t('trailersHub.clearFilters')}
        />
      ) : (
        <div className="row g-2 g-md-4 fv-merch-grid">
          {merchandise.map((item) => (
            <div key={item.id} className="col-xl-3 col-lg-4 col-md-6 col-6">
              <MerchCard item={item} onToast={handleShowToast} />
            </div>
          ))}
        </div>
      )}

      <ToastNotification toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
