import { useState } from 'react';
import { MonthData, IncomeSource, CATEGORY_COLORS } from '../data/types';
import { getMonthSummary, getCategoryTotals, fmt } from '../utils/calculations';

interface Props {
  month: MonthData;
  onUpdateBudget: (category: string, amount: number) => void;
  onUpdateIncomes: (incomes: IncomeSource[]) => void;
}

function InlineEdit({ value, onSave }: { value: number; onSave: (v: number) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');

  if (editing) {
    return (
      <input
        autoFocus
        type="number"
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={() => { const n = parseFloat(draft); if (!isNaN(n) && n >= 0) onSave(n); setEditing(false); }}
        onKeyDown={e => {
          if (e.key === 'Enter') { const n = parseFloat(draft); if (!isNaN(n) && n >= 0) onSave(n); setEditing(false); }
          if (e.key === 'Escape') setEditing(false);
        }}
        className="w-28 text-right px-2 py-1 rounded-lg text-sm outline-none mono"
        style={{ background: 'var(--muted)', border: '1px solid var(--primary)', color: 'var(--foreground)' }}
      />
    );
  }
  return (
    <button
      onClick={() => { setDraft(String(value)); setEditing(true); }}
      className="text-sm font-medium mono px-2 py-1 rounded-lg transition-all"
      style={{ color: 'var(--foreground)' }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--muted)'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
      title="Click to edit"
    >
      {value.toLocaleString()}
    </button>
  );
}

export default function Budget({ month, onUpdateBudget, onUpdateIncomes }: Props) {
  const summary = getMonthSummary(month);
  const categoryTotals = getCategoryTotals(month);
  const totalBudgeted = month.budgets.reduce((s, b) => s + b.budget, 0);

  return (
    <div className="page-content">
      <div className="mb-8">
        <h1 className="text-xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>Monthly Budget</h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>What did you plan, and how are you doing?</p>
      </div>

      {/* Income */}
      <div className="mb-8">
        <h2 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--muted-foreground)' }}>Income</h2>
        {month.incomes.map(inc => (
          <div key={inc.id} className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{inc.name}</span>
            <InlineEdit
              value={inc.amount}
              onSave={v => onUpdateIncomes(month.incomes.map(i => i.id === inc.id ? { ...i, amount: v } : i))}
            />
          </div>
        ))}
        <div className="flex items-center justify-between py-3">
          <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Total income</span>
          <span className="text-sm font-bold mono" style={{ color: 'var(--income)' }}>{fmt(summary.totalIncome)}</span>
        </div>
      </div>

      {/* Overview bar */}
      <div className="rounded-2xl p-5 mb-8" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="grid grid-cols-3 gap-4 mb-4 text-center">
          {[
            { label: 'Planned', value: totalBudgeted, color: 'var(--foreground)' },
            { label: 'Spent', value: summary.totalExpenses, color: 'var(--expense)' },
            { label: 'Remaining', value: totalBudgeted - summary.totalExpenses, color: totalBudgeted - summary.totalExpenses >= 0 ? 'var(--savings)' : 'var(--expense)' },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <div className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>{label}</div>
              <div className="text-base font-bold mono" style={{ color }}>{fmt(value, true)}</div>
            </div>
          ))}
        </div>
        <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${Math.min((summary.totalExpenses / Math.max(totalBudgeted, 1)) * 100, 100)}%`,
              background: summary.totalExpenses > totalBudgeted ? 'var(--expense)' : 'var(--income)',
            }}
          />
        </div>
      </div>

      {/* Category list */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>Categories</h2>
          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Click budget to edit</span>
        </div>

        <div className="space-y-5">
          {month.budgets.map(b => {
            const actual = categoryTotals[b.category] ?? 0;
            const remaining = b.budget - actual;
            const pct = b.budget > 0 ? Math.min((actual / b.budget) * 100, 100) : 0;
            const over = actual > b.budget;
            const color = CATEGORY_COLORS[b.category] ?? 'var(--category-other)';

            return (
              <div key={b.category}>
                {/* Header row */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                    <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{b.category}</span>
                    {over && (
                      <span className="rounded-full bg-[var(--danger-soft)] px-2 py-0.5 text-xs font-medium text-destructive">
                        Over
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span style={{ color: 'var(--muted-foreground)' }}>
                      Spent <span className="mono font-medium" style={{ color: over ? 'var(--expense)' : 'var(--foreground)' }}>{actual.toLocaleString()}</span>
                    </span>
                    <span style={{ color: 'var(--muted-foreground)' }}>
                      {remaining >= 0 ? 'Left' : 'Over'}{' '}
                      <span className="mono font-medium" style={{ color: remaining >= 0 ? 'var(--savings)' : 'var(--expense)' }}>
                        {Math.abs(remaining).toLocaleString()}
                      </span>
                    </span>
                    <div>
                      <InlineEdit value={b.budget} onSave={v => onUpdateBudget(b.category, v)} />
                    </div>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, background: over ? 'var(--expense)' : color }}
                  />
                </div>
                {/* Mobile: stacked stats */}
                <div className="flex justify-between mt-1.5 text-xs md:hidden" style={{ color: 'var(--muted-foreground)' }}>
                  <span>Budget: <span className="mono">{b.budget.toLocaleString()}</span></span>
                  <span>{pct.toFixed(0)}% used</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Savings */}
      {month.savingsContributions.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--muted-foreground)' }}>Savings</h2>
          {month.savingsContributions.map((c, i) => (
            <div key={i} className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid var(--border)' }}>
              <span className="text-sm" style={{ color: 'var(--foreground)' }}>Savings contribution</span>
              <span className="text-sm font-semibold mono" style={{ color: 'var(--savings)' }}>{fmt(c.amount)}</span>
            </div>
          ))}
          <div className="flex items-center justify-between py-3">
            <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Total saved</span>
            <span className="text-sm font-bold mono" style={{ color: 'var(--savings)' }}>{fmt(summary.totalSavings)}</span>
          </div>
        </div>
      )}

      {/* Summary footer */}
      <div className="pt-6" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Income', value: summary.totalIncome, color: 'var(--income)' },
            { label: 'Expenses', value: summary.totalExpenses, color: 'var(--expense)' },
            { label: 'Savings', value: summary.totalSavings, color: 'var(--savings)' },
            { label: 'Available', value: summary.available, color: 'var(--available)' },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <div className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>{label}</div>
              <div className="text-lg font-bold mono" style={{ color }}>{fmt(value, true)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
