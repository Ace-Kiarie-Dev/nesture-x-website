'use client';

import { useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';

// Plain light/dark switch for the admin sidebar. Same storage as the site switch:
// <html data-theme> plus localStorage 'nx-theme' (read before first paint by app/layout.tsx).
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}
const readTheme = () => (document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
const readServerTheme = () => 'dark';

export default function AdminThemeToggle({ showLabel }: { showLabel: boolean }) {
  const theme = useSyncExternalStore(subscribe, readTheme, readServerTheme);
  const next = theme === 'light' ? 'dark' : 'light';

  function toggle() {
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('nx-theme', next); } catch { /* storage blocked */ }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="nxad-nav-item"
      aria-label={`Switch to ${next} theme`}
      title={showLabel ? undefined : `Switch to ${next} theme`}
    >
      {theme === 'light' ? <Moon size={18} aria-hidden /> : <Sun size={18} aria-hidden />}
      <span className="nxad-nav-label">{theme === 'light' ? 'Dark theme' : 'Light theme'}</span>
    </button>
  );
}
