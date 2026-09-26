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

export default function AdminEvents({ onShowToast }) {
  const [items, setItems] = useState(() => dataService.getRawEvents());
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
    locationVi: '',
    locationEn: '',
    date: '',
    imageUrl: '',
    descVi: '',
    descEn: '',
  });

  const reloadData = () => setItems(dataService.getRawEvents());

  useEffect(() => {
    const handleDataChange = () => reloadData();
    window.addEventListener('fv_data_change', handleDataChange);
    return () => window.removeEventListener('fv_data_change', handleDataChange);
  }, []);

  const today = new Date().toISOString().split('T')[0];

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCat = selectedCat === 'all' || item.category === selectedCat;
      const matchStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'upcoming' && item.date >= today) ||
        (selectedStatus === 'past' && item.date < today);

      const titleVi = item.title?.vi || item.title || '';
      const titleEn = item.title?.en || '';
      const loc = item.location?.vi || item.location || '';
      const matchSearch =
        !searchTerm.trim() ||
        titleVi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase());

      return matchCat && matchStatus && matchSearch;
    });
  }, [items, searchTerm, selectedCat, selectedStatus, today]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      id: `event-${Date.now()}`,
      category: 'anime',
      titleVi: '',
      titleEn: '',
      locationVi: 'Tokyo Big Sight, Nhật Bản',
      locationEn: 'Tokyo Big Sight, Japan',
      date: '2026-10-15',
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
      descVi: '',
      descEn: '',
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
      locationVi: item.location?.vi || (typeof item.location === 'string' ? item.location : ''),
      locationEn: item.location?.en || (typeof item.location === 'string' ? item.location : ''),
      date: item.date || '',
      imageUrl: item.imageUrl || '',
      descVi: item.description?.vi || (typeof item.description === 'string' ? item.description : ''),
      descEn: item.description?.en || (typeof item.description === 'string' ? item.description : ''),
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa sự kiện "${title}" (ID: ${id}) không?`)) {
      dataService.deleteEvent(id);
      reloadData();
      if (onShowToast) onShowToast(`Đã xóa sự kiện "${title}" thành công.`, 'success');
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.titleVi.trim()) {
      alert('Vui lòng nhập tên sự kiện.');
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
      location: {
        vi: formData.locationVi.trim(),
        en: formData.locationEn.trim() || formData.locationVi.trim(),
        hi: formData.locationEn.trim() || formData.locationVi.trim(),
      },
      date: formData.date || '2026-10-15',
      imageUrl: formData.imageUrl.trim() || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
      description: {
        vi: formData.descVi.trim(),
        en: formData.descEn.trim() || formData.descVi.trim(),
        hi: formData.descEn.trim() || formData.descVi.trim(),
      },
    };

    dataService.saveEvent(savedItem);
    reloadData();
    setIsModalOpen(false);
    if (onShowToast) {
      onShowToast(`Đã lưu sự kiện "${savedItem.title.vi}" thành công!`, 'success');
    }
  };

  return (
    <div className="admin-events-module">
      {/* Header bar */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <div>
          <h3 className="fw-bold text-white mb-1 d-flex align-items-center gap-2">
            <i className="bi bi-calendar-event" style={{ color: '#00a8ff' }}></i>
            Quản lý Sự Kiện Fandom
          </h3>
          <p className="text-secondary small mb-0">
            Hiển thị <strong className="text-white">{filteredItems.length}</strong> / {items.length} đại nhạc hội, triển lãm và hội chợ văn hóa.
          </p>
        </div>
        <button type="button" className="fv-admin-btn-primary" onClick={handleOpenAdd}>
          <i className="bi bi-plus-lg"></i> Thêm sự kiện mới
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
                placeholder="Tìm kiếm theo tên hoặc địa điểm..."
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
              <option value="all">Tất cả thời gian</option>
              <option value="upcoming">⚡ Sắp diễn ra (Upcoming)</option>
              <option value="past">🕰️ Đã diễn ra (Past)</option>
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
                <th>Tên Sự Kiện</th>
                <th>Danh mục</th>
                <th>Địa điểm</th>
                <th>Ngày tổ chức</th>
                <th>Trạng thái</th>
                <th className="text-end" style={{ width: '130px' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-secondary">
                    <i className="bi bi-inbox fs-2 d-block mb-2 text-muted"></i>
                    Không có sự kiện nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const titleVi = item.title?.vi || item.title;
                  const locVi = item.location?.vi || item.location;
                  const isUpcoming = item.date >= today;
                  return (
                    <tr key={item.id}>
                      <td>
                        <img
                          src={item.imageUrl}
                          alt={titleVi}
                          className="fv-admin-thumb"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&auto=format&fit=crop&q=80';
                          }}
                        />
                      </td>
                      <td>
                        <div className="fw-bold text-white text-truncate" style={{ maxWidth: '300px' }}>
                          {titleVi}
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
                      <td className="text-secondary small" style={{ maxWidth: '200px' }}>
                        <i className="bi bi-geo-alt me-1 text-danger"></i>
                        <span className="text-truncate d-inline-block align-middle" style={{ maxWidth: '170px' }}>
                          {locVi}
                        </span>
                      </td>
                      <td className="text-secondary small">
                        {item.date}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            isUpcoming
                              ? 'bg-warning-subtle text-warning border border-warning'
                              : 'bg-secondary-subtle text-secondary border border-secondary'
                          }`}
                          style={{ fontSize: '0.75rem' }}
                        >
                          {isUpcoming ? '⚡ Sắp diễn ra' : '🕰️ Đã qua'}
                        </span>
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
                <i className="bi bi-calendar-check text-info"></i>
                {editingItem ? 'Chỉnh sửa Sự kiện' : 'Thêm Sự kiện mới'}
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
                      <label className="fv-admin-label">ID Sự kiện</label>
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
                      <label className="fv-admin-label">Tên Sự Kiện (Tiếng Việt) *</label>
                      <input
                        type="text"
                        className="fv-admin-input"
                        value={formData.titleVi}
                        onChange={(e) => setFormData({ ...formData, titleVi: e.target.value })}
                        placeholder="VD: AnimeJapan Festival 2026..."
                        required
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="fv-admin-form-group">
                      <label className="fv-admin-label">Tên Sự Kiện (English)</label>
                      <input
                        type="text"
                        className="fv-admin-input"
                        value={formData.titleEn}
                        onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                        placeholder="Enter event name in English..."
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="fv-admin-form-group">
                      <label className="fv-admin-label">Địa điểm (Tiếng Việt)</label>
                      <input
                        type="text"
                        className="fv-admin-input"
                        value={formData.locationVi}
                        onChange={(e) => setFormData({ ...formData, locationVi: e.target.value })}
                        placeholder="VD: Tokyo Big Sight, Nhật Bản"
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="fv-admin-form-group">
                      <label className="fv-admin-label">Địa điểm (English)</label>
                      <input
                        type="text"
                        className="fv-admin-input"
                        value={formData.locationEn}
                        onChange={(e) => setFormData({ ...formData, locationEn: e.target.value })}
                        placeholder="VD: Tokyo Big Sight, Japan"
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="fv-admin-form-group">
                      <label className="fv-admin-label">Ngày tổ chức</label>
                      <input
                        type="date"
                        className="fv-admin-input"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="fv-admin-form-group">
                      <label className="fv-admin-label">URL Ảnh Bìa Sự Kiện</label>
                      <input
                        type="url"
                        className="fv-admin-input"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="fv-admin-form-group">
                      <label className="fv-admin-label">Mô tả sự kiện (Tiếng Việt)</label>
                      <textarea
                        className="fv-admin-textarea"
                        rows="2"
                        value={formData.descVi}
                        onChange={(e) => setFormData({ ...formData, descVi: e.target.value })}
                        placeholder="Thông tin chi tiết về lễ hội, triển lãm, diễn giả..."
                      ></textarea>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="fv-admin-form-group">
                      <label className="fv-admin-label">Mô tả sự kiện (English)</label>
                      <textarea
                        className="fv-admin-textarea"
                        rows="2"
                        value={formData.descEn}
                        onChange={(e) => setFormData({ ...formData, descEn: e.target.value })}
                        placeholder="Event overview in English..."
                      ></textarea>
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
                  <i className="bi bi-check-lg"></i> Lưu sự kiện
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
