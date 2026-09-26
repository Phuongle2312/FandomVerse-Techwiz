import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext.jsx';
import { useBookmarks } from '../context/BookmarkContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { CATEGORY_LIST } from '../constants.js';
import { storageService } from '../services/storageService.js';
import ToastNotification from '../components/common/ToastNotification.jsx';

export default function Profile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, logout } = useAuth();
  const { bookmarkCount } = useBookmarks();
  const { cartCount, cartTotal, setIsCartOpen, addItem } = useCart();
  const { isDark, setTheme } = useTheme();
  const { language, setLanguage, languages, bcp47 } = useLanguage();

  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [orders, setOrders] = useState(() => storageService.loadOrders());
  const [activeOrderReceipt, setActiveOrderReceipt] = useState(null);
  const [toast, setToast] = useState(null);

  const interestCategory = CATEGORY_LIST.find((c) => c.id === currentUser?.fandomInterest);
  const joinedDate = currentUser?.createdAt
    ? new Date(currentUser.createdAt).toLocaleDateString(bcp47 || (language === 'vi' ? 'vi-VN' : language === 'hi' ? 'hi-IN' : 'en-US'), {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : null;

  // Filter user orders
  const userOrders = isAuthenticated && currentUser
    ? orders.filter((o) => !o.userEmail || o.userEmail.toLowerCase() === currentUser.email.toLowerCase())
    : orders;

  const getPaymentDetails = (method) => {
    switch (method) {
      case 'momo':
        return {
          label: 'MoMo E-Wallet',
          icon: 'bi-wallet2',
          badgeClass: 'bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25',
        };
      case 'vnpay':
        return {
          label: 'VNPAY QR',
          icon: 'bi-qr-code-scan',
          badgeClass: 'bg-info bg-opacity-10 text-info border border-info border-opacity-25',
        };
      case 'banking':
        return {
          label: 'Bank Transfer',
          icon: 'bi-bank',
          badgeClass: 'bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25',
        };
      case 'card':
        return {
          label: 'Credit Card',
          icon: 'bi-credit-card',
          badgeClass: 'bg-purple bg-opacity-10 text-purple border border-purple border-opacity-25',
        };
      case 'cod':
      default:
        return {
          label: 'COD',
          icon: 'bi-cash-coin',
          badgeClass: 'bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25',
        };
    }
  };

  const handleReorder = (order) => {
    if (!order.items || order.items.length === 0) return;
    order.items.forEach((item) => {
      addItem(item.id || item.productId, item.quantity || 1);
    });
    setToast({
      id: Date.now(),
      type: 'success',
      icon: 'bi-bag-check-fill',
      message: t('profile.reorderSuccess', { count: order.items.length, id: order.orderId }),
      duration: 2500,
    });
    setIsCartOpen(true);
  };

  return (
    <div className="container-fluid px-3 px-md-4 px-lg-5 py-4" style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* 1. Profile / Account Header Card */}
      <div
        className="p-4 rounded-4 shadow-sm mb-4"
        style={{
          backgroundColor: isDark ? '#12162a' : '#ffffff',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid var(--border-color)',
        }}
      >
        {isAuthenticated && currentUser ? (
          <div className="d-flex flex-column flex-sm-row align-items-center gap-3 text-center text-sm-start">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 text-white shadow-sm"
              style={{
                width: '84px',
                height: '84px',
                background: 'linear-gradient(135deg, #6C5CE7 0%, #FF6B81 100%)',
                fontSize: '2.5rem',
              }}
            >
              <i className="bi bi-person-fill"></i>
            </div>
            <div className="flex-grow-1">
              <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-sm-start gap-2 mb-1">
                <h4 className={`font-heading fw-bold mb-0 ${isDark ? 'text-white' : 'text-dark'}`}>
                  {currentUser.name}
                </h4>
                {interestCategory && (
                  <span className={`badge-category badge-category-${interestCategory.id} d-inline-flex align-items-center gap-1`}>
                    <i className={`bi ${interestCategory.icon}`}></i> {t(`categories.${interestCategory.id}.label`) || interestCategory.label}
                  </span>
                )}
              </div>
              <p className={`small mb-1 ${isDark ? 'text-white-50' : 'text-secondary'}`}>
                <i className="bi bi-envelope me-1"></i> {currentUser.email}
              </p>
              {joinedDate && (
                <p className={`small mb-0 ${isDark ? 'text-white-50' : 'text-secondary'}`} style={{ fontSize: '0.75rem' }}>
                  <i className="bi bi-calendar3 me-1"></i> {t('profile.joinedDate', { date: joinedDate })}
                </p>
              )}
            </div>
            <button
              type="button"
              className="btn btn-sm btn-outline-danger rounded-pill px-3 py-1.5 fw-semibold mt-2 mt-sm-0"
              onClick={logout}
            >
              <i className="bi bi-box-arrow-right me-1"></i> {t('auth.logout')}
            </button>
          </div>
        ) : (
          <div className="d-flex flex-column flex-sm-row align-items-center gap-3 text-center text-sm-start">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 text-white shadow-sm"
              style={{
                width: '74px',
                height: '74px',
                background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                fontSize: '2.2rem',
              }}
            >
              <i className="bi bi-person"></i>
            </div>
            <div className="flex-grow-1">
              <h5 className={`font-heading fw-bold mb-1 ${isDark ? 'text-white' : 'text-dark'}`}>
                {t('profile.guestTitle')}
              </h5>
              <p className={`small mb-0 ${isDark ? 'text-white-50' : 'text-secondary'}`}>
                {t('profile.guestSubtitle')}
              </p>
            </div>
            <div className="d-flex align-items-center gap-2 mt-2 mt-sm-0">
              <Link to="/login" className="btn btn-sm btn-primary-fv rounded-pill px-3 py-1.5 fw-semibold">
                {t('auth.login')}
              </Link>
              <Link to="/signup" className="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1.5 fw-semibold">
                {t('auth.signup')}
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* 2. Core Activities: Giỏ hàng, Yêu thích & Lịch sử giao dịch */}
      <h6 className={`text-uppercase small fw-bold mb-3 ${isDark ? 'text-white-50' : 'text-secondary'}`} style={{ letterSpacing: '0.08em' }}>
        {t('profile.activitiesTitle')}
      </h6>
      <div className="row g-3 mb-4">
        {/* Giỏ Hàng (Cart) */}
        <div className="col-lg-4 col-sm-6 col-12">
          <div
            className="p-3 rounded-4 shadow-sm d-flex align-items-center justify-content-between h-100"
            style={{
              backgroundColor: isDark ? '#12162a' : '#ffffff',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid var(--border-color)',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, border-color 0.2s ease',
            }}
            onClick={() => setIsCartOpen(true)}
          >
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                style={{
                  width: '50px',
                  height: '50px',
                  background: 'linear-gradient(135deg, rgba(108, 92, 231, 0.2), rgba(108, 92, 231, 0.05))',
                  color: '#6C5CE7',
                  border: '1px solid rgba(108, 92, 231, 0.3)',
                }}
              >
                <i className="bi bi-cart3 fs-4"></i>
              </div>
              <div>
                <h6 className={`fw-bold mb-0 ${isDark ? 'text-white' : 'text-dark'}`}>
                  {t('profile.cartTitle')}
                </h6>
                <span className="small text-muted">
                  {cartCount > 0 ? t('profile.cartCount', { count: cartCount, total: cartTotal.toFixed(2) }) : t('profile.cartEmpty')}
                </span>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-primary-fv rounded-pill px-3 py-1 font-monospace"
              onClick={(e) => {
                e.stopPropagation();
                setIsCartOpen(true);
              }}
            >
              {t('profile.openCart')}
            </button>
          </div>
        </div>

        {/* Mục Yêu Thích (Bookmarks) */}
        <div className="col-lg-4 col-sm-6 col-12">
          <Link
            to="/bookmarks"
            className="p-3 rounded-4 shadow-sm d-flex align-items-center justify-content-between text-decoration-none h-100"
            style={{
              backgroundColor: isDark ? '#12162a' : '#ffffff',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid var(--border-color)',
              transition: 'transform 0.2s ease, border-color 0.2s ease',
            }}
          >
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                style={{
                  width: '50px',
                  height: '50px',
                  background: 'linear-gradient(135deg, rgba(255, 71, 87, 0.2), rgba(255, 71, 87, 0.05))',
                  color: '#ff4757',
                  border: '1px solid rgba(255, 71, 87, 0.3)',
                }}
              >
                <i className="bi bi-heart-fill fs-4"></i>
              </div>
              <div>
                <h6 className={`fw-bold mb-0 ${isDark ? 'text-white' : 'text-dark'}`}>
                  {t('profile.bookmarksTitle')}
                </h6>
                <span className="small text-muted">
                  {bookmarkCount > 0 ? t('profile.bookmarksCount', { count: bookmarkCount }) : t('profile.bookmarksEmpty')}
                </span>
              </div>
            </div>
            <i className="bi bi-chevron-right text-secondary fs-5"></i>
          </Link>
        </div>

        {/* Lịch Sử Đơn Hàng (Orders shortcut) */}
        <div className="col-lg-4 col-sm-12 col-12">
          <a
            href="#order-history-section"
            className="p-3 rounded-4 shadow-sm d-flex align-items-center justify-content-between text-decoration-none h-100"
            style={{
              backgroundColor: isDark ? '#12162a' : '#ffffff',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid var(--border-color)',
              transition: 'transform 0.2s ease, border-color 0.2s ease',
            }}
          >
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                style={{
                  width: '50px',
                  height: '50px',
                  background: 'linear-gradient(135deg, rgba(0, 184, 148, 0.2), rgba(0, 206, 201, 0.05))',
                  color: '#00b894',
                  border: '1px solid rgba(0, 184, 148, 0.3)',
                }}
              >
                <i className="bi bi-receipt-cutoff fs-4"></i>
              </div>
              <div>
                <h6 className={`fw-bold mb-0 ${isDark ? 'text-white' : 'text-dark'}`}>
                  {t('profile.ordersTitle')}
                </h6>
                <span className="small text-muted">
                  {t('profile.ordersCount', { count: userOrders.length })}
                </span>
              </div>
            </div>
            <i className="bi bi-arrow-down-short text-secondary fs-4"></i>
          </a>
        </div>
      </div>

      {/* 2.5. Dedicated Order & Transaction History */}
      <div id="order-history-section" className="mb-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h6 className={`text-uppercase small fw-bold mb-0 ${isDark ? 'text-white-50' : 'text-secondary'}`} style={{ letterSpacing: '0.08em' }}>
            {t('profile.ordersTitle')}
          </h6>
          <span
            className="badge rounded-pill px-2.5 py-1 small"
            style={{
              backgroundColor: isDark ? 'rgba(0, 184, 148, 0.15)' : 'rgba(0, 184, 148, 0.1)',
              color: '#00b894',
            }}
          >
            {t('profile.ordersCount', { count: userOrders.length })}
          </span>
        </div>

        {userOrders.length === 0 ? (
          <div
            className="p-5 rounded-4 shadow-sm text-center"
            style={{
              backgroundColor: isDark ? '#12162a' : '#ffffff',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid var(--border-color)',
            }}
          >
            <div
              className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
              style={{
                width: '64px',
                height: '64px',
                background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                color: '#6C5CE7',
              }}
            >
              <i className="bi bi-receipt fs-2"></i>
            </div>
            <h6 className={`fw-bold mb-1 ${isDark ? 'text-white' : 'text-dark'}`}>
              {t('profile.noOrdersTitle')}
            </h6>
            <p className={`small mb-3 ${isDark ? 'text-white-50' : 'text-muted'}`} style={{ maxWidth: '420px', margin: '0 auto' }}>
              {t('profile.noOrdersSubtitle')}
            </p>
            <Link to="/merchandise" className="btn btn-sm btn-primary-fv rounded-pill px-4 py-2 fw-semibold">
              <i className="bi bi-shop me-1.5"></i> {t('profile.shopNow')}
            </Link>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {userOrders.map((order) => {
              const payment = getPaymentDetails(order.paymentMethod);
              const itemCount = order.items?.reduce((sum, it) => sum + (it.quantity || 1), 0) || 0;

              return (
                <div
                  key={order.orderId}
                  className="rounded-4 shadow-sm overflow-hidden"
                  style={{
                    backgroundColor: isDark ? '#12162a' : '#ffffff',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid var(--border-color)',
                    transition: 'border-color 0.2s ease, transform 0.2s ease',
                  }}
                >
                  {/* Order Card Header */}
                  <div
                    className="p-3 px-md-4 d-flex flex-wrap align-items-center justify-content-between gap-2 border-bottom"
                    style={{
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.015)',
                    }}
                  >
                    <div className="d-flex flex-wrap align-items-center gap-2">
                      <span className="badge rounded-pill bg-primary bg-opacity-15 text-primary font-monospace fw-bold px-2.5 py-1">
                        #{order.orderId}
                      </span>
                      <span className={`small ${isDark ? 'text-white-50' : 'text-secondary'}`} style={{ fontSize: '0.8rem' }}>
                        <i className="bi bi-calendar-event me-1"></i> {order.date}
                      </span>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      {/* Payment method badge */}
                      <span className={`badge rounded-pill px-2.5 py-1 small d-inline-flex align-items-center gap-1 ${payment.badgeClass}`}>
                        <i className={`bi ${payment.icon}`}></i> {payment.label}
                      </span>
                      {/* Order status badge */}
                      <span className="badge rounded-pill bg-success bg-opacity-15 text-success border border-success border-opacity-25 px-2.5 py-1 small d-inline-flex align-items-center gap-1">
                        <i className="bi bi-check-circle-fill"></i> {order.status === 'completed' ? t('profile.statusCompleted') : t('profile.statusProcessing')}
                      </span>
                    </div>
                  </div>

                  {/* Order Card Items List */}
                  <div className="p-3 px-md-4">
                    <div className="d-flex flex-column gap-2 mb-3">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="d-flex align-items-center justify-content-between gap-3 py-1">
                          <div className="d-flex align-items-center gap-3" style={{ minWidth: 0 }}>
                            <img
                              src={item.image || '/image/luffy.jpg'}
                              alt={item.name}
                              className="rounded-3 flex-shrink-0 object-fit-cover shadow-xs"
                              style={{ width: '48px', height: '48px', backgroundColor: isDark ? '#1a1f36' : '#e2e8f0' }}
                              onError={(e) => {
                                e.target.src = '/image/luffy.jpg';
                              }}
                            />
                            <div className="text-truncate">
                              <h6 className={`fw-semibold mb-0 small text-truncate ${isDark ? 'text-white' : 'text-dark'}`} style={{ maxWidth: '380px' }}>
                                {item.name}
                              </h6>
                              <span className="small text-muted" style={{ fontSize: '0.75rem' }}>
                                ${Number(item.price || 0).toFixed(2)} × {item.quantity || 1}
                              </span>
                            </div>
                          </div>
                          <div className="text-end flex-shrink-0">
                            <span className={`fw-bold small font-monospace ${isDark ? 'text-white' : 'text-dark'}`}>
                              ${Number((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Address Brief */}
                    {order.shippingInfo && (
                      <div
                        className="p-2.5 rounded-3 mb-3 d-flex align-items-start gap-2 small"
                        style={{
                          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                          color: isDark ? '#cbd5e1' : '#64748b',
                          fontSize: '0.78rem',
                        }}
                      >
                        <i className="bi bi-geo-alt-fill text-danger flex-shrink-0 mt-0.5"></i>
                        <div>
                          <strong className={isDark ? 'text-white' : 'text-dark'}>{order.shippingInfo.fullName}</strong>
                          {order.shippingInfo.phone && ` • ${order.shippingInfo.phone}`}
                          <span className="d-block text-muted">
                            {[order.shippingInfo.address, order.shippingInfo.district, order.shippingInfo.city].filter(Boolean).join(', ')}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Order Card Footer */}
                    <div
                      className="pt-3 border-top d-flex flex-wrap align-items-center justify-content-between gap-3"
                      style={{ borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)' }}
                    >
                      <div className="d-flex align-items-baseline gap-2">
                        <span className={`small ${isDark ? 'text-white-50' : 'text-secondary'}`}>
                          {t('profile.orderTotal')}
                        </span>
                        <span className="fs-5 fw-bold font-heading text-gradient-primary">
                          ${Number(order.total || 0).toFixed(2)}
                        </span>
                        <span className="small text-muted" style={{ fontSize: '0.75rem' }}>
                          ({itemCount} {t('profile.orderItems').toLowerCase().replace(':', '')})
                        </span>
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1.5 fw-semibold d-inline-flex align-items-center gap-1.5"
                          onClick={() => setActiveOrderReceipt(order)}
                        >
                          <i className="bi bi-receipt"></i>
                          {t('profile.viewInvoice')}
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-primary-fv rounded-pill px-3 py-1.5 fw-semibold d-inline-flex align-items-center gap-1.5"
                          onClick={() => handleReorder(order)}
                        >
                          <i className="bi bi-cart-plus"></i>
                          {t('profile.reorder')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Cài Đặt Hệ Thống: Chế Độ Giao Diện & Ngôn Ngữ Dạng Xổ Xuống */}
      <h6 className={`text-uppercase small fw-bold mb-3 ${isDark ? 'text-white-50' : 'text-secondary'}`} style={{ letterSpacing: '0.08em' }}>
        {t('profile.settingsTitle')}
      </h6>
      <div className="d-flex flex-column gap-3 mb-4">
        {/* Item 1: Chế Độ Giao Diện (Accordion) */}
        <div
          className="rounded-4 shadow-sm overflow-hidden"
          style={{
            backgroundColor: isDark ? '#12162a' : '#ffffff',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid var(--border-color)',
            transition: 'border-color 0.2s ease',
          }}
        >
          {/* Header Row */}
          <div
            className="p-3 d-flex align-items-center justify-content-between"
            style={{ cursor: 'pointer' }}
            onClick={() => setIsThemeOpen((prev) => !prev)}
          >
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                style={{
                  width: '50px',
                  height: '50px',
                  background: isDark
                    ? 'linear-gradient(135deg, rgba(162, 155, 254, 0.2), rgba(108, 92, 231, 0.1))'
                    : 'linear-gradient(135deg, rgba(255, 177, 66, 0.2), rgba(255, 159, 26, 0.1))',
                  color: isDark ? '#a29bfe' : '#e67e22',
                  border: isDark ? '1px solid rgba(162, 155, 254, 0.3)' : '1px solid rgba(255, 177, 66, 0.4)',
                }}
              >
                <i className={`bi ${isDark ? 'bi-moon-stars-fill' : 'bi-sun-fill'} fs-4`}></i>
              </div>
              <div>
                <h6 className={`fw-bold mb-0 ${isDark ? 'text-white' : 'text-dark'}`}>
                  {t('profile.themeTitle')}
                </h6>
                <span className="small text-muted">
                  {isDark ? `🌙 ${t('profile.darkTheme')}` : `☀️ ${t('profile.lightTheme')}`}
                </span>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span
                className="badge rounded-pill px-2.5 py-1 small"
                style={{
                  backgroundColor: isDark ? 'rgba(162, 155, 254, 0.15)' : 'rgba(230, 126, 34, 0.15)',
                  color: isDark ? '#a29bfe' : '#d35400',
                }}
              >
                {isDark ? t('profile.darkBadge') : t('profile.lightBadge')}
              </span>
              <i className={`bi bi-chevron-${isThemeOpen ? 'up' : 'down'} text-secondary fs-5`}></i>
            </div>
          </div>

          {/* Collapsible Options List */}
          {isThemeOpen && (
            <div className="px-3 pb-3 pt-1 border-top border-secondary border-opacity-10">
              <div className="d-flex flex-column gap-2 mt-2">
                {/* Dark Mode Choice */}
                <div
                  className={`p-2.5 rounded-3 d-flex align-items-center justify-content-between ${
                    isDark
                      ? 'bg-primary bg-opacity-20 border border-primary'
                      : (isDark ? 'bg-white bg-opacity-5' : 'bg-light')
                  }`}
                  style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                  onClick={() => setTheme('dark')}
                >
                  <div className="d-flex align-items-center gap-2.5">
                    <span className="fs-5">🌙</span>
                    <div>
                      <div className={`fw-semibold small ${isDark ? 'text-white' : 'text-dark'}`}>
                        {t('profile.darkTheme')}
                      </div>
                      <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                        {t('profile.darkSubtitle')}
                      </div>
                    </div>
                  </div>
                  {isDark && <i className="bi bi-check2-circle text-primary fs-5"></i>}
                </div>

                {/* Light Mode Choice */}
                <div
                  className={`p-2.5 rounded-3 d-flex align-items-center justify-content-between ${
                    !isDark
                      ? 'bg-primary bg-opacity-15 border border-primary'
                      : (isDark ? 'bg-white bg-opacity-5' : 'bg-light')
                  }`}
                  style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                  onClick={() => setTheme('light')}
                >
                  <div className="d-flex align-items-center gap-2.5">
                    <span className="fs-5">☀️</span>
                    <div>
                      <div className={`fw-semibold small ${isDark ? 'text-white' : 'text-dark'}`}>
                        {t('profile.lightTheme')}
                      </div>
                      <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                        {t('profile.lightSubtitle')}
                      </div>
                    </div>
                  </div>
                  {!isDark && <i className="bi bi-check2-circle text-primary fs-5"></i>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Item 2: Ngôn Ngữ Hiển Thị (Accordion) */}
        <div
          className="rounded-4 shadow-sm overflow-hidden"
          style={{
            backgroundColor: isDark ? '#12162a' : '#ffffff',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid var(--border-color)',
            transition: 'border-color 0.2s ease',
          }}
        >
          {/* Header Row */}
          <div
            className="p-3 d-flex align-items-center justify-content-between"
            style={{ cursor: 'pointer' }}
            onClick={() => setIsLanguageOpen((prev) => !prev)}
          >
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                style={{
                  width: '50px',
                  height: '50px',
                  background: 'linear-gradient(135deg, rgba(0, 184, 148, 0.2), rgba(0, 206, 201, 0.1))',
                  color: '#00b894',
                  border: '1px solid rgba(0, 184, 148, 0.3)',
                }}
              >
                <i className="bi bi-translate fs-4"></i>
              </div>
              <div>
                <h6 className={`fw-bold mb-0 ${isDark ? 'text-white' : 'text-dark'}`}>
                  {t('profile.languageTitle')}
                </h6>
                <span className="small text-muted">
                  {languages.find((l) => l.code === language)?.flag}{' '}
                  {languages.find((l) => l.code === language)?.label}
                </span>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="badge rounded-pill bg-success bg-opacity-10 text-success small">
                {languages.find((l) => l.code === language)?.label || language}
              </span>
              <i className={`bi bi-chevron-${isLanguageOpen ? 'up' : 'down'} text-secondary fs-5`}></i>
            </div>
          </div>

          {/* Collapsible Options List */}
          {isLanguageOpen && (
            <div className="px-3 pb-3 pt-1 border-top border-secondary border-opacity-10">
              <div className="d-flex flex-column gap-2 mt-2">
                {languages.map((l) => {
                  const isActive = language === l.code;
                  const languageDescriptions = {
                    vi: t('profile.langViDesc'),
                    en: t('profile.langEnDesc'),
                    hi: t('profile.langHiDesc'),
                  };
                  return (
                    <div
                      key={l.code}
                      className={`p-2.5 rounded-3 d-flex align-items-center justify-content-between ${
                        isActive
                          ? 'bg-primary bg-opacity-15 border border-primary'
                          : (isDark ? 'bg-white bg-opacity-5' : 'bg-light')
                      }`}
                      style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                      onClick={() => setLanguage(l.code)}
                    >
                      <div className="d-flex align-items-center gap-2.5">
                        <span className="fs-4">{l.flag}</span>
                        <div>
                          <div className={`fw-semibold small ${isDark ? 'text-white' : 'text-dark'}`}>
                            {l.label}
                          </div>
                          <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                            {languageDescriptions[l.code] || l.label}
                          </div>
                        </div>
                      </div>
                      {isActive && <i className="bi bi-check2-circle text-primary fs-5"></i>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Khám phá & Tiện ích khác */}
      <h6 className={`text-uppercase small fw-bold mb-3 ${isDark ? 'text-white-50' : 'text-secondary'}`} style={{ letterSpacing: '0.08em' }}>
        {t('profile.exploreTitle')}
      </h6>
      <div
        className="rounded-4 shadow-sm overflow-hidden mb-4"
        style={{
          backgroundColor: isDark ? '#12162a' : '#ffffff',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid var(--border-color)',
        }}
      >
        <Link
          to="/merchandise"
          className={`d-flex align-items-center justify-content-between p-3 text-decoration-none border-bottom ${isDark ? 'border-secondary border-opacity-25 text-white' : 'text-dark'}`}
        >
          <div className="d-flex align-items-center gap-3">
            <i className="bi bi-shop fs-5 text-success"></i>
            <span className="fw-semibold small">{t('profile.merchShop')}</span>
          </div>
          <i className="bi bi-chevron-right text-secondary"></i>
        </Link>
        <Link
          to="/trailers"
          className={`d-flex align-items-center justify-content-between p-3 text-decoration-none border-bottom ${isDark ? 'border-secondary border-opacity-25 text-white' : 'text-dark'}`}
        >
          <div className="d-flex align-items-center gap-3">
            <i className="bi bi-play-circle-fill fs-5 text-danger"></i>
            <span className="fw-semibold small">{t('profile.trailersHub')}</span>
          </div>
          <i className="bi bi-chevron-right text-secondary"></i>
        </Link>
        <Link
          to="/about"
          className={`d-flex align-items-center justify-content-between p-3 text-decoration-none border-bottom ${isDark ? 'border-secondary border-opacity-25 text-white' : 'text-dark'}`}
        >
          <div className="d-flex align-items-center gap-3">
            <i className="bi bi-info-circle-fill fs-5 text-info"></i>
            <span className="fw-semibold small">{t('profile.aboutUs')}</span>
          </div>
          <i className="bi bi-chevron-right text-secondary"></i>
        </Link>
        <Link
          to="/contact"
          className={`d-flex align-items-center justify-content-between p-3 text-decoration-none ${isDark ? 'text-white' : 'text-dark'}`}
        >
          <div className="d-flex align-items-center gap-3">
            <i className="bi bi-envelope-fill fs-5 text-warning"></i>
            <span className="fw-semibold small">{t('profile.contactSupport')}</span>
          </div>
          <i className="bi bi-chevron-right text-secondary"></i>
        </Link>
      </div>

      {/* 5. Order Receipt Modal */}
      {activeOrderReceipt && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 1060 }}
          onClick={() => setActiveOrderReceipt(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="modal-content rounded-4 shadow-lg border-0 overflow-hidden"
              style={{
                backgroundColor: isDark ? '#12162a' : '#ffffff',
                color: isDark ? '#f8fafc' : '#1e293b',
              }}
            >
              {/* Modal Header */}
              <div
                className="modal-header border-bottom p-3 px-4 d-flex align-items-center justify-content-between"
                style={{ borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
              >
                <div className="d-flex align-items-center gap-2.5">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center text-white"
                    style={{
                      width: '38px',
                      height: '38px',
                      background: 'linear-gradient(135deg, #6C5CE7 0%, #FF6B81 100%)',
                    }}
                  >
                    <i className="bi bi-receipt"></i>
                  </div>
                  <div>
                    <h5 className="modal-title font-heading fw-bold mb-0" style={{ fontSize: '1.1rem' }}>
                      {t('profile.receiptTitle')}
                    </h5>
                    <span className="small text-muted font-monospace">
                      #{activeOrderReceipt.orderId}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className={`btn-close ${isDark ? 'btn-close-white' : ''}`}
                  onClick={() => setActiveOrderReceipt(null)}
                  aria-label="Close"
                ></button>
              </div>

              {/* Modal Body */}
              <div className="modal-body p-4">
                {/* Meta details banner */}
                <div className="row g-3 mb-4">
                  <div className="col-sm-6 col-12">
                    <div
                      className="p-3 rounded-3 h-100"
                      style={{ backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#f8fafc' }}
                    >
                      <div className="text-uppercase small fw-bold text-muted mb-2" style={{ fontSize: '0.7rem' }}>
                        {t('profile.recipient')}
                      </div>
                      <div className="fw-bold">{activeOrderReceipt.shippingInfo?.fullName || activeOrderReceipt.userName}</div>
                      <div className="small text-muted">{activeOrderReceipt.shippingInfo?.email || activeOrderReceipt.userEmail}</div>
                      <div className="small text-muted">{activeOrderReceipt.shippingInfo?.phone}</div>
                      <div className="small text-muted mt-1">
                        <i className="bi bi-geo-alt me-1"></i>
                        {[activeOrderReceipt.shippingInfo?.address, activeOrderReceipt.shippingInfo?.district, activeOrderReceipt.shippingInfo?.city].filter(Boolean).join(', ')}
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-6 col-12">
                    <div
                      className="p-3 rounded-3 h-100"
                      style={{ backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#f8fafc' }}
                    >
                      <div className="text-uppercase small fw-bold text-muted mb-2" style={{ fontSize: '0.7rem' }}>
                        {t('profile.orderStatus')}
                      </div>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span className="badge rounded-pill bg-success bg-opacity-15 text-success border border-success border-opacity-25 px-2.5 py-1">
                          <i className="bi bi-check-circle-fill me-1"></i> {activeOrderReceipt.status === 'completed' ? t('profile.statusCompleted') : t('profile.statusProcessing')}
                        </span>
                        <span className="small text-muted font-monospace">
                          {activeOrderReceipt.date}
                        </span>
                      </div>
                      <div className="text-uppercase small fw-bold text-muted mb-1" style={{ fontSize: '0.7rem' }}>
                        {t('profile.paymentMethod')}
                      </div>
                      <div className="small fw-semibold">
                        {getPaymentDetails(activeOrderReceipt.paymentMethod).label}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items breakdown table */}
                <div className="table-responsive mb-4">
                  <table className={`table table-sm align-middle mb-0 ${isDark ? 'table-dark' : ''}`} style={{ backgroundColor: 'transparent' }}>
                    <thead>
                      <tr className="text-muted small border-bottom" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
                        <th style={{ width: '55%' }}>{t('profile.orderItems')}</th>
                        <th className="text-center" style={{ width: '15%' }}>Qty</th>
                        <th className="text-end" style={{ width: '15%' }}>Price</th>
                        <th className="text-end" style={{ width: '15%' }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeOrderReceipt.items?.map((item, idx) => (
                        <tr key={idx} style={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                          <td>
                            <div className="d-flex align-items-center gap-2 py-1">
                              <img
                                src={item.image || '/image/luffy.jpg'}
                                alt={item.name}
                                className="rounded-2 object-fit-cover flex-shrink-0"
                                style={{ width: '36px', height: '36px' }}
                                onError={(e) => {
                                  e.target.src = '/image/luffy.jpg';
                                }}
                              />
                              <div className="small fw-semibold text-truncate" style={{ maxWidth: '280px' }}>
                                {item.name}
                              </div>
                            </div>
                          </td>
                          <td className="text-center small font-monospace">{item.quantity || 1}</td>
                          <td className="text-end small font-monospace">${Number(item.price || 0).toFixed(2)}</td>
                          <td className="text-end small font-monospace fw-bold">
                            ${Number((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Financial summary calculations */}
                <div
                  className="p-3 rounded-3"
                  style={{ backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : '#f8fafc' }}
                >
                  <div className="d-flex justify-content-between small text-muted mb-1.5">
                    <span>Subtotal</span>
                    <span className="font-monospace">${Number(activeOrderReceipt.subtotal || 0).toFixed(2)}</span>
                  </div>
                  {activeOrderReceipt.discount > 0 && (
                    <div className="d-flex justify-content-between small text-success mb-1.5">
                      <span>Discount</span>
                      <span className="font-monospace">-${Number(activeOrderReceipt.discount).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="d-flex justify-content-between small text-muted mb-1.5">
                    <span>Shipping</span>
                    <span className="font-monospace">
                      {activeOrderReceipt.shippingFee === 0 ? 'Free ($0.00)' : `$${Number(activeOrderReceipt.shippingFee || 0).toFixed(2)}`}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between small text-muted mb-2">
                    <span>VAT (8%)</span>
                    <span className="font-monospace">${Number(activeOrderReceipt.vatTax || 0).toFixed(2)}</span>
                  </div>
                  <div
                    className="d-flex justify-content-between align-items-center pt-2 border-top"
                    style={{ borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
                  >
                    <span className="fw-bold">{t('profile.orderTotal')}</span>
                    <span className="fs-4 fw-bold font-heading text-gradient-primary">
                      ${Number(activeOrderReceipt.total || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div
                className="modal-footer border-top p-3 px-4 d-flex justify-content-between"
                style={{ borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
              >
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                  onClick={() => window.print()}
                >
                  <i className="bi bi-printer me-1"></i> {t('profile.printReceipt')}
                </button>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                    onClick={() => setActiveOrderReceipt(null)}
                  >
                    {t('profile.close')}
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-primary-fv rounded-pill px-3.5"
                    onClick={() => {
                      handleReorder(activeOrderReceipt);
                      setActiveOrderReceipt(null);
                    }}
                  >
                    <i className="bi bi-cart-plus me-1"></i> {t('profile.reorder')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <ToastNotification toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
