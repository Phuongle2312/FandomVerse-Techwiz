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

export default function AdminTrailers({ onShowToast }) {
  const [items, setItems] = useState(() => dataService.getRawTrailers());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    category: 'anime',
    titleVi: '',
    titleEn: '',
    thumbnail: '',
    videoId: '',
    videoUrl: '',
    releaseDate: '',
    status: 'released',
    duration: '2:30',
  });

  const reloadData = () => setItems(dataService.getRawTrailers());

  useEffect(() => {
    const handleDataChange = () => reloadData();
    window.addEventListener('fv_data_change', handleDataChange);
    return () => window.removeEventListener('fv_data_change', handleDataChange);
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCat = selectedCat === 'all' || item.category === selectedCat;
      const matchStatus = selectedStatus === 'all' || item.status === selectedStatus;

      const titleVi = item.title?.vi || item.title || '';
      const titleEn = item.title?.en || '';
      const matchSearch =
        !searchTerm.trim() ||
        titleVi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase());

      return matchCat && matchStatus && matchSearch;
    });
  }, [items, searchTerm, selectedCat, selectedStatus]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      id: `trailer-${Date.now()}`,
      category: 'anime',
      titleVi: '',
      titleEn: '',
      thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
      videoId: 'dQw4w9WgXcQ',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      releaseDate: new Date().toISOString().split('T')[0],
      status: 'upcoming',
      duration: '2:15',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      id: item.id,
      category: item.category || 'anime',
      titleVi: item.title?.vi || (typeof item.title === 'string' ? item.title : ''),
      titleEn: item.title?.en || (typeof item.title === 'string' ? item.title : ''),
      thumbnail: item.thumbnail || '',
      videoId: item.videoId || '',
      videoUrl: item.videoUrl || '',
      releaseDate: item.releaseDate || '',
      status: item.status || 'released',
      duration: item.duration || '2:30',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa trailer "${title}" (ID: ${id}) không?`)) {
      dataService.deleteTrailer(id);
      reloadData();
      if (onShowToast) onShowToast(`Đã xóa trailer "${title}" thành công.`, 'success');
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.titleVi.trim()) {
      alert('Vui lòng nhập tên trailer.');
      return;
    }

    const savedItem = {
      id: formData.id,
      category: formData.category,
      title: {
        vi: formData.titleVi.trim(),
        en: formData.titleEn.trim() || formData.titleVi.trim(),
        hi: formData.titleEn.trim() || formData.titleVi.trim(),
      },
      thumbnail: formData.thumbnail.trim() || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
      videoId: formData.videoId.trim() || 'dQw4w9WgXcQ',
      videoUrl: formData.videoUrl.trim() || `https://www.youtube.com/watch?v=${formData.videoId.trim()}`,
      releaseDate: formData.releaseDate || new Date().toISOString().split('T')[0],
      status: formData.status,
      duration: formData.duration.trim() || '2:30',
    };

    dataService.saveTrailer(savedItem);
    reloadData();
    setIsModalOpen(false);
    if (onShowToast) {
      onShowToast(`Đã lưu trailer "${savedItem.title.vi}" thành công!`, 'success');
    }
  };

  return (
    <div className="admin-trailers-module">
      {/* Header bar */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <div>
          <h3 className="fw-bold text-white mb-1 d-flex align-items-center gap-2">
            <i className="bi bi-play-btn" style={{ color: '#ff5e8c' }}></i>
            Quản lý Trailers Bom Tấn
          </h3>
          <p className="text-secondary small mb-0">
            Hiển thị <strong className="text-white">{filteredItems.length}</strong> / {items.length} trailer bom tấn trong kho phim/game/anime.
          </p>
        </div>
        <button type="button" className="fv-admin-btn-primary" onClick={handleOpenAdd}>
          <i className="bi bi-plus-lg"></i> Thêm trailer mới
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="fv-admin-card mb-4 p-3">
        <div className="row g-2">
          <div className="col-12 col-md-5">
            <div className="position-relative">
              <i className="bi bi-search position-absolute top-50 translate-middle-y text-secondary ms-3"></i>
              <input
                type="text"
                className="fv-admin-input ps-5"
                placeholder="Tìm kiếm trailer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-6 col-md-4">
            <select
              className="fv-admin-select"
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="col-6 col-md-3">
            <select
              className="fv-admin-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="upcoming">⚡ Sắp phát hành (Upcoming)</option>
              <option value="released">🎬 Đã ra mắt (Released)</option>
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
                <th style={{ width: '60px' }}>Poster</th>
                <th>Tên Trailer</th>
                <th>Danh mục</th>
                <th>Trạng thái</th>
                <th>Ngày ra mắt</th>
                <th>Thời lượng</th>
                <th className="text-end" style={{ width: '130px' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-secondary">
                    <i className="bi bi-inbox fs-2 d-block mb-2 text-muted"></i>
                    Không có trailer nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const titleVi = item.title?.vi || item.title;
                  return (
                    <tr key={item.id}>
                      <td>
                        <img
                          src={item.thumbnail}
                          alt={titleVi}
                          className="fv-admin-thumb"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=100&auto=format&fit=crop&q=80';
                          }}
                        />
                      </td>
                      <td>
                        <div className="fw-bold text-white text-truncate" style={{ maxWidth: '320px' }}>
                          {titleVi}
                        </div>
                        <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                          Video ID: <code>{item.videoId}</code>
                        </div>
                      </td>
                      <td>
                        <span className={`fv-badge-cat fv-cat-${item.category}`}>
                          {item.category}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            item.status === 'upcoming'
                              ? 'bg-warning-subtle text-warning border border-warning'
                              : 'bg-success-subtle text-success border border-success'
                          }`}
                          style={{ fontSize: '0.75rem' }}
                        >
                          {item.status === 'upcoming' ? '⚡ Sắp chiếu' : '🎬 Đã ra mắt'}
                        </span>
                      </td>
                      <td className="text-secondary small">
                        {item.releaseDate || 'N/A'}
                      </td>
                      <td className="text-secondary small">
                        <i className="bi bi-clock me-1"></i> {item.duration || '2:30'}
                      </td>
                      <td className="text-end">
                        <div className="d-inline-flex gap-1">
                          <button
                            type="button"
                            className="fv-admin-btn-edit"
                            onClick={() => handleOpenEdit(item)}
                            title="Sửa"
                          >
                            <i className="bi bi-pencil-square"></i> Sửa
                          </button>
                          <button
                            type="button"
                            className="fv-admin-btn-danger"
                            onClick={() => handleDelete(item.id, titleVi)}
                            title="Xóa"
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fv-admin-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="fv-admin-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="fv-admin-modal-header">
              <h5 className="fw-bold mb-0 text-white d-flex align-items-center gap-2">
                <i className="bi bi-play-circle text-danger"></i>
                {editingItem ? 'Chỉnh sửa Trailer' : 'Thêm Trailer mới'}
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
                      <label className="fv-admin-label">ID Trailer</label>
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
                  <div className="col-12 col-md-6">
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

                  <div className="col-12">
                    <div className="fv-admin-form-group">
                      <label className="fv-admin-label">Tiêu đề Trailer (Tiếng Việt) *</label>
                      <input
                        type="text"
                        className="fv-admin-input"
                        value={formData.titleVi}
                        onChange={(e) => setFormData({ ...formData, titleVi: e.target.value })}
                        placeholder="VD: GTA VI – Official Trailer 2..."
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

                  <div className="col-12 col-md-6">
                    <div className="fv-admin-form-group">
                      <label className="fv-admin-label">YouTube Video ID</label>
                      <input
                        type="text"
                        className="fv-admin-input"
                        value={formData.videoId}
                        onChange={(e) => setFormData({ ...formData, videoId: e.target.value })}
                        placeholder="VD: QdBZY2fkU-0"
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="fv-admin-form-group">
                      <label className="fv-admin-label">Thời lượng</label>
                      <input
                        type="text"
                        className="fv-admin-input"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        placeholder="VD: 2:45"
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="fv-admin-form-group">
                      <label className="fv-admin-label">Ngày công chiếu</label>
                      <input
                        type="date"
                        className="fv-admin-input"
                        value={formData.releaseDate}
                        onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="fv-admin-form-group">
                      <label className="fv-admin-label">Trạng thái phát hành</label>
                      <select
                        className="fv-admin-select"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      >
                        <option value="upcoming">⚡ Sắp phát hành (Upcoming)</option>
                        <option value="released">🎬 Đã ra mắt (Released)</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-12 col-md-8">
                    <div className="fv-admin-form-group">
                      <label className="fv-admin-label">URL Ảnh Thumbnail / Poster</label>
                      <input
                        type="url"
                        className="fv-admin-input"
                        value={formData.thumbnail}
                        onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="fv-admin-label">Xem trước poster</label>
                    <div
                      style={{
                        height: '100px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        overflow: 'hidden',
                        background: '#090c15',
                      }}
                    >
                      <img
                        src={formData.thumbnail}
                        alt="Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&auto=format&fit=crop&q=80';
                        }}
                      />
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
                  <i className="bi bi-check-lg"></i> Lưu trailer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
