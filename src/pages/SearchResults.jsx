import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchService } from '../services/searchService.js';
import { CATEGORY_LIST } from '../constants.js';
import EmptyState from '../components/common/EmptyState.jsx';

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [inputKeyword, setInputKeyword] = useState(query);

  const results = useMemo(() => {
    return searchService.search(query, {
      category: selectedCategory,
      type: selectedType,
    });
  }, [query, selectedCategory, selectedType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (inputKeyword.trim()) {
      setSearchParams({ q: inputKeyword.trim() });
    }
  };

  return (
    <div className="container py-4">
      {/* Search Header */}
      <div className="mb-4">
        <h1 className="font-heading display-6 fw-bold text-dark mb-2">Tìm Kiếm Toàn Cục</h1>
        <p className="text-secondary">
          Quét qua toàn bộ bài viết, bộ ảnh, trailer, nhân vật, sự kiện và sản phẩm trong vũ trụ FandomVerse.
        </p>

        {/* Input Form */}
        <form onSubmit={handleSearchSubmit} className="mt-3">
          <div className="input-group input-group-lg shadow-sm rounded-pill overflow-hidden border">
            <span className="input-group-text bg-white border-0 ps-4 text-primary">
              <i className="bi bi-search fs-5"></i>
            </span>
            <input
              type="search"
              className="form-control border-0 bg-white"
              placeholder="Nhập tên nhân vật, tựa phim, bài viết hoặc franchise..."
              value={inputKeyword}
              onChange={(e) => setInputKeyword(e.target.value)}
              aria-label="Từ khóa tìm kiếm"
            />
            <button className="btn btn-primary-fv px-4 fw-semibold" type="submit">
              Tìm Kiếm
            </button>
          </div>
        </form>
      </div>

      {/* Filter Toolbar */}
      <div className="row g-3 align-items-center mb-4 p-3 bg-light rounded-4 border">
        {/* Category Filter */}
        <div className="col-md-6 col-12 d-flex align-items-center gap-2">
          <label className="small fw-semibold text-secondary text-nowrap">Danh mục:</label>
          <select
            className="form-select form-select-sm bg-white"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">Tất cả 7 danh mục</option>
            {CATEGORY_LIST.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div className="col-md-6 col-12 d-flex align-items-center gap-2">
          <label className="small fw-semibold text-secondary text-nowrap">Loại nội dung:</label>
          <select
            className="form-select form-select-sm bg-white"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">Tất cả định dạng</option>
            <option value="article">Bài viết (Article)</option>
            <option value="gallery">Thư viện ảnh (Gallery)</option>
            <option value="video">Video</option>
            <option value="audio">Audio / Podcast</option>
            <option value="character">Nhân vật (Character)</option>
            <option value="event">Sự kiện (Event)</option>
            <option value="trailer">Trailer</option>
            <option value="merchandise">Vật phẩm (Merchandise)</option>
          </select>
        </div>
      </div>

      {/* Results Header */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5 className="font-heading fw-bold mb-0">
          Kết quả tìm kiếm cho <span className="text-primary font-monospace">"{query}"</span>
        </h5>
        <span className="badge bg-primary rounded-pill px-3 py-2">
          {results.length} kết quả
        </span>
      </div>

      {/* Results Grid */}
      {results.length === 0 ? (
        <EmptyState
          title="Không tìm thấy kết quả phù hợp"
          message={`Không có kết quả nào khớp với từ khóa "${query}". Hãy thử tìm kiếm bằng từ khóa ngắn gọn hơn hoặc chọn "Tất cả danh mục".`}
          actionLabel="Xem các danh mục nổi bật"
          onAction={() => setSelectedCategory('all')}
        />
      ) : (
        <div className="row g-3">
          {results.map((item) => (
            <div key={item.id} className="col-md-6 col-12">
              <div className={`card fv-card h-100 p-3 accent-border-${item.category} border-0 shadow-sm d-flex flex-row gap-3 align-items-center`}>
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="rounded-3 object-fit-cover shadow-xs"
                    style={{ width: '90px', height: '90px', flexShrink: 0 }}
                  />
                ) : (
                  <div
                    className="rounded-3 d-flex align-items-center justify-content-center text-primary"
                    style={{ width: '90px', height: '90px', backgroundColor: 'var(--color-primary-light)', flexShrink: 0 }}
                  >
                    <i className="bi bi-file-earmark-text fs-2"></i>
                  </div>
                )}

                <div className="flex-grow-1 min-w-0">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span className={`badge-category badge-category-${item.category}`} style={{ fontSize: '0.65rem' }}>
                      {item.category.toUpperCase()}
                    </span>
                    <span className="badge bg-light text-secondary border small" style={{ fontSize: '0.65rem' }}>
                      {item.resultType}
                    </span>
                  </div>

                  <h6 className="font-heading fw-bold text-dark mb-1 text-truncate">
                    {item.title}
                  </h6>

                  <p className="text-secondary small mb-2 line-clamp-2" style={{ fontSize: '0.8rem' }}>
                    {item.description}
                  </p>

                  <a
                    href={item.targetUrl}
                    className="btn btn-sm btn-outline-fv py-0 px-2 small text-decoration-none"
                    style={{ fontSize: '0.75rem' }}
                  >
                    Xem chi tiết <i className="bi bi-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
