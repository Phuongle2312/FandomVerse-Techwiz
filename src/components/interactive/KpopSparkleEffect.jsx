import React, { useEffect, useRef, useState } from 'react';

/**
 * KpopSparkleEffect - Hiệu ứng "biển lightstick" lấp lánh độc quyền cho vũ trụ K-Pop
 * Canvas 60fps: các đốm sáng neon (hồng/tím/xanh cyan/vàng) trôi nhẹ lên trên và nhấp nháy
 * như ánh đèn lightstick cổ vũ trong đêm concert. Có nút toggle bật/tắt kèm âm thanh chime nhẹ.
 */
export default function KpopSparkleEffect({ autoStart = true }) {
  const canvasRef = useRef(null);
  const [isActive, setIsActive] = useState(autoStart);
  const animFrameIdRef = useRef(null);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const sparkleColors = [
      'rgba(255, 91, 168, 0.9)',  // Hồng neon (lightstick idol nữ)
      'rgba(160, 108, 255, 0.9)', // Tím neon
      'rgba(79, 216, 255, 0.9)',  // Xanh cyan neon
      'rgba(255, 214, 107, 0.85)',// Vàng ánh kim
      'rgba(255, 255, 255, 0.85)',// Trắng lấp lánh
    ];

    const sparkleCount = Math.min(45, Math.floor(window.innerWidth / 30));
    const sparkles = [];

    for (let i = 0; i < sparkleCount; i++) {
      sparkles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.2 + 1.3,
        speedY: Math.random() * 0.5 + 0.25,
        swaySpeed: Math.random() * 0.02 + 0.008,
        swayAngle: Math.random() * Math.PI * 2,
        swayAmount: Math.random() * 0.8 + 0.3,
        twinkleSpeed: Math.random() * 0.05 + 0.02,
        twinklePhase: Math.random() * Math.PI * 2,
        color: sparkleColors[Math.floor(Math.random() * sparkleColors.length)],
      });
    }

    const drawSparkle = (p, twinkle) => {
      const r = p.size * (1.6 + twinkle * 0.8);
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 4);
      grad.addColorStop(0, p.color);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r * 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.arc(p.x, p.y, r * 0.35, 0, Math.PI * 2);
      ctx.fill();
    };

    let lastTime = performance.now();
    const render = (time) => {
      const dt = Math.min((time - lastTime) / 16.66, 2.0);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      sparkles.forEach((p) => {
        p.swayAngle += p.swaySpeed * dt;
        p.twinklePhase += p.twinkleSpeed * dt;

        p.x += Math.sin(p.swayAngle) * p.swayAmount * dt * 0.3;
        p.y -= p.speedY * dt;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x > width + 10) {
          p.x = -10;
        } else if (p.x < -10) {
          p.x = width + 10;
        }

        const twinkle = (Math.sin(p.twinklePhase) + 1) / 2;
        drawSparkle(p, twinkle);
      });

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isActive]);

  const playChime = (turningOn) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const notes = turningOn ? [523.25, 659.25, 783.99] : [659.25, 523.25];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.09, ctx.currentTime + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.32);
      });
    } catch (e) {
      // AudioContext optional / user interaction required
    }
  };

  const handleToggle = () => {
    const next = !isActive;
    setIsActive(next);
    playChime(next);
  };

  return (
    <>
      {isActive && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none',
            zIndex: 99,
          }}
        />
      )}

      {/* Nút Toggle hiệu ứng Lightstick độc quyền K-Pop */}
      <button
        type="button"
        className="btn btn-sm rounded-pill shadow-sm d-inline-flex align-items-center gap-2 border-0"
        style={{
          background: isActive
            ? 'linear-gradient(135deg, rgba(255, 91, 168, 0.9), rgba(160, 108, 255, 0.9))'
            : 'rgba(255, 255, 255, 0.15)',
          color: '#ffffff',
          backdropFilter: 'blur(10px)',
          fontSize: '0.8rem',
          fontWeight: 700,
          padding: '6px 14px',
          transition: 'all 0.3s ease',
          boxShadow: isActive ? '0 4px 15px rgba(160, 108, 255, 0.45)' : 'none',
        }}
        onClick={handleToggle}
        title={isActive ? 'Tắt hiệu ứng Lightstick' : 'Bật hiệu ứng Lightstick'}
      >
        <span>🔦</span>
        <span>{isActive ? 'Lightstick FX: Bật' : 'Lightstick FX: Tắt'}</span>
      </button>
    </>
  );
}
