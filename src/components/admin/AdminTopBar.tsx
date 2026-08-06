'use client';

import { useRouter } from 'next/navigation';
import { FileText, Receipt, CalendarDays, Inbox, Rocket, LogOut, type LucideIcon } from 'lucide-react';

export type AdminTab = 'quotes' | 'invoices' | 'bookings' | 'leads' | 'launch-list';

interface Tab {
  key:   AdminTab;
  label: string;
  href:  string;
  icon:  LucideIcon;
}

const TABS: Tab[] = [
  { key: 'quotes',      label: 'Quotes',      href: '/admin/quotes',      icon: FileText },
  { key: 'invoices',    label: 'Invoices',    href: '/admin/invoices',    icon: Receipt },
  { key: 'bookings',    label: 'Bookings',    href: '/admin/bookings',    icon: CalendarDays },
  { key: 'leads',       label: 'Leads',       href: '/admin/leads',       icon: Inbox },
  { key: 'launch-list', label: 'Launch List', href: '/admin/launch-list', icon: Rocket },
];

interface AdminTopBarProps {
  active:   AdminTab;
  actions?: React.ReactNode;
}

export default function AdminTopBar({ active, actions }: AdminTopBarProps) {
  const router = useRouter();

  async function logout() {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.replace('/admin');
  }

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(26,111,212,0.15)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 2rem', height: '60px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--color-text)', letterSpacing: '0.05em' }}>
          NX ADMIN
        </span>
        <span style={{ width: '1px', height: '18px', background: 'rgba(26,111,212,0.3)' }} />
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
          {TABS.map(tab => {
            const Icon     = tab.icon;
            const isActive = tab.key === active;
            return (
              <button
                key={tab.key}
                onClick={() => !isActive && router.push(tab.href)}
                style={{
                  background:    'transparent',
                  border:        'none',
                  borderBottom:  isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                  cursor:        isActive ? 'default' : 'pointer',
                  display:       'flex', alignItems: 'center', gap: '0.4rem',
                  fontFamily:    'var(--font-mono)', fontSize: '0.6rem',
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color:         isActive ? 'var(--color-primary)' : 'rgba(255,255,255,0.4)',
                  padding:       '0.4rem 0.6rem',
                  height:        '100%',
                  transition:    'color 0.18s',
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)'; }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)'; }}
              >
                <Icon size={13} /> {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {actions}
        <button
          onClick={logout}
          style={{
            background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)',
            fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
            letterSpacing: '0.12em', textTransform: 'uppercase',
            padding: '0.4rem 0.6rem', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'color 0.18s',
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.3)')}
        >
          <LogOut size={12} /> Logout
        </button>
      </div>
    </div>
  );
}
