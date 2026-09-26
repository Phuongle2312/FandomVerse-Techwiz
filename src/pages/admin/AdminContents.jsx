import React, { useState, useEffect, useMemo } from 'react';
import { dataService } from '../../services/dataService.js';

const CATEGORIES = [
  { id: 'all', label: 'Tất cả danh mục' },
  { id: 'anime', label: 'Anime' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'movies', label: 'Movies' },
  { id: 'tvshows', label: 'TV Shows' },
  { id: 'kpop', label: 'K-Pop' },
  { id: 'comics', label: 'Comics' },
  { id: 'manga', label: 'Manga' },
];

const TYPES = [
  { id: 'all', label: 'Tất cả loại bài viết' },
  { id: 'article', label: 'Bài viết (Article)' },
  { id: 'gallery', label: 'Bộ sưu tập ảnh (Gallery)' },
  { id: 'video', label: 'Video Clip' },
  { id: 'audio', label: 'Podcast / Audio' },
];

export default function AdminContents({ onShowToast }) {
  const [items, setItems] = useState(() => dataService.getRawContents());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedFeatured, setSelectedFeatured] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    category: 'anime',
    type: 'article',
    titleVi: '',
    titleEn: '',
    shortDescVi: '',
    shortDescEn: '',
    imageUrl: '',
    videoUrl: '',
    audioUrl: '',
    subTags: '',
    featured: false,
  });

  const reloadData = () => {
    setItems(dataService.getRawContents());
  };

  useEffect(() => {
    const handleDataChange = () => reloadData();
    window.addEventListener('fv_data_change', handleDataChange);
    return () => window.removeEventListener('fv_data_change', handleDataChange);
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCat = selectedCat === 'all' || item.category === selectedCat;
      const matchType = selectedType === 'all' || item.type === selectedType;
      const matchFeatured =
        selectedFeatured === 'all' ||
        (selectedFeatured === 'featured' && item.featured) ||
        (selectedFeatured === 'standard' && !item.featured);

      const titleVi = item.title?.vi || item.title || '';
      const titleEn = item.title?.en || '';
      const matchSearch =
        !searchTerm.trim() ||
        titleVi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase());

      return matchCat && matchType && matchFeatured && matchSearch;
    });
  }, [items, searchTerm, selectedCat, selectedType, selectedFeatured]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      id: `content-${Date.now()}`,
      category: 'anime',
      type: 'article',
      titleVi: '',
      titleEn: '',
      shortDescVi: '',
      shortDescEn: '',
      imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
      videoUrl: '',
      audioUrl: '',
      subTags: 'Hot, Tin tức, Đánh giá',
      featured: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      id: item.id,
      category: item.category || 'anime',
      type: item.type || 'article',
      titleVi: item.title?.vi || (typeof item.title === 'string' ? item.title : ''),
      titleEn: item.title?.en || (typeof item.title === 'string' ? item.title : ''),
      shortDescVi: item.shortDescription?.vi || (typeof item.shortDescription === 'string' ? item.shortDescription : ''),
      shortDescEn: item.shortDescription?.en || (typeof item.shortDescription === 'string' ? item.shortDescription : ''),
      imageUrl: item.imageUrl || '',
      videoUrl: item.videoUrl || '',
      audioUrl: item.audioUrl || '',
      subTags: Array.isArray(item.subTags) ? item.subTags.map(t => typeof t === 'object' ? t.vi || t.en : t).join(', ') : '',
      featured: !!item.featured,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa bài viết "${title}" (ID: ${id}) không?`)) {
      dataService.deleteContent(id);
      reloadData();
      if (onShowToast) onShowToast(`Đã xóa bài viết "${title}" thành công.`, 'success');
    }
  };

  const handleToggleFeatured = (item) => {
    const updated = { ...item, featured: !item.featured };
    dataService.saveContent(updated);
    reloadData();
    if (onShowToast) {
      onShowToast(`Đã ${updated.featured ? 'bật' : 'tắt'} trạng thái Nổi bật cho "${item.title?.vi || item.title}".`, 'info');
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.titleVi.trim()) {
      alert('Vui lòng nhập tiêu đề tiếng Việt.');
      return;
    }

    const tagsArray = formData.subTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const savedItem = {
      id: formData.id,
      category: formData.category,
      type: formData.type,
      title: {
        vi: formData.titleVi.trim(),
        en: formData.titleEn.trim() || formData.titleVi.trim(),
        hi: formData.titleEn.trim() || formData.titleVi.trim(),
      },
      shortDescription: {
        vi: formData.shortDescVi.trim(),
        en: formData.shortDescEn.trim() || formData.shortDescVi.trim(),
        hi: formData.shortDescEn.trim() || formData.shortDescVi.trim(),
      },
      body: editingItem?.body || {
        vi: formData.shortDescVi.trim(),
        en: formData.shortDescEn.trim() || formData.shortDescVi.trim(),
        hi: formData.shortDescEn.trim() || formData.shortDescVi.trim(),
      },
      imageUrl: formData.imageUrl.trim() || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
      videoUrl: formData.videoUrl.trim(),
      audioUrl: formData.audioUrl.trim(),
      subTags: tagsArray.length > 0 ? tagsArray : ['Fandom', 'Update'],
      featured: formData.featured,
      dateAdded: editingItem?.dateAdded || new Date().toISOString().split('T')[0],
      author: editingItem?.author || 'FandomVerse Editorial',
    };

    dataService.saveContent(savedItem);
    reloadData();
    setIsModalOpen(false);
    if (onShowToast) {
      onShowToast(`Đã lưu bài viết "${savedItem.title.vi}" thành công!`, 'success');
    }
  };

  return (
    <div className="admin-contents-module">
      {/* Header bar */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <div>
          <h3 className="fw-bold text-white mb-1 d-flex align-items-center gap-2">
            <i className="bi bi-file-earmark-richtext" style={{ color: '#00f5d4' }}></i>
            Quản lý Bài viết & Nội dung Media
          </h3>
          <p className="text-secondary small mb-0">
            Hiển thị <strong className="text-white">{filteredItems.length}</strong> / {items.length} bài viết & media trên toàn hệ thống.
          </p>
        </div>
        <button type="button" className="fv-admin-btn-primary" onClick={handleOpenAdd}>
          <i className="bi bi-plus-lg"></i> Thêm bài viết mới
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="fv-admin-card mb-4 p-3">
        <div className="row g-2">
          <div className="col-12 col-md-4">
            <div className="position-relative">
              <i className="bi bi-search position-absolute top-50 translate-middle-y text-secondary ms-3"></i>
              <input
                type="text"
                className="fv-admin-input ps-5"
                placeholder="Tìm kiếm theo tiêu đề hoặc ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-6 col-md-3">
            <select
              className="fv-admin-select"
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-6 col-md-3">
            <select
              className="fv-admin-select"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12 col-md-2">
            <select
              className="fv-admin-select"
              value={selectedFeatured}
              onChange={(e) => setSelectedFeatured(e.target.value)}
            >
              <option value="all">Tất cả bài viết</option>
              <option value="featured">⭐ Bài nổi bật (Featured)</option>
              <option value="standard">Tiêu chuẩn</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="fv-admin-table-container">
        <div className="table-responsive">
          <table className="fv-admin-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Ảnh</th>
                <th>Tiêu đề & Tóm tắt</th>
                <th>Danh mục</th>
                <th>Định dạng</th>
                <th>Ngày đăng</th>
                <th className="text-center">Nổi bật</th>
                <th className="text-end" style={{ width: '130px' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-secondary">
                    <i className="bi bi-inbox fs-2 d-block mb-2 text-muted"></i>
                    Không tìm thấy bài viết nào phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const titleVi = item.title?.vi || item.title;
                  const descVi = item.shortDescription?.vi || item.shortDescription || '';
                  return (
                    <tr key={item.id}>
                      <td>
                        <img
                          src={item.imageUrl}
                          alt={titleVi}
                          className="fv-admin-thumb"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=100&auto=format&fit=crop&q=80';
                          }}
                        />
                      </td>
                      <td style={{ maxWidth: '360px' }}>
                        <div className="fw-bold text-white text-truncate" title={titleVi}>
                          {titleVi}
                        </div>
                        <div className="text-secondary small text-truncate" style={{ maxWidth: '340px' }}>
                          {descVi}
                        </div>
                        <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                          ID: <code>{item.id}</code>
                        </div>
                      </td>
                      <td>
                        <span className={`fv-badge-cat fv-cat-${item.category}`}>
                          {item.category}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-secondary-subtle text-light border border-secondary" style={{ fontSize: '0.75rem' }}>
                          <i className={`bi me-1 ${
                            item.type === 'video' ? 'bi-play-circle' :
                            item.type === 'audio' ? 'bi-mic' :
                            item.type === 'gallery' ? 'bi-images' : 'bi-file-text'
                          }`}></i>
                          {item.type}
                        </span>
                      </td>
                      <td className="text-secondary small">
                        {item.dateAdded || 'N/A'}
                      </td>
                      <td className="text-center">
                        <button
                          type="button"
                          className="btn btn-sm border-0 p-1 bg-transparent"
                          onClick={() => handleToggleFeatured(item)}
                          title="Bấm để bật/tắt nổi bật"
                        >
                          <i
                            className={`bi ${item.featured ? 'bi-star-fill text-warning' : 'bi-star text-secondary'}`}
                            style={{ fontSize: '1.2rem' }}
                          ></i>
                        </button>
                      </td>
                      <td className="text-end">
                        <div className="d-inline-flex gap-1">
                          <button
                            type="button"
                            className="fv-admin-btn-edit"
                            onClick={() => handleOpenEdit(item)}
                            title="Chỉnh sửa bài viết"
                          >
                            <i className="bi bi-pencil-square"></i> Sửa
                          </button>
                          <button
                            type="button"
                            className="fv-admin-btn-danger"
                            onClick={() => handleDelete(item.id, titleVi)}
                            title="Xóa bài viết"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fv-admin-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="fv-admin-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="fv-admin-modal-header">
              <h5 className="fw-bold mb-0 text-white d-flex align-items-center gap-2">
                <i className={`bi ${editingItem ? 'bi-pencil-square text-info' : 'bi-plus-circle text-success'}`}></i>
                {editingItem ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setIsModalOpen(false)}
              ></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="fv-admin-modal-body">
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <div className="fv-admin-form-group">
                      <label className="fv-admin-label">ID Bài viết</label>
                      <input
                        type="text"
                        className="fv-admin-input"
                        value={formData.id}
                        disabled={!!editingItem}
                        onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-3">
                    <div className="fv-admin-form-group">
                      <label className="fv-admin-label">Danh mục (Category)</label>
                      <select
                        className="fv-admin-select"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                          <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-12 col-md-3">
                    <div className="fv-admin-form-group">
                      <label className="fv-admin-label">Định dạng (Type)</label>
                      <select
                        className="fv-admin-select"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      >
                        {TYPES.filter((t) => t.id !== 'all').map((t) => (
                          <option key={t.id} value={t.id}>{t.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Title VI & EN */}
                  <div className="col-12">
                    <div className="fv-admin-form-group">
                      <label className="fv-admin-label">Tiêu đề (Tiếng Việt) *</label>
                      <input
                        type="text"
                        className="fv-admin-input"
                        value={formData.titleVi}
                        onChange={(e) => setFormData({ ...formData, titleVi: e.target.value })}
                        placeholder="Nhập tiêu đề tiếng Việt..."
                        required
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="fv-admin-form-group">
                      <label className="fv-admin-label">Tiêu đề (English)</label>
                      <input
                        type="text"
                        className="fv-admin-input"
                        value={formData.titleEn}
                        onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                        placeholder="Enter English title..."
                      />
                    </div>
                  </div>

                  {/* Short Desc VI & EN */}
                  <div className="col-12">
                    <div className="fv-admin-form-group">
                      <label className="fv-admin-label">Mô tả ngắn (Tiếng Việt)</label>
                      <textarea
                        className="fv-admin-textarea"
                        rows="2"
                        value={formData.shortDescVi}
                        onChange={(e) => setFormData({ ...formData, shortDescVi: e.target.value })}
                        placeholder="Tóm tắt nội dung bài viết..."
                      ></textarea>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="fv-admin-form-group">
                      <label className="fv-admin-label">Mô tả ngắn (English)</label>
                      <textarea
                        className="fv-admin-textarea"
                        rows="2"
                        value={formData.shortDescEn}
                        onChange={(e) => setFormData({ ...formData, shortDescEn: e.target.value })}
                        placeholder="Short summary in English..."
                      ></textarea>
                    </div>
                  </div>

                  {/* Image URL & Preview */}
                  <div className="col-12 col-md-8">
                    <div className="fv-admin-form-group">
                      <label className="fv-admin-label">URL Ảnh Thumbnail</label>
                      <input
                        type="url"
                        className="fv-admin-input"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="fv-admin-form-group">
                      <label className="fv-admin-label">Thẻ / Phân loại (phân cách bằng dấu phẩy)</label>
                      <input
                        type="text"
                        className="fv-admin-input"
                        value={formData.subTags}
                        onChange={(e) => setFormData({ ...formData, subTags: e.target.value })}
                        placeholder="One Piece, Shounen, Phân tích"
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="fv-admin-label">Xem trước ảnh</label>
                    <div
                      style={{
                        height: '115px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        overflow: 'hidden',
                        background: '#090c15',
                      }}
                    >
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&auto=format&fit=crop&q=80';
                        }}
                      />
                    </div>
                  </div>

                  {/* Media URLs if video or audio */}
                  {formData.type === 'video' && (
                    <div className="col-12">
                      <div className="fv-admin-form-group">
                        <label className="fv-admin-label">URL Video Embed (YouTube / MP4)</label>
                        <input
                          type="text"
                          className="fv-admin-input"
                          value={formData.videoUrl}
                          onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                          placeholder="https://www.youtube.com/embed/..."
                        />
                      </div>
                    </div>
                  )}

                  {formData.type === 'audio' && (
                    <div className="col-12">
                      <div className="fv-admin-form-group">
                        <label className="fv-admin-label">URL Audio / Podcast Stream</label>
                        <input
                          type="text"
                          className="fv-admin-input"
                          value={formData.audioUrl}
                          onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                  )}

                  <div className="col-12">
                    <div className="form-check form-switch mt-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="featuredCheck"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      />
                      <label className="form-check-label text-white small" htmlFor="featuredCheck">
                        ⭐ Đánh dấu bài viết nổi bật trên Trang chủ (Spotlight Section)
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="fv-admin-modal-footer">
                <button
                  type="button"
                  className="fv-admin-btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Hủy bỏ
                </button>
                <button type="submit" className="fv-admin-btn-primary">
                  <i className="bi bi-check-lg"></i> Lưu bài viết
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
