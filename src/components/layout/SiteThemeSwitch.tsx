'use client';

import { useSyncExternalStore } from 'react';
import { StickmanThemeSwitch, type SwitchTheme } from '@/components/ui/StickmanThemeSwitch';

// The site theme lives on <html data-theme>. The inline script in app/layout.tsx sets
// it before first paint from localStorage ('nx-theme'); this reads and writes it.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}

const readTheme = (): SwitchTheme =>
  document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';

// The server can't know the visitor's theme.
const readServerTheme = (): SwitchTheme | null => null;

function saveTheme(theme: SwitchTheme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('nx-theme', theme);
}

export default function SiteThemeSwitch({ width }: { width: number }) {
  const theme = useSyncExternalStore(subscribe, readTheme, readServerTheme);

  if (theme === null) {
    // Server render and hydration: render both states and let CSS keyed on the
    // already-set data-theme show the right one, so the first paint is correct.
    // The stick figure is drawn by script, so it stays hidden until then.
    return (
      <>
        <span className="nx-theme-ssr nx-only-light">
          <StickmanThemeSwitch theme="light" width={width} className="nx-theme-switch" />
        </span>
        <span className="nx-theme-ssr nx-only-dark">
          <StickmanThemeSwitch theme="dark" width={width} className="nx-theme-switch" />
        </span>
      </>
    );
  }

  // The switch calls onThemeChange only when its little story ends (~2s).
  return <StickmanThemeSwitch theme={theme} onThemeChange={saveTheme} width={width} className="nx-theme-switch" />;
}
