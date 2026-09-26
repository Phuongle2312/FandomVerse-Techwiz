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

const PRODUCT_TYPES = [
  { id: 'all', label: 'Tất cả loại sản phẩm' },
  { id: 'figure', label: 'Mô hình (Figure)' },
  { id: 'apparel', label: 'Trang phục & Áo (Apparel)' },
  { id: 'accessory', label: 'Phụ kiện & Trang sức (Accessory)' },
  { id: 'stationery', label: 'Văn phòng phẩm (Stationery)' },
  { id: 'collectible', label: 'Vật phẩm sưu tầm (Collectible)' },
];

export default function AdminMerchandise({ onShowToast }) {
  const [items, setItems] = useState(() => dataService.getRawMerchandise());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStock, setSelectedStock] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    category: 'anime',
    nameVi: '',
    nameEn: '',
    productType: 'figure',
    price: 49.99,
    imageUrl: '',
    inStock: true,
    rating: 4.8,
    descVi: '',
    descEn: '',
  });

  const reloadData = () => setItems(dataService.getRawMerchandise());

  useEffect(() => {
    const handleDataChange = () => reloadData();
    window.addEventListener('fv_data_change', handleDataChange);
    return () => window.removeEventListener('fv_data_change', handleDataChange);
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCat = selectedCat === 'all' || item.category === selectedCat;
      const matchType = selectedType === 'all' || item.productType === selectedType;
      const matchStock =
        selectedStock === 'all' ||
        (selectedStock === 'in_stock' && item.inStock) ||
        (selectedStock === 'out_of_stock' && !item.inStock);

      const nameVi = item.name?.vi || item.name || '';
      const nameEn = item.name?.en || '';
      const matchSearch =
        !searchTerm.trim() ||
        nameVi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase());

      return matchCat && matchType && matchStock && matchSearch;
    });
  }, [items, searchTerm, selectedCat, selectedType, selectedStock]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      id: `merch-${Date.now()}`,
      category: 'anime',
      nameVi: '',
      nameEn: '',
      productType: 'figure',
      price: 59.99,
      imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
      inStock: true,
      rating: 4.9,
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
      nameVi: item.name?.vi || (typeof item.name === 'string' ? item.name : ''),
      nameEn: item.name?.en || (typeof item.name === 'string' ? item.name : ''),
      productType: item.productType || 'figure',
      price: item.price ?? 49.99,
      imageUrl: item.imageUrl || '',
      inStock: item.inStock !== false,
      rating: item.rating ?? 4.8,
      descVi: item.shortDescription?.vi || (typeof item.shortDescription === 'string' ? item.shortDescription : ''),
      descEn: item.shortDescription?.en || (typeof item.shortDescription === 'string' ? item.shortDescription : ''),
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}" (ID: ${id}) không?`)) {
      dataService.deleteMerchandise(id);
      reloadData();
      if (onShowToast) onShowToast(`Đã xóa sản phẩm "${name}" thành công.`, 'success');
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.nameVi.trim()) {
      alert('Vui lòng nhập tên sản phẩm.');
      return;
    }

    const savedItem = {
      id: formData.id,
      category: formData.category,
      name: {
        vi: formData.nameVi.trim(),
        en: formData.nameEn.trim() || formData.nameVi.trim(),
        hi: formData.nameEn.trim() || formData.nameVi.trim(),
      },
      productType: formData.productType,
      price: parseFloat(formData.price) || 0,
      imageUrl: formData.imageUrl.trim() || 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
      inStock: formData.inStock,
      rating: parseFloat(formData.rating) || 5.0,
      shortDescription: {
        vi: formData.descVi.trim(),
        en: formData.descEn.trim() || formData.descVi.trim(),
        hi: formData.descEn.trim() || formData.descVi.trim(),
      },
    };

    dataService.saveMerchandise(savedItem);
    reloadData();
    setIsModalOpen(false);
    if (onShowToast) {
      onShowToast(`Đã lưu sản phẩm "${savedItem.name.vi}" thành công!`, 'success');
    }
  };

  return (
    <div className="admin-merch-module">
      {/* Header bar */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <div>
          <h3 className="fw-bold text-white mb-1 d-flex align-items-center gap-2">
            <i className="bi bi-bag-check" style={{ color: '#feca57' }}></i>
            Quản lý Cửa Hàng & Vật Phẩm Merch
          </h3>
          <p className="text-secondary small mb-0">
            Hiển thị <strong className="text-white">{filteredItems.length}</strong> / {items.length} figure, áo phông, poster và vật phẩm sưu tầm độc quyền.
          </p>
        </div>
        <button type="button" className="fv-admin-btn-primary" onClick={handleOpenAdd}>
          <i className="bi bi-plus-lg"></i> Thêm vật phẩm mới
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
                placeholder="Tìm kiếm sản phẩm..."
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
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="col-6 col-md-3">
            <select
              className="fv-admin-select"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {PRODUCT_TYPES.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>
          <div className="col-12 col-md-2">
            <select
              className="fv-admin-select"
              value={selectedStock}
              onChange={(e) => setSelectedStock(e.target.value)}
            >
              <option value="all">Tất cả kho hàng</option>
              <option value="in_stock">✅ Còn hàng</option>
              <option value="out_of_stock">❌ Hết hàng</option>
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
                <th>Tên Sản Phẩm</th>
                <th>Danh mục</th>
                <th>Phân loại</th>
                <th>Giá ($)</th>
                <th>Tình trạng</th>
                <th>Đánh giá</th>
                <th className="text-end" style={{ width: '130px' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-5 text-secondary">
                    <i className="bi bi-inbox fs-2 d-block mb-2 text-muted"></i>
                    Không tìm thấy sản phẩm nào.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const nameVi = item.name?.vi || item.name;
                  return (
                    <tr key={item.id}>
                      <td>
                        <img
                          src={item.imageUrl}
                          alt={nameVi}
                          className="fv-admin-thumb"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=100&auto=format&fit=crop&q=80';
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
                        <span className="badge bg-secondary-subtle text-light border border-secondary text-capitalize" style={{ fontSize: '0.75rem' }}>
                          {item.productType || 'figure'}
                        </span>
                      </td>
                      <td className="fw-bold text-warning">
                        ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            item.inStock !== false
                              ? 'bg-success-subtle text-success border border-success'
                              : 'bg-danger-subtle text-danger border border-danger'
                          }`}
                          style={{ fontSize: '0.75rem' }}
                        >
                          {item.inStock !== false ? '✅ Còn hàng' : '❌ Hết hàng'}
                        </span>
                      </td>
                      <td className="text-secondary small">
                        <i className="bi bi-star-fill text-warning me-1"></i>
                        {item.rating || 4.8}
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
                <i className="bi bi-bag-plus text-warning"></i>
                {editingItem ? 'Chỉnh sửa Sản phẩm' : 'Thêm Sản phẩm mới'}
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
                      <label className="fv-admin-label">ID Sản phẩm</label>
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
                      <label className="fv-admin-label">Tên Sản phẩm (Tiếng Việt) *</label>
                      <input
                        type="text"
                        className="fv-admin-input"
                        value={formData.nameVi}
                        onChange={(e) => setFormData({ ...formData, nameVi: e.target.value })}
                        placeholder="VD: Mô Hình Luffy Gear 5 Nika Special Edition..."
                        required
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="fv-admin-form-group">
                      <label className="fv-admin-label">Tên Sản phẩm (English)</label>
                      <input
                        type="text"
                        className="fv-admin-input"
                        value={formData.nameEn}
                        onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                        placeholder="Enter product name in English..."
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-4">
                    <div className="fv-admin-form-group">
                      <label className="fv-admin-label">Phân loại sản phẩm</label>
                      <select
                        className="fv-admin-select"
                        value={formData.productType}
                        onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                      >
                        {PRODUCT_TYPES.filter((t) => t.id !== 'all').map((t) => (
                          <option key={t.id} value={t.id}>{t.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <div className="fv-admin-form-group">
                      <label className="fv-admin-label">Giá bán ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="fv-admin-input"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <div className="fv-admin-form-group">
                      <label className="fv-admin-label">Đánh giá (1.0 - 5.0)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        className="fv-admin-input"
                        value={formData.rating}
                        onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-8">
                    <div className="fv-admin-form-group">
                      <label className="fv-admin-label">URL Ảnh Sản Phẩm</label>
                      <input
                        type="url"
                        className="fv-admin-input"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="fv-admin-label">Xem trước ảnh</label>
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
                        src={formData.imageUrl}
                        alt="Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&auto=format&fit=crop&q=80';
                        }}
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-check form-switch mt-1">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="inStockCheck"
                        checked={formData.inStock}
                        onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                      />
                      <label className="form-check-label text-white small" htmlFor="inStockCheck">
                        Hiện có sẵn trong kho hàng (In Stock)
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
                  <i className="bi bi-check-lg"></i> Lưu sản phẩm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
