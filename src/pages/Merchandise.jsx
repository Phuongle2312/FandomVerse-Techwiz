import React, { useState, useMemo } from 'react';
import { dataService } from '../services/dataService.js';
import { CATEGORY_LIST, PRODUCT_TYPES } from '../constants.js';
import MerchCard from '../components/cards/MerchCard.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ToastNotification from '../components/common/ToastNotification.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Merchandise() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [toast, setToast] = useState(null);

  const { setIsCartOpen, cartCount, cartTotal } = useCart();

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
            <i className="bi bi-shop text-success"></i> Gian Hàng Fandom Merchandise
          </h1>
          <p className="text-secondary small mb-0">
            Khám phá các mô hình Figure, trang phục, thú bông và đồ sưu tầm chính hãng từ các vũ trụ fandom.
          </p>
        </div>

        {/* View Cart Banner Button */}
        <button
          type="button"
          className="btn btn-primary-fv px-4 py-2 d-flex align-items-center gap-2 shadow-sm"
          onClick={() => setIsCartOpen(true)}
        >
          <i className="bi bi-cart3 fs-5"></i>
          <span>Xem Giỏ Hàng ({cartCount})</span>
          {cartTotal > 0 && (
            <span className="badge bg-white text-primary ms-1 font-monospace">
              ${cartTotal.toFixed(2)}
            </span>
          )}
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-3 bg-light rounded-4 border mb-4">
        <div className="row g-3 align-items-center">
          {/* Category Filter */}
          <div className="col-md-6 col-12 d-flex align-items-center gap-2">
            <label className="small fw-semibold text-secondary text-nowrap">Danh mục:</label>
            <select
              className="form-select form-select-sm bg-white"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">Tất cả 7 Fandom</option>
              {CATEGORY_LIST.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Product Type Filter */}
          <div className="col-md-6 col-12 d-flex align-items-center gap-2">
            <label className="small fw-semibold text-secondary text-nowrap">Loại vật phẩm:</label>
            <select
              className="form-select form-select-sm bg-white"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {PRODUCT_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {merchandise.length === 0 ? (
        <EmptyState
          title="Không có sản phẩm nào phù hợp"
          message="Không tìm thấy vật phẩm lưu niệm khớp với bộ lọc bạn đã chọn."
          onAction={() => {
            setSelectedCategory('all');
            setSelectedType('all');
          }}
          actionLabel="Xóa bộ lọc"
        />
      ) : (
        <div className="row g-4">
          {merchandise.map((item) => (
            <div key={item.id} className="col-xl-3 col-lg-4 col-md-6 col-12">
              <MerchCard item={item} onToast={handleShowToast} />
            </div>
          ))}
        </div>
      )}

      <ToastNotification toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
