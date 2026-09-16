import { useState, useMemo } from 'react';
import { Expense, EXPENSE_CATEGORIES, CATEGORY_COLORS, PAYMENT_METHODS } from '../data/types';
import { fmt } from '../utils/calculations';

interface Props {
  expenses: Expense[];
  year: number;
  month: number;
  onDelete: (id: string) => void;
  onUpdate: (e: Expense) => void;
  onAddExpense: () => void;
}

// Group expenses by display date label
function groupByDate(expenses: Expense[], year: number, month: number): { label: string; items: Expense[] }[] {
  const today = `${year}-${String(month + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;
  const yesterday = `${year}-${String(month + 1).padStart(2, '0')}-${String(new Date().getDate() - 1).padStart(2, '0')}`;

  const byDate: Record<string, Expense[]> = {};
  for (const e of expenses) {
    (byDate[e.date] ??= []).push(e);
  }

  return Object.entries(byDate)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, items]) => {
      let label = date;
      if (date === today) label = 'Today';
      else if (date === yesterday) label = 'Yesterday';
      else {
        const [, , day] = date.split('-');
        const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        label = `${MONTHS[month]} ${parseInt(day, 10)}`;
      }
      return { label, items };
    });
}

export default function Expenses({ expenses, year, month, onDelete, onUpdate, onAddExpense }: Props) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<Expense>>({});

  const filtered = useMemo(() => {
    return expenses.filter(e => {
      const matchSearch = search === '' || e.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = categoryFilter === 'All' || e.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [expenses, search, categoryFilter]);

  const total = filtered.reduce((s, e) => s + e.amount, 0);
  const groups = useMemo(() => groupByDate(filtered, year, month), [filtered, year, month]);

  const startEdit = (e: Expense) => { setEditingId(e.id); setEditDraft({ ...e }); };
  const saveEdit = () => {
    if (editingId && editDraft.description) {
      onUpdate(editDraft as Expense);
      setEditingId(null);
    }
  };

  return (
    <div className="page-content">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>Expenses</h1>
          <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            {filtered.length} transactions ·{' '}
            <span className="mono font-semibold" style={{ color: 'var(--foreground)' }}>{fmt(total)}</span>
            {' '}total
          </div>
        </div>
        <button
          onClick={onAddExpense}
          className="shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{ background: 'var(--primary)', color: 'white' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.9'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
        >
          + Add Expense
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <input
          type="text"
          placeholder="Search…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[140px] px-3 py-2 rounded-xl text-sm outline-none"
          style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
        />
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="px-3 py-2 rounded-xl text-sm outline-none"
          style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
        >
          <option>All</option>
          {EXPENSE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Empty state */}
      {expenses.length === 0 && (
        <div className="text-center py-16">
          <div className="text-3xl mb-3">📋</div>
          <div className="text-base font-semibold mb-2" style={{ color: 'var(--foreground)' }}>No expenses yet</div>
          <div className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>Start tracking where your money goes.</div>
          <button onClick={onAddExpense} className="px-5 py-2.5 rounded-xl text-sm font-semibold" style={{ background: 'var(--primary)', color: 'white' }}>
            Add expense
          </button>
        </div>
      )}

      {/* No search results */}
      {expenses.length > 0 && filtered.length === 0 && (
        <div className="text-center py-12 text-sm" style={{ color: 'var(--muted-foreground)' }}>
          No expenses match your filters.
        </div>
      )}

      {/* Date-grouped list */}
      {groups.map(group => (
        <div key={group.label} className="mb-6">
          <div
            className="text-xs font-semibold uppercase tracking-wider mb-3"
            style={{ color: 'var(--muted-foreground)' }}
          >
            {group.label}
          </div>
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            {group.items.map((e, i) =>
              editingId === e.id ? (
                /* Edit form */
                <div key={e.id} className="p-4 space-y-3" style={{ background: '#F0F6FF', borderBottom: i < group.items.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium block mb-1" style={{ color: 'var(--muted-foreground)' }}>Description</label>
                      <input
                        value={editDraft.description ?? ''}
                        onChange={ev => setEditDraft(d => ({ ...d, description: ev.target.value }))}
                        className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                        style={{ border: '1px solid var(--primary)', background: 'white', color: 'var(--foreground)' }}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium block mb-1" style={{ color: 'var(--muted-foreground)' }}>Amount (KES)</label>
                      <input
                        type="number"
                        value={editDraft.amount ?? ''}
                        onChange={ev => setEditDraft(d => ({ ...d, amount: parseFloat(ev.target.value) || 0 }))}
                        className="w-full px-3 py-2 rounded-xl text-sm text-right outline-none mono"
                        style={{ border: '1px solid var(--primary)', background: 'white', color: 'var(--foreground)' }}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium block mb-1" style={{ color: 'var(--muted-foreground)' }}>Category</label>
                      <select
                        value={editDraft.category ?? ''}
                        onChange={ev => setEditDraft(d => ({ ...d, category: ev.target.value }))}
                        className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                        style={{ border: '1px solid var(--primary)', background: 'white', color: 'var(--foreground)' }}
                      >
                        {EXPENSE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium block mb-1" style={{ color: 'var(--muted-foreground)' }}>Payment method</label>
                      <select
                        value={editDraft.paymentMethod ?? ''}
                        onChange={ev => setEditDraft(d => ({ ...d, paymentMethod: ev.target.value }))}
                        className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                        style={{ border: '1px solid var(--primary)', background: 'white', color: 'var(--foreground)' }}
                      >
                        {PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingId(null)} className="flex-1 py-2 rounded-xl text-sm font-semibold" style={{ background: 'var(--muted)', color: 'var(--foreground)' }}>Cancel</button>
                    <button onClick={saveEdit} className="flex-1 py-2 rounded-xl text-sm font-semibold" style={{ background: 'var(--primary)', color: 'white' }}>Save</button>
                  </div>
                </div>
              ) : (
                /* Expense row */
                <div
                  key={e.id}
                  className="flex items-center justify-between px-4 py-3.5 gap-3 transition-all group"
                  style={{ borderBottom: i < group.items.length - 1 ? '1px solid var(--border)' : 'none' }}
                  onMouseEnter={el => (el.currentTarget as HTMLElement).style.background = 'var(--secondary)'}
                  onMouseLeave={el => (el.currentTarget as HTMLElement).style.background = ''}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ background: CATEGORY_COLORS[e.category] ?? '#94A3B8' }}
                    >
                      {e.category[0]}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate" style={{ color: 'var(--foreground)' }}>{e.description}</div>
                      <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        <span className="inline-block px-1.5 py-0.5 rounded-md text-xs mr-1.5" style={{ background: `${CATEGORY_COLORS[e.category] ?? '#94A3B8'}18`, color: CATEGORY_COLORS[e.category] ?? '#94A3B8' }}>
                          {e.category}
                        </span>
                        {e.paymentMethod}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-semibold mono" style={{ color: 'var(--foreground)' }}>{fmt(e.amount)}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        onClick={() => startEdit(e)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all"
                        style={{ color: 'var(--muted-foreground)' }}
                        onMouseEnter={el => (el.currentTarget as HTMLElement).style.background = 'var(--muted)'}
                        onMouseLeave={el => (el.currentTarget as HTMLElement).style.background = 'transparent'}
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => onDelete(e.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all"
                        style={{ color: '#EF4444' }}
                        onMouseEnter={el => (el.currentTarget as HTMLElement).style.background = '#FEF2F2'}
                        onMouseLeave={el => (el.currentTarget as HTMLElement).style.background = 'transparent'}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
