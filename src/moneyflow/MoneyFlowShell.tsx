import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { BarChart3, CircleDollarSign, Goal, LayoutDashboard, Plus, ReceiptText, Settings } from "lucide-react";
import { useMoneyFlow } from "./MoneyFlowProvider";
import { MONTH_NAMES } from "./data/types";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/budget", label: "Budget", icon: CircleDollarSign },
  { to: "/expenses", label: "Expenses", icon: ReceiptText },
  { to: "/savings", label: "Savings", icon: Goal },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function MoneyFlowShell() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { month, monthIndex, monthsData, setMonthIndex, openExpenseForm } = useMoneyFlow();

  return (
    <div className="flex min-h-dvh bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col border-r border-border bg-card lg:flex">
        <div className="flex h-20 items-center gap-3 px-6">
          <div className="grid size-9 place-items-center rounded-lg bg-primary font-bold text-primary-foreground">M</div>
          <div className="text-[15px] font-bold">MoneyFlow</div>
        </div>
        <MonthPicker />
        <nav className="flex-1 space-y-1 px-3 py-5" aria-label="Main navigation">
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
            return (
              <Link key={to} to={to} className={`flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition-colors ${active ? "bg-primary-soft text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                <Icon className="size-4" strokeWidth={1.8} />{label}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 pb-4">
          <button onClick={openExpenseForm} className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90">
            <Plus className="size-4" /> Add Expense
          </button>
        </div>
        <div className="border-t border-border p-4">
          <Link to="/settings" className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted">
            <div className="grid size-9 place-items-center rounded-full bg-avatar text-xs font-bold text-avatar-foreground">AK</div>
            <div className="min-w-0"><div className="truncate text-xs font-bold">Amara Kimani</div><div className="text-xs text-muted-foreground">Settings</div></div>
          </Link>
        </div>
      </aside>

      <div className="flex min-h-dvh min-w-0 flex-1 flex-col lg:pl-60">
        <header className="sticky top-0 z-10 grid h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-card px-4 lg:hidden">
          <div className="flex min-w-0 items-center gap-2"><div className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">M</div><span className="truncate text-sm font-bold">MoneyFlow</span></div>
          <div className="flex shrink-0 items-center gap-2">
            <div className="flex h-9 items-center rounded-lg bg-muted px-1">
              <button aria-label="Previous month" className="size-8 text-muted-foreground disabled:opacity-30" disabled={monthIndex === 0} onClick={() => setMonthIndex(monthIndex - 1)}>‹</button>
              <span className="px-1 text-xs font-bold">{MONTH_NAMES[month.month]?.slice(0, 3)} {month.year}</span>
              <button aria-label="Next month" className="size-8 text-muted-foreground disabled:opacity-30" disabled={monthIndex === monthsData.length - 1} onClick={() => setMonthIndex(monthIndex + 1)}>›</button>
            </div>
            <button aria-label="Add expense" onClick={openExpenseForm} className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground"><Plus className="size-4" /></button>
          </div>
        </header>
        <main className="min-h-0 flex-1 pb-20 lg:pb-0"><Outlet /></main>
        <nav className="fixed inset-x-0 bottom-0 z-20 grid h-[4.5rem] grid-cols-6 border-t border-border bg-card lg:hidden" aria-label="Mobile navigation">
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
            return <Link key={to} to={to} className={`flex min-w-0 flex-col items-center justify-center gap-1 text-[10px] font-semibold ${active ? "text-primary" : "text-muted-foreground"}`}><Icon className="size-[18px]" /><span className="max-w-full truncate">{label}</span></Link>;
          })}
        </nav>
      </div>
    </div>
  );
}

function MonthPicker() {
  const { month, monthIndex, monthsData, setMonthIndex } = useMoneyFlow();
  return <div className="mx-4 grid grid-cols-[2rem_minmax(0,1fr)_2rem] items-center rounded-lg bg-muted p-1"><button aria-label="Previous month" disabled={monthIndex === 0} onClick={() => setMonthIndex(monthIndex - 1)} className="size-8 text-muted-foreground disabled:opacity-30">‹</button><span className="truncate text-center text-xs font-bold">{MONTH_NAMES[month.month]} {month.year}</span><button aria-label="Next month" disabled={monthIndex === monthsData.length - 1} onClick={() => setMonthIndex(monthIndex + 1)} className="size-8 text-muted-foreground disabled:opacity-30">›</button></div>;
}