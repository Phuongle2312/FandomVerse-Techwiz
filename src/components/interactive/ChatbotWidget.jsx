import React, { useState, useRef, useEffect } from 'react';
import { chatbotService } from '../../services/chatbotService.js';
import { useNavigate } from 'react-router-dom';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Xin chào fan hâm mộ! 🌌 Tôi là Trợ Lý Vũ Trụ FandomVerse. Tôi có thể giúp gì cho bạn hôm nay?',
      link: null,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const quickReplies = chatbotService.getQuickReplies();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    const time = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    // 1. Add User message
    const userMsg = { sender: 'user', text, link: null, time };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // 2. Query Chatbot Service
    setTimeout(() => {
      const response = chatbotService.matchAnswer(text);
      const botMsg = {
        sender: 'bot',
        text: response.answer,
        link: response.link,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 400);
  };

  const handleQuickReply = (question) => {
    handleSend(question);
  };

  const handleNavigate = (link) => {
    if (link) {
      // Internal route starts with #/
      const cleanPath = link.replace(/^#/, '');
      navigate(cleanPath);
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="position-fixed bottom-0 end-0 m-3 m-md-4" style={{ zIndex: 1050 }}>
        {!isOpen && (
          <button
            type="button"
            className="btn btn-primary-fv p-3 rounded-circle shadow-lg d-flex align-items-center justify-content-center position-relative"
            style={{ width: '60px', height: '60px' }}
            onClick={() => setIsOpen(true)}
            aria-label="Mở Trợ lý ảo AI Chatbot"
            title="Chat với Trợ lý FandomVerse"
          >
            <span style={{ fontSize: '1.6rem' }}>🤖</span>
            <span
              className="position-absolute top-0 start-100 translate-middle p-1 bg-success border border-light rounded-circle"
              title="Đang hoạt động"
            ></span>
          </button>
        )}
      </div>

      {/* Chat Window Overlay */}
      {isOpen && (
        <div
          className="position-fixed bottom-0 end-0 m-2 m-md-4 card border-0 shadow-lg rounded-4 overflow-hidden d-flex flex-column"
          style={{
            width: 'calc(100vw - 20px)',
            maxWidth: '380px',
            height: '520px',
            maxHeight: '85vh',
            zIndex: 1060,
          }}
        >
          {/* Header */}
          <div className="p-3 bg-primary text-white d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <span className="fs-4">🤖</span>
              <div>
                <h6 className="font-heading fw-bold mb-0 text-white">Trợ Lý FandomVerse</h6>
                <small className="text-white-50" style={{ fontSize: '0.7rem' }}>
                  <i className="bi bi-shield-check text-warning"></i> Rule-based Offline AI
                </small>
              </div>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Đóng khung chat"
              onClick={() => setIsOpen(false)}
            ></button>
          </div>

          {/* Messages Area */}
          <div className="flex-grow-1 p-3 overflow-y-auto bg-light d-flex flex-column gap-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`d-flex flex-column ${
                  msg.sender === 'user' ? 'align-items-end' : 'align-items-start'
                }`}
              >
                <div
                  className={`p-3 rounded-3 small shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-primary text-white rounded-bottom-end-0'
                      : 'bg-white text-dark rounded-bottom-start-0 border'
                  }`}
                  style={{ maxWidth: '85%', lineHeight: 1.5 }}
                >
                  <div>{msg.text}</div>
                  {msg.link && (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary mt-2 w-100 rounded-pill py-1 fw-semibold d-flex align-items-center justify-content-center gap-1"
                      onClick={() => handleNavigate(msg.link)}
                    >
                      <span>Khám phá ngay</span> <i className="bi bi-arrow-right-short fs-6"></i>
                    </button>
                  )}
                </div>
                <span className="text-muted mt-1" style={{ fontSize: '0.65rem' }}>
                  {msg.time}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies Strip */}
          <div className="p-2 bg-white border-top border-bottom overflow-x-auto d-flex gap-1" style={{ whiteSpace: 'nowrap' }}>
            {quickReplies.map((qr) => (
              <button
                key={qr.id}
                type="button"
                className="btn btn-sm btn-light border text-secondary rounded-pill px-2 py-1 small flex-shrink-0"
                style={{ fontSize: '0.75rem' }}
                onClick={() => handleQuickReply(qr.question)}
              >
                {qr.question}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            className="p-2 bg-white d-flex align-items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              type="text"
              className="form-control form-control-sm rounded-pill border bg-light"
              placeholder="Nhập câu hỏi của bạn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              className="btn btn-sm btn-primary-fv rounded-circle p-2 d-flex align-items-center justify-content-center"
              style={{ width: '36px', height: '36px', flexShrink: 0 }}
              disabled={!input.trim()}
              aria-label="Gửi tin nhắn"
            >
              <i className="bi bi-send-fill fs-6"></i>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
