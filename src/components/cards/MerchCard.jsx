import React, { useState } from 'react';
import { useCart } from '../../context/CartContext.jsx';
import { CATEGORY_LIST } from '../../constants.js';

export default function MerchCard({ item, onToast }) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const category = CATEGORY_LIST.find((c) => c.id === item.category);
  const categoryLabel = category ? category.label : item.category;

  const handleAddToCart = () => {
    addItem(item.id, 1);
    setIsAdded(true);
    if (onToast) {
      onToast(`Đã thêm "${item.name}" vào giỏ hàng!`);
    }
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  return (
    <div className="card fv-card h-100 border-0 shadow-sm overflow-hidden d-flex flex-column">
      {/* Product Image 1:1 ratio */}
      <div className="position-relative overflow-hidden" style={{ paddingTop: '100%', backgroundColor: '#f9f9f9' }}>
        <img
          src={item.image}
          alt={item.name}
          className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover transition-normal"
          loading="lazy"
        />
        <span className="position-absolute top-0 start-0 m-2 badge bg-dark bg-opacity-75 text-white rounded-pill px-2 py-1 small">
          {item.productType}
        </span>
      </div>

      {/* Product Details */}
      <div className="card-body p-3 d-flex flex-column flex-grow-1">
        <span className={`badge-category badge-category-${item.category} mb-2 align-self-start`}>
          {categoryLabel}
        </span>

        <h5 className="card-title font-heading fs-6 fw-bold mb-1 text-dark line-clamp-2">
          {item.name}
        </h5>

        <p className="card-text text-secondary small flex-grow-1 line-clamp-2 mb-3">
          {item.shortDescription}
        </p>

        {/* Price and Add to Cart */}
        <div className="mt-auto pt-2 border-top">
          <div className="d-flex align-items-baseline gap-1 mb-2">
            <span className="fs-5 fw-bold" style={{ color: 'var(--color-accent)' }}>
              ${item.price.toFixed(2)}
            </span>
            {item.priceMax && (
              <span className="text-secondary small fw-medium">
                - ${item.priceMax.toFixed(2)}
              </span>
            )}
          </div>

          <button
            type="button"
            className={`btn w-100 py-2 d-flex align-items-center justify-content-center gap-2 ${
              isAdded ? 'btn-success text-white' : 'btn-accent-fv'
            }`}
            onClick={handleAddToCart}
            disabled={isAdded}
          >
            <i className={`bi ${isAdded ? 'bi-check-circle-fill' : 'bi-bag-plus'}`}></i>
            <span>{isAdded ? 'Đã thêm vào giỏ!' : 'Thêm vào giỏ'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
