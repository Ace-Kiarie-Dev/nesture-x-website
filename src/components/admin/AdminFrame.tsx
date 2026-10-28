'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { LogOut, Menu, PanelLeftClose, PanelLeftOpen, X, type LucideIcon } from 'lucide-react';
import { cx } from '@/components/redesign/cx';
import AdminThemeToggle from './AdminThemeToggle';

export interface AdminFrameTab {
  key:   string;
  label: string;
  href:  string;
  icon:  LucideIcon;
}

interface AdminFrameProps {
  tabs:       AdminFrameTab[];
  active:     string;
  actions?:   ReactNode;
  onNavigate: (tab: AdminFrameTab) => void;
  onLogout:   () => void;
}

const COLLAPSE_KEY = 'nxad-sidebar-collapsed';

// The admin app frame: sidebar from 1024px (collapsible to icons), top bar with the
// page title and quick actions, and on smaller screens a menu button that opens the
// same items in a modal drawer (<dialog>: Esc closes, focus stays inside).
// Purely presentational: navigation and logout come from AdminTopBar unchanged.
// Styles: components/admin/admin.css.
export default function AdminFrame({ tabs, active, actions, onNavigate, onLogout }: AdminFrameProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of a per-browser preference
      if (localStorage.getItem(COLLAPSE_KEY) === '1') setCollapsed(true);
    } catch { /* storage blocked: stay expanded */ }
  }, []);

  function toggleCollapsed() {
    setCollapsed((c) => {
      try { localStorage.setItem(COLLAPSE_KEY, c ? '0' : '1'); } catch { /* ignore */ }
      return !c;
    });
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    if (!open && wasOpen.current) menuRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  // A modal dialog still lets Tab reach the browser's own UI; keep it cycling inside.
  const trapTab = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key !== 'Tab') return;
    const items = [...e.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')];
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  const title = tabs.find((t) => t.key === active)?.label ?? 'Admin';

  const navItems = (inDrawer: boolean) => (
    <ul className="nxad-nav">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.key === active;
        return (
          <li key={tab.key}>
            <button
              type="button"
              onClick={() => { if (inDrawer) setOpen(false); onNavigate(tab); }}
              className={cx('nxad-nav-item', isActive && 'is-active')}
              aria-current={isActive ? 'page' : undefined}
              title={collapsed && !inDrawer ? tab.label : undefined}
            >
              <Icon size={18} aria-hidden />
              <span className="nxad-nav-label">{tab.label}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );

  const footer = (inDrawer: boolean) => (
    <div className="nxad-side-foot">
      <AdminThemeToggle showLabel={inDrawer || !collapsed} />
      {!inDrawer && (
        <button type="button" onClick={toggleCollapsed} className="nxad-nav-item" aria-pressed={collapsed} title={collapsed ? 'Expand sidebar' : undefined}>
          {collapsed ? <PanelLeftOpen size={18} aria-hidden /> : <PanelLeftClose size={18} aria-hidden />}
          <span className="nxad-nav-label">{collapsed ? 'Expand' : 'Collapse'}</span>
        </button>
      )}
      <button type="button" onClick={onLogout} className="nxad-nav-item nxad-nav-item--danger" title={collapsed && !inDrawer ? 'Logout' : undefined}>
        <LogOut size={18} aria-hidden />
        <span className="nxad-nav-label">Logout</span>
      </button>
    </div>
  );

  return (
    <div className={cx('nxad-shell', collapsed && 'is-collapsed')}>
      <a href="#nxad-main" className="nxad-skip">Skip to content</a>

      <aside className="nxad-side" aria-label="Admin">
        <div className="nxad-brand">
          <span className="nx-logo">
            <span className="nxad-brand-full">NESTURE<span>-X</span></span>
            <span className="nxad-brand-short">N<span>X</span></span>
          </span>
          <span className="nxad-brand-tag">ADMIN</span>
        </div>
        <nav aria-label="Admin sections">{navItems(false)}</nav>
        {footer(false)}
      </aside>

      <header className="nxad-top">
        <button
          ref={menuRef}
          type="button"
          className="nxad-icon-btn nxad-menu-btn"
          aria-label="Open admin menu"
          aria-expanded={open}
          aria-controls="nxad-drawer"
          onClick={() => setOpen(true)}
        >
          <Menu size={20} aria-hidden />
        </button>
        <p className="nxad-top-title">{title}</p>
        {actions && <div className="nxad-top-actions">{actions}</div>}
      </header>

      <dialog
        id="nxad-drawer"
        ref={dialogRef}
        className="nxad-drawer"
        aria-label="Admin menu"
        onClose={() => setOpen(false)}
        onKeyDown={trapTab}
        onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
      >
        <div className="nxad-drawer-inner">
          <div className="nxad-drawer-head">
            <span className="nx-logo">NESTURE<span>-X</span></span>
            <button type="button" className="nxad-icon-btn" aria-label="Close menu" onClick={() => setOpen(false)}>
              <X size={20} aria-hidden />
            </button>
          </div>
          <nav aria-label="Admin sections">{navItems(true)}</nav>
          {footer(true)}
        </div>
      </dialog>
    </div>
  );
}
