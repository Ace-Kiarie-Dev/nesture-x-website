'use client';

import { useRouter } from 'next/navigation';
import { FileText, Receipt, CalendarDays, Inbox, Rocket, Settings, type LucideIcon } from 'lucide-react';
import AdminFrame from './AdminFrame';

export type AdminTab = 'quotes' | 'invoices' | 'bookings' | 'leads' | 'launch-list' | 'settings';

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
  { key: 'settings',    label: 'Settings',    href: '/admin/settings',    icon: Settings },
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
    <AdminFrame
      tabs={TABS}
      active={active}
      actions={actions}
      onNavigate={tab => { if (tab.key !== active) router.push(tab.href); }}
      onLogout={logout}
    />
  );
}
