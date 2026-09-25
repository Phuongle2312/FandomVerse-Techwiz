import React, { useState } from 'react';
import ToastNotification from '../components/common/ToastNotification.jsx';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [toast, setToast] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setToast({
      message: 'Tin nhắn của bạn đã được gửi thành công! (Chế độ mô phỏng client-side)',
      type: 'success',
      icon: 'bi-check-circle-fill',
    });
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="container-fluid px-3 px-md-4 px-lg-5 py-4">
      {/* Page Title */}
      <div className="text-center mb-5">
        <h1 className="font-heading fw-bold display-6 text-dark mb-2">Liên Hệ & Tọa Độ FandomVerse</h1>
        <p className="text-secondary mx-auto" style={{ maxWidth: '600px' }}>
          Bạn có câu hỏi, đề xuất nội dung hoặc muốn kết nối với ban quản trị cộng đồng FandomVerse? Chúng tôi luôn sẵn sàng lắng nghe!
        </p>
      </div>

      <div className="row g-4 mb-5">
        {/* Contact Form */}
        <div className="col-lg-6">
          <div className="card fv-card border-0 shadow-sm rounded-4 p-4 h-100">
            <h4 className="font-heading fw-bold text-primary mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-chat-square-dots"></i> Gửi Tin Nhắn Cho Chúng Tôi
            </h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Họ và tên của bạn</label>
                <input
                  type="text"
                  className="form-control bg-light"
                  placeholder="Nguyễn Văn A"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Địa chỉ Email</label>
                <input
                  type="email"
                  className="form-control bg-light"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Chủ đề quan tâm</label>
                <input
                  type="text"
                  className="form-control bg-light"
                  placeholder="Góp ý nội dung Anime, hợp tác sự kiện..."
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold text-secondary">Nội dung tin nhắn</label>
                <textarea
                  className="form-control bg-light"
                  rows="4"
                  placeholder="Viết nội dung tin nhắn của bạn tại đây..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary-fv px-4 py-2">
                <i className="bi bi-send me-2"></i> Gửi Tin Nhắn
              </button>
            </form>
          </div>
        </div>

        {/* Contact Information & GPS details */}
        <div className="col-lg-6">
          <div className="card fv-card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
            <h4 className="font-heading fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-geo-alt-fill text-danger"></i> Thông Tin Trụ Sở & Tọa Độ GPS
            </h4>

            <div className="d-flex flex-column gap-3 mb-4">
              <div className="d-flex align-items-start gap-3 p-3 bg-light rounded-3">
                <i className="bi bi-building fs-4 text-primary mt-1"></i>
                <div>
                  <h6 className="fw-bold mb-1">Địa chỉ trụ sở chính:</h6>
                  <p className="text-secondary small mb-0">
                    Tòa nhà Aptech Tech Center, 285 Đội Cấn, Quận Ba Đình, Hà Nội, Việt Nam.
                  </p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3 p-3 bg-light rounded-3">
                <i className="bi bi-compass fs-4 text-success mt-1"></i>
                <div>
                  <h6 className="fw-bold mb-1">Tọa độ GPS vệ tinh:</h6>
                  <p className="text-secondary small mb-0 font-monospace">
                    Vĩ độ (Latitude): <strong>21.0368° N</strong>
                    <br />
                    Kinh độ (Longitude): <strong>105.8195° E</strong>
                  </p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3 p-3 bg-light rounded-3">
                <i className="bi bi-telephone-outbound fs-4 text-info mt-1"></i>
                <div>
                  <h6 className="fw-bold mb-1">Kênh liên lạc trực tiếp:</h6>
                  <p className="text-secondary small mb-0">
                    Hotline: <strong>+84 (024) 3762 3456</strong>
                    <br />
                    Email hỗ trợ: <strong>support@fandomverse.techwir.vn</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Embedded Google Maps iframe */}
            <div className="rounded-3 overflow-hidden border shadow-xs" style={{ height: '220px' }}>
              <iframe
                title="Bản đồ Google Maps trụ sở FandomVerse"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.924403889028!2d105.81729867597148!3d21.03571068753896!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab0d127a01e7%3A0xab069cd4f9143592!2zMjg1IMSQ4buZaSBD4bqlbiwgTGnhu4d1IEdpYWksIEJhIMSQw6xuaCwgSMOgIE7hu5lpLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1711200000000!5m2!1svi!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      <ToastNotification toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
