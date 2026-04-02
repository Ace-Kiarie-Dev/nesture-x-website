'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
}

const TYPED_PHRASES = [
  'for tourism brands',
  'for fitness coaches',
  'for logistics companies',
  'end-to-end, M-Pesa included',
  'for the Nairobi hustle',
];

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [typedText, setTypedText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Canvas particle system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: Particle[] = [];

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function init() {
      if (!canvas) return;
      particles.length = 0;
      for (let i = 0; i < 80; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          radius: Math.random() * 1.5 + 0.5,
          alpha: Math.random() * 0.4 + 0.1,
        });
      }
    }

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        if (p.x > canvas.width) { p.x = canvas.width; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        if (p.y > canvas.height) { p.y = canvas.height; p.vy *= -1; }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(26,111,212,${p.alpha})`;
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const opacity = 0.06 * (1 - dist / 120);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(26,111,212,${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    init();
    draw();

    const onResize = () => { resize(); init(); };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // Typed text effect
  useEffect(() => {
    const phrase = TYPED_PHRASES[phraseIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (typedText.length < phrase.length) {
        timeout = setTimeout(() => {
          setTypedText(phrase.slice(0, typedText.length + 1));
        }, 70);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 1800);
      }
    } else {
      if (typedText.length > 0) {
        timeout = setTimeout(() => {
          setTypedText(typedText.slice(0, -1));
        }, 40);
      } else {
        setIsDeleting(false);
        setPhraseIndex((phraseIndex + 1) % TYPED_PHRASES.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, phraseIndex]);

  const headlineLines = [
    { text: 'CREATE.', outline: false },
    { text: 'DISCOVER.', outline: true },
    { text: 'EXPLORE.', outline: false },
  ];

  const stats = [
    { number: '11+', label: 'Clients Served' },
    { number: '5', label: 'Equity Partners' },
    { number: '100%', label: 'Full-Stack Capable' },
  ];

  return (
    <section
      style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        padding: '0 3rem',
        background: '#0a0a0a',
      }}
    >
      {/* z-0: Canvas particle field */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      />

      {/* z-1: Grid overlay */}
      <div
        className="grid-overlay"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
        }}
      />

      {/* z-2: Hero content */}
      <div style={{ position: 'relative', zIndex: 2, maxWidth: '700px' }}>
        {/* Eyebrow */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '2rem',
          }}
        >
          <span
            style={{
              display: 'block',
              width: '24px',
              height: '1px',
              background: '#1a6fd4',
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '0.72rem',
              color: '#1a6fd4',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            Nairobi · Kenya · Est. 2024
          </span>
        </div>

        {/* Headline */}
        <h1 style={{ margin: 0, lineHeight: 0.92 }}>
          {headlineLines.map((line, i) => (
            <motion.span
              key={line.text}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.1 + 0.1, ease: 'easeOut' }}
              style={{
                display: 'block',
                fontFamily: 'var(--font-bebas), sans-serif',
                fontSize: 'clamp(5rem, 12vw, 11rem)',
                lineHeight: 0.92,
                color: line.outline ? 'transparent' : '#f5f5f5',
                WebkitTextStroke: line.outline ? '1px #1a6fd4' : undefined,
              }}
            >
              {line.text}
            </motion.span>
          ))}
        </h1>

        {/* Subheading with typed text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          style={{
            marginTop: '2rem',
            borderLeft: '2px solid #1a6fd4',
            paddingLeft: '1rem',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-grotesk), sans-serif',
              fontWeight: 300,
              fontSize: '1.05rem',
              color: 'rgba(245,245,245,0.65)',
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            We don&apos;t make products. We build solutions —{' '}
            <span style={{ color: 'rgba(245,245,245,0.65)' }}>{typedText}</span>
            <span
              style={{
                display: 'inline-block',
                width: '3px',
                height: '1em',
                background: '#1a6fd4',
                verticalAlign: 'middle',
                marginLeft: '2px',
                animation: 'blink 0.8s infinite',
              }}
            />
          </p>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', flexWrap: 'wrap' }}
        >
          <Link href="#contact" style={{ textDecoration: 'none' }}>
            <button
              data-hover
              style={{
                padding: '0.85rem 2rem',
                fontFamily: 'var(--font-grotesk), sans-serif',
                fontWeight: 600,
                fontSize: '0.78rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#f5f5f5',
                background: '#1a6fd4',
                border: 'none',
                clipPath: 'polygon(12px 0%,100% 0%,100% calc(100% - 12px),calc(100% - 12px) 100%,0% 100%,0% 12px)',
                cursor: 'pointer',
              }}
            >
              Book a Consultation
            </button>
          </Link>
          <Link href="#portfolio" style={{ textDecoration: 'none' }}>
            <button
              data-hover
              style={{
                padding: '0.85rem 2rem',
                fontFamily: 'var(--font-grotesk), sans-serif',
                fontWeight: 600,
                fontSize: '0.78rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#f5f5f5',
                background: 'transparent',
                border: '1px solid rgba(245,245,245,0.2)',
                cursor: 'pointer',
                transition: 'border-color 0.3s, color 0.3s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = '#1a6fd4';
                (e.currentTarget as HTMLElement).style.color = '#1a6fd4';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,245,245,0.2)';
                (e.currentTarget as HTMLElement).style.color = '#f5f5f5';
              }}
            >
              View Our Work
            </button>
          </Link>
        </motion.div>
      </div>

      {/* z-2: Stats strip (absolute right) */}
      <div
        style={{
          position: 'absolute',
          right: '3rem',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: '2.5rem',
          textAlign: 'right',
        }}
      >
        {stats.map(stat => (
          <div key={stat.label}>
            <div
              style={{
                fontFamily: 'var(--font-bebas), sans-serif',
                fontSize: '2.8rem',
                color: '#1a6fd4',
                lineHeight: 1,
              }}
            >
              {stat.number}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '0.6rem',
                color: 'rgba(245,245,245,0.4)',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                marginTop: '0.3rem',
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Scroll hint */}
      <div
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: '3rem',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '0.65rem',
            color: 'rgba(245,245,245,0.35)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          Scroll to explore
        </span>
        <div
          style={{
            width: '40px',
            height: '1px',
            background: 'rgba(26,111,212,0.2)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: '#1a6fd4',
              animation: 'scrollLine 2s infinite',
            }}
          />
        </div>
      </div>
    </section>
  );
}
