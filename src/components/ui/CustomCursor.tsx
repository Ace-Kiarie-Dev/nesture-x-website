'use client';

import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [ringPos, setRingPos] = useState({ x: -100, y: -100 });
  const [ringScale, setRingScale] = useState(1);
  const [ringOpacity, setRingOpacity] = useState('rgba(26,111,212,0.5)');

  useEffect(() => {
    let ringTimer: ReturnType<typeof setTimeout>;

    const onMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      clearTimeout(ringTimer);
      ringTimer = setTimeout(() => {
        setRingPos({ x: e.clientX, y: e.clientY });
      }, 60);
    };

    const onEnter = () => {
      setRingScale(1.8);
      setRingOpacity('rgba(26,111,212,0.8)');
    };

    const onLeave = () => {
      setRingScale(1);
      setRingOpacity('rgba(26,111,212,0.5)');
    };

    const attachListeners = () => {
      document.querySelectorAll('a, button, [data-hover]').forEach(el => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };

    window.addEventListener('mousemove', onMouseMove);
    attachListeners();

    const observer = new MutationObserver(attachListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      clearTimeout(ringTimer);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div
        style={{
          position: 'fixed',
          left: cursorPos.x,
          top: cursorPos.y,
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#1a6fd4',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      />
      <div
        style={{
          position: 'fixed',
          left: ringPos.x,
          top: ringPos.y,
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          border: `1px solid ${ringOpacity}`,
          transform: `translate(-50%, -50%) scale(${ringScale})`,
          pointerEvents: 'none',
          zIndex: 9998,
          transition: 'transform 0.2s ease, border-color 0.2s ease',
        }}
      />
    </>
  );
}
