import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dataService } from '../../services/dataService.js';
import { useAuth } from '../../context/AuthContext.jsx';

const CATEGORY_NAMES = {
  anime: { name: 'Anime', color: '#ff5e8c', icon: 'bi-stars' },
  gaming: { name: 'Gaming', color: '#00f5d4', icon: 'bi-controller' },
  movies: { name: 'Movies', color: '#00a8ff', icon: 'bi-film' },
  tvshows: { name: 'TV Shows', color: '#a29bfe', icon: 'bi-tv' },
  kpop: { name: 'K-Pop', color: '#fd79a8', icon: 'bi-music-note-beamed' },
  comics: { name: 'Comics', color: '#feca57', icon: 'bi-book' },
  manga: { name: 'Manga', color: '#ff6b6b', icon: 'bi-journal-bookmark' },
};

export default function AdminDashboard({ onNavigateTab }) {
  const [stats, setStats] = useState(() => dataService.getStats());
  const { users, currentUser } = useAuth();

  useEffect(() => {
    const handleDataChange = () => setStats(dataService.getStats());
    window.addEventListener('fv_data_change', handleDataChange);
    return () => window.removeEventListener('fv_data_change', handleDataChange);
  }, []);

  const statCards = [
    {
      label: 'Bài viết & Media',
      value: stats.totalContents,
      icon: 'bi-file-earmark-richtext',
      color: '#00f5d4',
      bg: 'rgba(0, 245, 212, 0.1)',
      tab: 'contents',
    },
    {
      label: 'Trailer bom tấn',
      value: stats.totalTrailers,
      icon: 'bi-play-btn',
      color: '#ff5e8c',
      bg: 'rgba(255, 94, 140, 0.1)',
      tab: 'trailers',
    },
    {
      label: 'Sự kiện Fandom',
      value: stats.totalEvents,
      icon: 'bi-calendar-event',
      color: '#00a8ff',
      bg: 'rgba(0, 168, 255, 0.1)',
      tab: 'events',
    },
    {
      label: 'Vật phẩm Merch',
      value: stats.totalMerchandise,
      icon: 'bi-bag-check',
      color: '#feca57',
      bg: 'rgba(254, 202, 87, 0.1)',
      tab: 'merchandise',
    },
    {
      label: 'Nhân vật biểu tượng',
      value: stats.totalCharacters,
      icon: 'bi-person-badge',
      color: '#a29bfe',
      bg: 'rgba(162, 155, 254, 0.1)',
      tab: 'characters',
    },
    {
      label: 'Thành viên hệ thống',
      value: users.length,
      icon: 'bi-people',
      color: '#2ecc71',
      bg: 'rgba(46, 204, 113, 0.1)',
      tab: 'users',
    },
  ];

  return (
    <div className="admin-dashboard-view">
      {/* Welcome Banner */}
      <div
        className="fv-admin-card mb-4 p-4 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3"
        style={{
          background: 'linear-gradient(135deg, rgba(18, 23, 43, 0.9) 0%, rgba(30, 20, 60, 0.8) 100%)',
          border: '1px solid rgba(0, 245, 212, 0.2)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div>
          <div className="d-flex align-items-center gap-2 mb-2">
            <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 rounded-pill" style={{ fontSize: '0.75rem' }}>
              <i className="bi bi-circle-fill me-1" style={{ fontSize: '0.5rem' }}></i> Hệ thống hoạt động hoàn hảo
            </span>
            <span className="text-secondary small">| Phiên bản 2.0.0</span>
          </div>
          <h2 className="fw-bold mb-1 text-white">
            Chào mừng, <span style={{ color: '#00f5d4' }}>{currentUser?.name || 'Quản trị viên'}</span> 👋
          </h2>
          <p className="text-secondary mb-0 small">
            Bảng điều khiển quản lý nội dung đa vũ trụ FandomVerse. Tổng cộng có{' '}
            <strong className="text-white">{stats.grandTotal} dữ liệu mẫu</strong> phân bổ đều 13 mục trên cả 7 phân loại fandom.
          </p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/" className="fv-admin-btn-secondary text-decoration-none">
            <i className="bi bi-globe"></i> Xem trang chính
          </Link>
          <button
            type="button"
            className="fv-admin-btn-primary"
            onClick={() => onNavigateTab('settings')}
          >
            <i className="bi bi-gear-fill"></i> Cài đặt & Sao lưu
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="row g-3 mb-4">
        {statCards.map((card, idx) => (
          <div key={idx} className="col-12 col-sm-6 col-xl-4">
            <div
              className="fv-admin-card fv-admin-stat-card cursor-pointer"
              onClick={() => onNavigateTab(card.tab)}
              style={{ cursor: 'pointer' }}
              title={`Quản lý ${card.label}`}
            >
              <div
                className="fv-admin-stat-icon"
                style={{ background: card.bg, color: card.color }}
              >
                <i className={`bi ${card.icon}`}></i>
              </div>
              <div className="flex-grow-1">
                <div className="fv-admin-stat-val">{card.value}</div>
                <div className="fv-admin-stat-label">{card.label}</div>
              </div>
              <i className="bi bi-chevron-right text-muted opacity-50"></i>
            </div>
          </div>
        ))}
      </div>

      {/* Category Breakdown & Quick Actions */}
      <div className="row g-4 mb-4">
        {/* Category Breakdown */}
        <div className="col-12 col-lg-8">
          <div className="fv-admin-card h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0 text-white d-flex align-items-center gap-2">
                <i className="bi bi-pie-chart-fill" style={{ color: '#00f5d4' }}></i>
                Phân bổ dữ liệu theo 7 Fandom
              </h5>
              <span className="badge bg-dark border border-secondary text-secondary">
                13 mục / phần
              </span>
            </div>
            <p className="text-secondary small mb-4">
              Mỗi danh mục được cân bằng đồng đều về bài viết, trailers bom tấn, sự kiện toàn cầu, nhân vật tiêu biểu và sản phẩm độc quyền.
            </p>

            <div className="d-flex flex-column gap-3">
              {Object.entries(stats.byCategory).map(([catKey, counts]) => {
                const info = CATEGORY_NAMES[catKey] || { name: catKey, color: '#fff', icon: 'bi-tag' };
                const pct = Math.round((counts.total / (stats.grandTotal || 1)) * 100);
                return (
                  <div key={catKey}>
                    <div className="d-flex justify-content-between align-items-center mb-1 small">
                      <span className="fw-bold d-flex align-items-center gap-2" style={{ color: info.color }}>
                        <i className={`bi ${info.icon}`}></i> {info.name}
                      </span>
                      <span className="text-secondary">
                        <strong className="text-white">{counts.total}</strong> mục ({counts.contents} bài viết, {counts.trailers} trailers, {counts.events} sự kiện, {counts.characters} nhân vật, {counts.merchandise} merch)
                      </span>
                    </div>
                    <div className="progress" style={{ height: '7px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px' }}>
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: info.color,
                          borderRadius: '4px',
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Actions & System Info */}
        <div className="col-12 col-lg-4">
          <div className="fv-admin-card h-100 d-flex flex-column justify-content-between">
            <div>
              <h5 className="fw-bold mb-3 text-white d-flex align-items-center gap-2">
                <i className="bi bi-lightning-charge-fill" style={{ color: '#feca57' }}></i>
                Thao tác nhanh
              </h5>
              <div className="d-flex flex-column gap-2 mb-4">
                <button
                  type="button"
                  className="fv-admin-btn-secondary justify-content-start w-100"
                  onClick={() => onNavigateTab('contents')}
                >
                  <i className="bi bi-plus-circle text-info"></i> Thêm bài viết / media mới
                </button>
                <button
                  type="button"
                  className="fv-admin-btn-secondary justify-content-start w-100"
                  onClick={() => onNavigateTab('trailers')}
                >
                  <i className="bi bi-plus-circle text-danger"></i> Thêm trailer bom tấn
                </button>
                <button
                  type="button"
                  className="fv-admin-btn-secondary justify-content-start w-100"
                  onClick={() => onNavigateTab('events')}
                >
                  <i className="bi bi-plus-circle text-primary"></i> Đăng lịch sự kiện mới
                </button>
                <button
                  type="button"
                  className="fv-admin-btn-secondary justify-content-start w-100"
                  onClick={() => onNavigateTab('merchandise')}
                >
                  <i className="bi bi-plus-circle text-warning"></i> Thêm vật phẩm shop
                </button>
                <button
                  type="button"
                  className="fv-admin-btn-secondary justify-content-start w-100"
                  onClick={() => onNavigateTab('characters')}
                >
                  <i className="bi bi-plus-circle text-purple" style={{ color: '#a29bfe' }}></i> Thêm hồ sơ nhân vật
                </button>
              </div>
            </div>

            <div
              className="p-3 rounded-3 mt-auto"
              style={{ background: 'rgba(0, 0, 0, 0.25)', border: '1px solid rgba(255, 255, 255, 0.05)' }}
            >
              <div className="small text-secondary mb-1">Cơ chế lưu trữ:</div>
              <div className="fw-bold small text-white d-flex align-items-center gap-2">
                <i className="bi bi-hdd-network text-success"></i> LocalStorage + Live State Broadcast
              </div>
              <div className="small text-secondary mt-1" style={{ fontSize: '0.75rem' }}>
                Mọi thay đổi cập nhật tức thì ra ngoài giao diện người dùng.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
