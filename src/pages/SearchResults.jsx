import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { searchService } from '../services/searchService.js';
import { CATEGORY_LIST } from '../constants.js';
import { useTheme } from '../context/ThemeContext.jsx';
import EmptyState from '../components/common/EmptyState.jsx';

const CONTENT_TYPES_OPTIONS = [
  { id: 'all', label: 'Tất cả định dạng', icon: 'bi-grid-fill' },
  { id: 'character', label: 'Nhân vật', icon: 'bi-person-badge' },
  { id: 'article', label: 'Bài viết', icon: 'bi-file-earmark-text' },
  { id: 'trailer', label: 'Trailer & Video', icon: 'bi-play-btn-fill' },
  { id: 'merchandise', label: 'Vật phẩm', icon: 'bi-bag-heart-fill' },
  { id: 'event', label: 'Sự kiện', icon: 'bi-calendar-event' },
  { id: 'gallery', label: 'Thư viện ảnh', icon: 'bi-images' },
  { id: 'audio', label: 'Audio / Podcast', icon: 'bi-soundwave' },
];

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const queryParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || 'all';
  const typeParam = searchParams.get('type') || 'all';
  const sortParam = searchParams.get('sort') || 'relevance';

  const [inputKeyword, setInputKeyword] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedType, setSelectedType] = useState(typeParam);
  const [sortBy, setSortBy] = useState(sortParam);

  // Sync state whenever URL query params change (e.g., from Navbar search)
  useEffect(() => {
    setInputKeyword(queryParam);
    setSelectedCategory(categoryParam);
    setSelectedType(typeParam);
    setSortBy(sortParam);
  }, [queryParam, categoryParam, typeParam, sortParam]);

  // Update URL search parameters when filters change
  const applyFilters = ({ q = inputKeyword, category = selectedCategory, type = selectedType, sort = sortBy }) => {
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (category && category !== 'all') params.set('category', category);
    if (type && type !== 'all') params.set('type', type);
    if (sort && sort !== 'relevance') params.set('sort', sort);
    setSearchParams(params);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    applyFilters({ q: inputKeyword });
  };

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    applyFilters({ category: catId });
  };

  const handleTypeChange = (typeId) => {
    setSelectedType(typeId);
    applyFilters({ type: typeId });
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    applyFilters({ sort: newSort });
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedType('all');
    setSortBy('relevance');
    const params = new URLSearchParams();
    if (inputKeyword.trim()) params.set('q', inputKeyword.trim());
    setSearchParams(params);
  };

  // Perform search query
  const rawResults = useMemo(() => {
    return searchService.search(queryParam, {
      category: selectedCategory,
      type: selectedType,
    });
  }, [queryParam, selectedCategory, selectedType]);

  // Apply sorting
  const results = useMemo(() => {
    const list = [...rawResults];
    if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    } else if (sortBy === 'alpha-asc') {
      list.sort((a, b) => (a.title || '').localeCompare(b.title || '', 'vi'));
    } else if (sortBy === 'alpha-desc') {
      list.sort((a, b) => (b.title || '').localeCompare(a.title || '', 'vi'));
    }
    return list;
  }, [rawResults, sortBy]);

  const hasActiveFilters = selectedCategory !== 'all' || selectedType !== 'all';

  return (
    <div className="container-fluid px-3 px-md-4 px-lg-5 py-4">
      {/* Search Header */}
      <div className="mb-4">
        <div className="d-flex align-items-center gap-2 mb-2">
          <span
            className="d-inline-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: '36px',
              height: '36px',
              background: 'linear-gradient(135deg, #6C5CE7 0%, #a29bfe 100%)',
              color: '#ffffff',
            }}
          >
            <i className="bi bi-search fs-5"></i>
          </span>
          <h1 className="font-heading display-6 fw-bold mb-0">Tìm Kiếm Toàn Cục</h1>
        </div>
        <p className="text-secondary mb-3">
          Quét qua toàn bộ bài viết, bộ ảnh, trailer, nhân vật, sự kiện và sản phẩm trong vũ trụ FandomVerse.
        </p>

        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit}>
          <div
            className="input-group input-group-lg shadow-sm rounded-pill overflow-hidden border"
            style={{
              borderColor: 'rgba(162, 155, 254, 0.4)',
              background: isDark ? 'rgba(255, 255, 255, 0.06)' : '#ffffff',
            }}
          >
            <span className="input-group-text bg-transparent border-0 ps-4 text-primary">
              <i className="bi bi-search fs-5"></i>
            </span>
            <input
              type="search"
              className="form-control border-0 bg-transparent"
              placeholder="Nhập tên nhân vật, tựa phim, bài viết hoặc franchise..."
              value={inputKeyword}
              onChange={(e) => setInputKeyword(e.target.value)}
              aria-label="Từ khóa tìm kiếm"
            />
            {inputKeyword && (
              <button
                type="button"
                className="btn bg-transparent border-0 text-secondary pe-2"
                onClick={() => {
                  setInputKeyword('');
                  applyFilters({ q: '' });
                }}
                title="Xóa từ khóa"
              >
                <i className="bi bi-x-circle-fill"></i>
              </button>
            )}
            <button
              className="btn btn-primary-fv px-4 fw-semibold d-flex align-items-center gap-2"
              type="submit"
            >
              <i className="bi bi-search"></i>
              <span>Tìm Kiếm</span>
            </button>
          </div>
        </form>
      </div>

      {/* Filter Control Section */}
      <div
        className="card border mb-4 shadow-sm"
        style={{
          borderRadius: '1.25rem',
          background: isDark ? 'rgba(255, 255, 255, 0.04)' : '#f8f9fa',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
        }}
      >
        <div className="card-body p-3 p-md-4">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-funnel-fill text-primary fs-5"></i>
              <h6 className="font-heading fw-bold mb-0">Bộ Lọc Nội Dung</h6>
              {hasActiveFilters && (
                <span className="badge rounded-pill bg-primary" style={{ fontSize: '0.7rem' }}>
                  Đang lọc
                </span>
              )}
            </div>

            {/* Sort & Reset Actions */}
            <div className="d-flex align-items-center gap-3">
              <div className="d-flex align-items-center gap-2">
                <label className="small text-secondary text-nowrap fw-semibold">
                  <i className="bi bi-sort-down me-1"></i>Sắp xếp:
                </label>
                <select
                  className="form-select form-select-sm"
                  style={{ width: 'auto', minWidth: '140px' }}
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                >
                  <option value="relevance">Độ liên quan</option>
                  <option value="newest">Mới nhất</option>
                  <option value="alpha-asc">Tên (A → Z)</option>
                  <option value="alpha-desc">Tên (Z → A)</option>
                </select>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger rounded-pill px-3 d-flex align-items-center gap-1.5"
                  onClick={handleResetFilters}
                  title="Xóa tất cả bộ lọc"
                >
                  <i className="bi bi-arrow-counterclockwise"></i>
                  <span>Đặt lại</span>
                </button>
              )}
            </div>
          </div>

          {/* Category Chips Bar */}
          <div className="mb-3">
            <div className="small fw-semibold text-secondary mb-2 d-flex align-items-center gap-1.5">
              <i className="bi bi-compass"></i> Vũ trụ / Danh mục:
            </div>
            <div className="d-flex flex-wrap gap-2">
              <button
                type="button"
                className={`btn btn-sm rounded-pill px-3 py-1.5 fw-medium transition-all ${
                  selectedCategory === 'all'
                    ? 'btn-primary shadow-xs'
                    : isDark
                    ? 'btn-outline-secondary text-light'
                    : 'btn-outline-secondary bg-white'
                }`}
                onClick={() => handleCategoryChange('all')}
              >
                <i className="bi bi-grid-fill me-1.5"></i> Tất cả vũ trụ
              </button>
              {CATEGORY_LIST.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`btn btn-sm rounded-pill px-3 py-1.5 fw-medium transition-all ${
                    selectedCategory === c.id
                      ? 'btn-primary shadow-xs'
                      : isDark
                      ? 'btn-outline-secondary text-light'
                      : 'btn-outline-secondary bg-white'
                  }`}
                  onClick={() => handleCategoryChange(c.id)}
                >
                  <i className={`bi ${c.icon} me-1.5`} style={{ color: selectedCategory === c.id ? '#ffffff' : c.accentColor }}></i>
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content Type Chips Bar */}
          <div>
            <div className="small fw-semibold text-secondary mb-2 d-flex align-items-center gap-1.5">
              <i className="bi bi-layers"></i> Loại nội dung / Định dạng:
            </div>
            <div className="d-flex flex-wrap gap-2">
              {CONTENT_TYPES_OPTIONS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`btn btn-sm rounded-pill px-3 py-1.5 fw-medium transition-all ${
                    selectedType === t.id
                      ? 'btn-info text-white shadow-xs'
                      : isDark
                      ? 'btn-outline-secondary text-light'
                      : 'btn-outline-secondary bg-white'
                  }`}
                  onClick={() => handleTypeChange(t.id)}
                >
                  <i className={`bi ${t.icon} me-1.5`}></i>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
        <h5 className="font-heading fw-bold mb-0 d-flex align-items-center gap-2">
          <span>Kết quả tìm kiếm</span>
          {queryParam && (
            <span className="text-primary font-monospace fw-semibold">
              "{queryParam}"
            </span>
          )}
        </h5>
        <span className="badge bg-primary rounded-pill px-3 py-2 fw-medium fs-6">
          {results.length} kết quả
        </span>
      </div>

      {/* Results Grid */}
      {results.length === 0 ? (
        <EmptyState
          title="Không tìm thấy kết quả phù hợp"
          message={
            queryParam
              ? `Không có kết quả nào khớp với từ khóa "${queryParam}" trong các bộ lọc hiện tại. Hãy thử từ khóa khác hoặc đặt lại bộ lọc.`
              : 'Hãy nhập từ khóa tìm kiếm hoặc chọn danh mục để khám phá nội dung FandomVerse.'
          }
          actionLabel="Đặt lại bộ lọc & Tìm lại"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="row g-3">
          {results.map((item) => (
            <div key={`${item.resultType}-${item.id}`} className="col-xl-4 col-lg-6 col-12">
              <div
                className={`card fv-card h-100 p-3 accent-border-${item.category} border shadow-sm d-flex flex-row gap-3 align-items-center`}
                style={{ borderRadius: '1rem' }}
              >
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="rounded-3 object-fit-cover shadow-xs"
                    style={{ width: '96px', height: '96px', flexShrink: 0 }}
                  />
                ) : (
                  <div
                    className="rounded-3 d-flex align-items-center justify-content-center text-primary"
                    style={{
                      width: '96px',
                      height: '96px',
                      backgroundColor: 'rgba(108, 92, 231, 0.12)',
                      flexShrink: 0,
                    }}
                  >
                    <i className="bi bi-file-earmark-text fs-2"></i>
                  </div>
                )}

                <div className="flex-grow-1 min-w-0">
                  <div className="d-flex align-items-center gap-2 mb-1.5 flex-wrap">
                    <span
                      className={`badge-category badge-category-${item.category}`}
                      style={{ fontSize: '0.68rem', padding: '0.2rem 0.55rem' }}
                    >
                      {item.category?.toUpperCase()}
                    </span>
                    <span
                      className="badge bg-secondary bg-opacity-10 text-secondary border small"
                      style={{ fontSize: '0.68rem', padding: '0.2rem 0.55rem' }}
                    >
                      {item.resultType}
                    </span>
                  </div>

                  <h6 className="font-heading fw-bold mb-1 text-truncate" title={item.title}>
                    {item.title}
                  </h6>

                  <p
                    className="text-secondary small mb-2 line-clamp-2"
                    style={{ fontSize: '0.82rem', lineHeight: '1.4' }}
                  >
                    {item.description}
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      const cleanPath = item.targetUrl.replace(/^#/, '');
                      navigate(cleanPath);
                    }}
                    className="btn btn-sm btn-outline-fv py-1 px-2.5 small d-inline-flex align-items-center gap-1.5"
                    style={{ fontSize: '0.78rem' }}
                  >
                    <span>Xem chi tiết</span>
                    <i className="bi bi-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
