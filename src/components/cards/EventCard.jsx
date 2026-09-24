import React from 'react';

export default function EventCard({ event }) {
  const eventDate = new Date(event.date);
  const day = eventDate.getDate().toString().padStart(2, '0');
  const month = `Th${eventDate.getMonth() + 1}`;
  const year = eventDate.getFullYear();

  const today = new Date().toISOString().split('T')[0];
  const isUpcoming = event.date >= today;

  return (
    <div className="card fv-card h-100 border-0 shadow-sm p-3">
      <div className="d-flex gap-3 align-items-start">
        {/* Date Block */}
        <div
          className="d-flex flex-column align-items-center justify-content-center rounded-3 p-2 text-center text-primary"
          style={{
            minWidth: '70px',
            backgroundColor: 'var(--color-primary-light)',
            border: '1px solid rgba(108, 92, 231, 0.2)',
          }}
        >
          <span className="font-heading fw-bold fs-4 lh-1 text-primary">{day}</span>
          <span className="fw-semibold small text-uppercase" style={{ fontSize: '0.75rem' }}>{month}</span>
          <span className="text-muted" style={{ fontSize: '0.65rem' }}>{year}</span>
        </div>

        {/* Content Block */}
        <div className="flex-grow-1">
          <div className="d-flex align-items-center justify-content-between mb-1 gap-2">
            <span
              className={`badge rounded-pill small ${
                isUpcoming ? 'bg-warning text-dark' : 'bg-secondary-subtle text-secondary'
              }`}
              style={{ fontSize: '0.7rem' }}
            >
              {isUpcoming ? '⚡ Sắp diễn ra' : '✓ Đã diễn ra'}
            </span>
            <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
              <i className="bi bi-geo-alt-fill text-danger me-1"></i>
              {event.location.split(',')[0]}
            </span>
          </div>

          <h5 className="font-heading fs-6 fw-bold mb-1 text-dark">
            {event.title}
          </h5>

          <p className="text-secondary small mb-2 line-clamp-2">
            {event.description}
          </p>

          <div className="text-muted small d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
            <i className="bi bi-pin-map text-primary"></i>
            <span>{event.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
