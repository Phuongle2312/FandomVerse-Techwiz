import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORY_LIST } from '../constants.js';

export default function About() {
  return (
    <div className="container py-4">
      {/* Hero Section */}
      <div className="text-center py-5 mb-5 bg-primary bg-opacity-10 rounded-4 px-3">
        <span style={{ fontSize: '3rem' }}>🌌</span>
        <h1 className="font-heading display-5 fw-bold text-primary mb-3">Về Dự Án FandomVerse</h1>
        <p className="lead text-secondary mx-auto" style={{ maxWidth: '700px' }}>
          Cổng thông tin vũ trụ người hâm mộ đầu tiên tích hợp 7 danh mục văn hóa đại chúng lớn nhất thế giới dưới một nền tảng Single Page Application (SPA) mượt mà và trực quan.
        </p>
        <div className="badge bg-primary px-3 py-2 fs-6 rounded-pill mt-2">
          Kỳ thi TechWir — Web Innovation Unleashed (© Aptech Limited)
        </div>
      </div>

      {/* Vision & Problem Statement */}
      <div className="row g-4 align-items-center mb-5">
        <div className="col-lg-6">
          <h2 className="font-heading fw-bold text-dark mb-3">Sứ Mệnh Của Chúng Tôi</h2>
          <p className="text-secondary leading-relaxed">
            Trước đây, người hâm mộ phải chuyển qua lại giữa hàng chục trang web khác nhau — từ fan wiki, diễn đàn thảo luận, kênh video đến các cửa hàng quà tặng — chỉ để theo dõi một bộ phim hay một tựa game yêu thích.
          </p>
          <p className="text-secondary leading-relaxed">
            <strong>FandomVerse</strong> ra đời nhằm phá vỡ sự phân mảnh đó. Chúng tôi mang đến một không gian trung tâm, nơi bạn có thể khám phá những bài viết phân tích sâu sắc, chiêm ngưỡng các bộ ảnh tuyệt mỹ, xem trailer bom tấn, tìm hiểu hồ sơ nhân vật và lưu giữ những món quà lưu niệm ý nghĩa.
          </p>
        </div>
        <div className="col-lg-6">
          <div className="p-4 bg-white rounded-4 border shadow-sm">
            <h4 className="font-heading fw-bold text-primary mb-3">Điểm Nhấn Công Nghệ</h4>
            <ul className="list-unstyled mb-0 d-flex flex-column gap-3">
              <li className="d-flex align-items-start gap-2">
                <i className="bi bi-cpu text-primary fs-5 mt-1"></i>
                <div>
                  <strong>No-Backend Architecture:</strong> Hoạt động thuần túy trên trình duyệt bằng cách tải trước các bộ dữ liệu JSON tĩnh được tối ưu hóa cao.
                </div>
              </li>
              <li className="d-flex align-items-start gap-2">
                <i className="bi bi-robot text-success fs-5 mt-1"></i>
                <div>
                  <strong>Trợ lý ảo Rule-Based:</strong> Chatbot thông minh xử lý câu hỏi thường gặp và điều hướng tức thì mà không cần phụ thuộc vào API AI bên ngoài.
                </div>
              </li>
              <li className="d-flex align-items-start gap-2">
                <i className="bi bi-phone text-warning fs-5 mt-1"></i>
                <div>
                  <strong>Responsive & Accessible:</strong> Tối ưu hóa trên mọi thiết bị từ Mobile (375px) đến Desktop, tuân thủ nghiêm ngặt tiêu chuẩn tiếp cận WCAG AA.
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 7 Fandom Universes Grid */}
      <div className="mb-5">
        <h3 className="font-heading fw-bold text-center mb-4">7 Vũ Trụ Fandom Kết Nối</h3>
        <div className="row g-3">
          {CATEGORY_LIST.map((cat) => (
            <div key={cat.id} className="col-md-4 col-sm-6">
              <div className={`card fv-card h-100 p-3 accent-border-${cat.id} border-0 shadow-sm`}>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className={`badge-category badge-category-${cat.id}`}>
                    <i className={`bi ${cat.icon} me-1`}></i> {cat.label}
                  </span>
                </div>
                <p className="text-secondary small mb-3 flex-grow-1">{cat.description}</p>
                <Link to={`/category/${cat.id}`} className="btn btn-sm btn-outline-fv w-100">
                  Khám phá {cat.label}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Aptech Credential Box */}
      <div className="p-4 bg-light rounded-4 text-center border">
        <h5 className="font-heading fw-bold mb-2">Thông Tin Phát Hành & Bản Quyền</h5>
        <p className="text-muted small mx-auto mb-3" style={{ maxWidth: '600px' }}>
          Dự án được xây dựng và hoàn thiện bởi thí sinh tham gia kỳ thi kỹ thuật công nghệ TechWir. Mọi hình ảnh và video minh họa trong dự án đều sử dụng nguồn bản quyền mở công khai (Royalty-free) hoặc liên kết nhúng chính thức.
        </p>
        <Link to="/" className="btn btn-primary-fv px-4 py-2">
          Bắt đầu hành trình khám phá
        </Link>
      </div>
    </div>
  );
}
