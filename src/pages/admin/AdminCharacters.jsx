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

export default function AdminCharacters({ onShowToast }) {
  const [items, setItems] = useState(() => dataService.getRawCharacters());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    category: 'anime',
    nameVi: '',
    nameEn: '',
    franchise: '',
    avatarUrl: '',
    traits: '',
    bioVi: '',
    bioEn: '',
  });

  const reloadData = () => setItems(dataService.getRawCharacters());

  useEffect(() => {
    const handleDataChange = () => reloadData();
    window.addEventListener('fv_data_change', handleDataChange);
    return () => window.removeEventListener('fv_data_change', handleDataChange);
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCat = selectedCat === 'all' || item.category === selectedCat;

      const nameVi = item.name?.vi || item.name || '';
      const nameEn = item.name?.en || '';
      const fran = item.franchise || '';
      const matchSearch =
        !searchTerm.trim() ||
        nameVi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fran.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase());

      return matchCat && matchSearch;
    });
  }, [items, searchTerm, selectedCat]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      id: `char-${Date.now()}`,
      category: 'anime',
      nameVi: '',
      nameEn: '',
      franchise: 'One Piece',
      avatarUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
      traits: 'Lãnh đạo, Chiến binh, Quyết đoán',
      bioVi: '',
      bioEn: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      id: item.id,
      category: item.category || 'anime',
      nameVi: item.name?.vi || (typeof item.name === 'string' ? item.name : ''),
      nameEn: item.name?.en || (typeof item.name === 'string' ? item.name : ''),
      franchise: item.franchise || '',
      avatarUrl: item.avatarUrl || '',
      traits: Array.isArray(item.traits)
        ? item.traits.map(t => typeof t === 'object' ? t.vi || t.en : t).join(', ')
        : '',
      bioVi: item.biography?.vi || (typeof item.biography === 'string' ? item.biography : ''),
      bioEn: item.biography?.en || (typeof item.biography === 'string' ? item.biography : ''),
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa nhân vật "${name}" (ID: ${id}) không?`)) {
      dataService.deleteCharacter(id);
      reloadData();
      if (onShowToast) onShowToast(`Đã xóa nhân vật "${name}" thành công.`, 'success');
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.nameVi.trim()) {
      alert('Vui lòng nhập tên nhân vật.');
      return;
    }

    const traitsArray = formData.traits
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const savedItem = {
      id: formData.id,
      category: formData.category,
      name: {
        vi: formData.nameVi.trim(),
        en: formData.nameEn.trim() || formData.nameVi.trim(),
        hi: formData.nameEn.trim() || formData.nameVi.trim(),
      },
      franchise: formData.franchise.trim(),
      avatarUrl: formData.avatarUrl.trim() || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
      traits: traitsArray.length > 0 ? traitsArray : ['Biểu tượng'],
      biography: {
        vi: formData.bioVi.trim(),
        en: formData.bioEn.trim() || formData.bioVi.trim(),
        hi: formData.bioEn.trim() || formData.bioVi.trim(),
      },
    };

    dataService.saveCharacter(savedItem);
    reloadData();
    setIsModalOpen(false);
    if (onShowToast) {
      onShowToast(`Đã lưu nhân vật "${savedItem.name.vi}" thành công!`, 'success');
    }
  };

  return (
    <div className="admin-characters-module">
      {/* Header bar */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <div>
          <h3 className="fw-bold text-white mb-1 d-flex align-items-center gap-2">
            <i className="bi bi-person-badge" style={{ color: '#a29bfe' }}></i>
            Quản lý Nhân Vật Biểu Tượng
          </h3>
          <p className="text-secondary small mb-0">
            Hiển thị <strong className="text-white">{filteredItems.length}</strong> / {items.length} nhân vật huyền thoại từ các vũ trụ anime, game, điện ảnh và truyện tranh.
          </p>
        </div>
        <button type="button" className="fv-admin-btn-primary" onClick={handleOpenAdd}>
          <i className="bi bi-plus-lg"></i> Thêm nhân vật mới
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="fv-admin-card mb-4 p-3">
        <div className="row g-2">
          <div className="col-12 col-md-7">
            <div className="position-relative">
              <i className="bi bi-search position-absolute top-50 translate-middle-y text-secondary ms-3"></i>
              <input
                type="text"
                className="fv-admin-input ps-5"
                placeholder="Tìm kiếm theo tên nhân vật hoặc franchise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-12 col-md-5">
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
        </div>
      </div>

      {/* Data Table */}
      <div className="fv-admin-table-container">
        <div className="table-responsive">
          <table className="fv-admin-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Avatar</th>
                <th>Tên Nhân Vật</th>
                <th>Danh mục</th>
                <th>Vũ trụ / Franchise</th>
                <th>Đặc trưng nổi bật</th>
                <th className="text-end" style={{ width: '130px' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-secondary">
                    <i className="bi bi-inbox fs-2 d-block mb-2 text-muted"></i>
                    Không tìm thấy nhân vật nào.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const nameVi = item.name?.vi || item.name;
                  const traits = Array.isArray(item.traits)
                    ? item.traits.map(t => typeof t === 'object' ? t.vi || t.en : t)
                    : [];
                  return (
                    <tr key={item.id}>
                      <td>
                        <img
                          src={item.avatarUrl}
                          alt={nameVi}
                          className="fv-admin-thumb rounded-circle"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=100&auto=format&fit=crop&q=80';
                          }}
                        />
                      </td>
                      <td>
                        <div className="fw-bold text-white text-truncate" style={{ maxWidth: '280px' }}>
                          {nameVi}
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
                        <span className="badge bg-dark border border-secondary text-info">
                          {item.franchise || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex flex-wrap gap-1" style={{ maxWidth: '300px' }}>
                          {traits.slice(0, 3).map((t, idx) => (
                            <span key={idx} className="badge bg-secondary-subtle text-secondary" style={{ fontSize: '0.7rem' }}>
                              {t}
                            </span>
                          ))}
                          {traits.length > 3 && (
                            <span className="badge bg-dark text-muted" style={{ fontSize: '0.7rem' }}>
                              +{traits.length - 3}
                            </span>
                          )}
                        </div>
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
                            onClick={() => handleDelete(item.id, nameVi)}
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
                <i className="bi bi-person-gear text-purple" style={{ color: '#a29bfe' }}></i>
                {editingItem ? 'Chỉnh sửa Hồ sơ Nhân vật' : 'Thêm Nhân vật mới'}
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
                      <label className="fv-admin-label">ID Nhân vật</label>
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

                  <div className="col-12 col-md-6">
                    <div className="fv-admin-form-group">
                      <label className="fv-admin-label">Tên Nhân vật (Tiếng Việt) *</label>
                      <input
                        type="text"
                        className="fv-admin-input"
                        value={formData.nameVi}
                        onChange={(e) => setFormData({ ...formData, nameVi: e.target.value })}
                        placeholder="VD: Monkey D. Luffy..."
                        required
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="fv-admin-form-group">
                      <label className="fv-admin-label">Tên Nhân vật (English)</label>
                      <input
                        type="text"
                        className="fv-admin-input"
                        value={formData.nameEn}
                        onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                        placeholder="VD: Monkey D. Luffy"
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="fv-admin-form-group">
                      <label className="fv-admin-label">Vũ trụ / Franchise</label>
                      <input
                        type="text"
                        className="fv-admin-input"
                        value={formData.franchise}
                        onChange={(e) => setFormData({ ...formData, franchise: e.target.value })}
                        placeholder="VD: One Piece, League of Legends, Marvel..."
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-8">
                    <div className="fv-admin-form-group">
                      <label className="fv-admin-label">URL Ảnh Avatar Nhân vật</label>
                      <input
                        type="url"
                        className="fv-admin-input"
                        value={formData.avatarUrl}
                        onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                    <div className="fv-admin-form-group">
                      <label className="fv-admin-label">Đặc trưng / Kỹ năng (phân cách bằng dấu phẩy)</label>
                      <input
                        type="text"
                        className="fv-admin-input"
                        value={formData.traits}
                        onChange={(e) => setFormData({ ...formData, traits: e.target.value })}
                        placeholder="Haki Bá Vương, Gear 5, Thuyền trưởng Mũ Rơm"
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="fv-admin-label">Xem trước Avatar</label>
                    <div
                      style={{
                        height: '115px',
                        borderRadius: '50%',
                        width: '115px',
                        margin: '0 auto',
                        border: '2px solid rgba(0, 245, 212, 0.4)',
                        overflow: 'hidden',
                        background: '#090c15',
                      }}
                    >
                      <img
                        src={formData.avatarUrl}
                        alt="Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&auto=format&fit=crop&q=80';
                        }}
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="fv-admin-form-group">
                      <label className="fv-admin-label">Tiểu sử tóm tắt (Tiếng Việt)</label>
                      <textarea
                        className="fv-admin-textarea"
                        rows="2"
                        value={formData.bioVi}
                        onChange={(e) => setFormData({ ...formData, bioVi: e.target.value })}
                        placeholder="Tiểu sử và sức mạnh nhân vật..."
                      ></textarea>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="fv-admin-form-group">
                      <label className="fv-admin-label">Tiểu sử tóm tắt (English)</label>
                      <textarea
                        className="fv-admin-textarea"
                        rows="2"
                        value={formData.bioEn}
                        onChange={(e) => setFormData({ ...formData, bioEn: e.target.value })}
                        placeholder="Biography in English..."
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
                  <i className="bi bi-check-lg"></i> Lưu nhân vật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
