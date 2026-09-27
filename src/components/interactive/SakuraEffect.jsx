import React, { useEffect, useRef, useState } from 'react';

/**
 * SakuraEffect - Hiệu ứng mưa hoa anh đào rơi độc quyền cho vũ trụ Anime
 * Hiệu năng cao bằng HTML5 Canvas 60fps, tự điều chỉnh theo kích thước màn hình
 * Có nút toggle tiện lợi để người dùng linh hoạt bật / tắt
 */
export default function SakuraEffect({ autoStart = false }) {
  const canvasRef = useRef(null);
  const [isActive, setIsActive] = useState(autoStart);
  const animFrameIdRef = useRef(null);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Tạo cánh hoa anh đào tối ưu (tối đa 18 cánh)
    const petalCount = Math.min(18, Math.max(8, Math.floor(window.innerWidth / 80)));
    const petals = [];

    const petalColors = [
      'rgba(255, 183, 197, 0.85)', // Hồng phấn nhẹ
      'rgba(255, 154, 180, 0.8)',  // Hồng đào tươi
      'rgba(255, 204, 218, 0.75)', // Hồng kem
      'rgba(255, 126, 160, 0.7)',  // Hồng đậm anh đào
      'rgba(255, 230, 240, 0.8)',  // Cánh hoa trắng hồng
    ];

    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        size: Math.random() * 8 + 8,
        speedY: Math.random() * 1.4 + 0.8,
        speedX: Math.random() * 1.2 - 0.6,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1.5,
        swaySpeed: Math.random() * 0.02 + 0.01,
        swayAngle: Math.random() * Math.PI * 2,
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
        flip: Math.random() * Math.PI,
        flipSpeed: Math.random() * 0.03 + 0.01,
      });
    }

    const drawPetal = (p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.scale(Math.cos(p.flip), 1);

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(
        -p.size / 2, -p.size * 0.6,
        -p.size / 1.5, -p.size * 1.2,
        0, -p.size * 1.6
      );
      ctx.bezierCurveTo(
        p.size / 1.5, -p.size * 1.2,
        p.size / 2, -p.size * 0.6,
        0, 0
      );

      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.restore();
    };

    let isTabVisible = !document.hidden;
    const handleVisibility = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    let isScrolledDown = false;
    const handleScroll = () => {
      isScrolledDown = window.scrollY > 750;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    let lastTime = performance.now();
    const render = (time) => {
      if (!isTabVisible || isScrolledDown) {
        animFrameIdRef.current = requestAnimationFrame(render);
        return;
      }

      const dt = Math.min((time - lastTime) / 16.66, 2.0);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      petals.forEach((p) => {
        p.swayAngle += p.swaySpeed * dt;
        p.flip += p.flipSpeed * dt;
        p.rotation += p.rotationSpeed * dt;

        p.x += (Math.sin(p.swayAngle) * 1.2 + p.speedX) * dt;
        p.y += p.speedY * dt;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) {
          p.x = -20;
        } else if (p.x < -20) {
          p.x = width + 20;
        }

        drawPetal(p);
      });

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('scroll', handleScroll);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isActive]);

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

      {/* Nút Toggle linh hoạt hiệu ứng Sakura độc quyền */}
      <button
        type="button"
        className="btn btn-sm rounded-pill shadow-sm d-inline-flex align-items-center gap-2 border-0"
        style={{
          background: isActive
            ? 'linear-gradient(135deg, rgba(255, 107, 129, 0.9), rgba(238, 82, 83, 0.9))'
            : 'rgba(255, 255, 255, 0.15)',
          color: '#ffffff',
          backdropFilter: 'blur(10px)',
          fontSize: '0.8rem',
          fontWeight: 600,
          padding: '6px 14px',
          transition: 'all 0.3s ease',
          boxShadow: isActive ? '0 4px 15px rgba(255, 107, 129, 0.4)' : 'none',
        }}
        onClick={() => setIsActive(!isActive)}
        title={isActive ? 'Tắt hiệu ứng hoa anh đào' : 'Bật hiệu ứng hoa anh đào'}
      >
        <span>🌸</span>
        <span>{isActive ? 'Sakura FX: Bật' : 'Sakura FX: Tắt'}</span>
      </button>
    </>
  );
}
