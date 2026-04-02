'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const safeCtx = ctx;

    let W = 0;
    let H = 0;
    let animFrameId: number;
    const particles: Particle[] = [];

    const handleResize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };

    function initParticles() {
      particles.length = 0;
      for (let i = 0; i < 80; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 1.5 + 0.5,
          alpha: Math.random() * 0.4 + 0.1,
        });
      }
    }

    function animate() {
      safeCtx.clearRect(0, 0, W, H);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        safeCtx.beginPath();
        safeCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        safeCtx.fillStyle = `rgba(26,111,212,${p.alpha})`;
        safeCtx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - particles[i].x;
          const dy = particles[j].y - particles[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            safeCtx.beginPath();
            safeCtx.moveTo(particles[i].x, particles[i].y);
            safeCtx.lineTo(particles[j].x, particles[j].y);
            safeCtx.strokeStyle = `rgba(26,111,212,${0.08 * (1 - dist / 120)})`;
            safeCtx.lineWidth = 0.5;
            safeCtx.stroke();
          }
        }
      }

      animFrameId = requestAnimationFrame(animate);
    }

    handleResize();
    initParticles();
    animate();

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
