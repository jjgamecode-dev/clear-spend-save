import React from 'react';
import { Page, MONTH_NAMES } from '../data/types';

const NAV_ITEMS: { id: Page; label: string; icon: React.ReactNode }[] = [
  {
    id: 'dashboard', label: 'Dashboard',
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor"/><rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".4"/><rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".4"/><rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".4"/></svg>,
  },
  {
    id: 'budget', label: 'Budget',
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="2" rx="1" fill="currentColor"/><rect x="1" y="7" width="9" height="2" rx="1" fill="currentColor" opacity=".6"/><rect x="1" y="11" width="11" height="2" rx="1" fill="currentColor" opacity=".4"/></svg>,
  },
  {
    id: 'expenses', label: 'Expenses',
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V4z" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M5 8h6M5 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  },
  {
    id: 'savings', label: 'Savings',
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  },
  {
    id: 'reports', label: 'Reports',
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 12l4-4 3 3 5-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    id: 'settings', label: 'Settings',
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M3.4 12.6l1.4-1.4M11.2 4.8l1.4-1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  },
];

interface Props {
  currentPage: Page;
  onNavigate: (p: Page) => void;
  selectedMonthIndex: number;
  onMonthChange: (i: number) => void;
  monthsData: { year: number; month: number }[];
  onAddExpense: () => void;
  children: React.ReactNode;
}

export default function Layout({ currentPage, onNavigate, selectedMonthIndex, onMonthChange, monthsData, onAddExpense, children }: Props) {
  const cur = monthsData[selectedMonthIndex];

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--background)' }}>

      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 shrink-0" style={{ background: 'var(--card)', borderRight: '1px solid var(--border)' }}>
        {/* Brand */}
        <div className="px-5 py-5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: 'var(--primary)' }}>
              M
            </div>
            <span className="font-semibold text-sm tracking-tight" style={{ color: 'var(--foreground)' }}>MoneyFlow</span>
          </div>
        </div>

        {/* Month selector */}
        <div className="px-3 pb-4">
          <div className="flex items-center justify-between px-2 py-2 rounded-xl" style={{ background: 'var(--muted)' }}>
            <button
              onClick={() => selectedMonthIndex > 0 && onMonthChange(selectedMonthIndex - 1)}
              disabled={selectedMonthIndex === 0}
              className="w-6 h-6 flex items-center justify-center rounded-lg text-sm transition-all disabled:opacity-30"
              style={{ color: 'var(--muted-foreground)' }}
            >‹</button>
            <span className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>
              {MONTH_NAMES[cur.month].slice(0, 3)} {cur.year}
            </span>
            <button
              onClick={() => selectedMonthIndex < monthsData.length - 1 && onMonthChange(selectedMonthIndex + 1)}
              disabled={selectedMonthIndex === monthsData.length - 1}
              className="w-6 h-6 flex items-center justify-center rounded-lg text-sm transition-all disabled:opacity-30"
              style={{ color: 'var(--muted-foreground)' }}
            >›</button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5">
          {NAV_ITEMS.map(({ id, label, icon }) => {
            const active = currentPage === id;
            return (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
                style={{
                  background: active ? '#EFF6FF' : 'transparent',
                  color: active ? 'var(--primary)' : 'var(--muted-foreground)',
                }}
                onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'var(--muted)'; (e.currentTarget as HTMLElement).style.color = 'var(--foreground)'; } }}
                onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--muted-foreground)'; } }}
              >
                <span className="shrink-0">{icon}</span>
                {label}
              </button>
            );
          })}
        </nav>

        {/* Add expense */}
        <div className="px-3 pb-4">
          <button
            onClick={onAddExpense}
            className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.9'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
          >
            + Add Expense
          </button>
        </div>

        {/* User */}
        <div className="px-3 pb-5 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
          <button
            onClick={() => onNavigate('settings')}
            className="w-full flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all"
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--muted)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
          >
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0" style={{ background: '#7C3AED' }}>
              AK
            </div>
            <div className="text-left min-w-0">
              <div className="text-xs font-semibold truncate" style={{ color: 'var(--foreground)' }}>Amara Kimani</div>
              <div className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>Settings</div>
            </div>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <header className="lg:hidden shrink-0 flex items-center justify-between px-4 py-3" style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: 'var(--primary)' }}>M</div>
            <span className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>MoneyFlow</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1.5 rounded-xl" style={{ background: 'var(--muted)' }}>
              <button onClick={() => selectedMonthIndex > 0 && onMonthChange(selectedMonthIndex - 1)} disabled={selectedMonthIndex === 0} className="px-1 text-sm disabled:opacity-30" style={{ color: 'var(--muted-foreground)' }}>‹</button>
              <span className="text-xs font-semibold px-1" style={{ color: 'var(--foreground)' }}>{MONTH_NAMES[cur.month].slice(0, 3)} {cur.year}</span>
              <button onClick={() => selectedMonthIndex < monthsData.length - 1 && onMonthChange(selectedMonthIndex + 1)} disabled={selectedMonthIndex === monthsData.length - 1} className="px-1 text-sm disabled:opacity-30" style={{ color: 'var(--muted-foreground)' }}>›</button>
            </div>
            <button onClick={onAddExpense} className="px-3 py-1.5 rounded-xl text-xs font-semibold" style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>+ Add</button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <nav className="lg:hidden shrink-0 flex" style={{ background: 'var(--card)', borderTop: '1px solid var(--border)' }}>
          {NAV_ITEMS.map(({ id, label, icon }) => {
            const active = currentPage === id;
            return (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                className="flex-1 flex flex-col items-center gap-1 py-2.5 text-xs font-medium transition-all"
                style={{ color: active ? 'var(--primary)' : 'var(--muted-foreground)' }}
              >
                <span>{icon}</span>
                <span style={{ fontSize: '10px' }}>{label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
