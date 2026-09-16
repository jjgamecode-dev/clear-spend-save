import { useState } from 'react';
import { Expense, EXPENSE_CATEGORIES, PAYMENT_METHODS } from '../data/types';

interface Props {
  currentDate: string;
  onAdd: (e: Expense) => void;
  onClose: () => void;
}

const uid = () => Math.random().toString(36).slice(2, 10);

export default function AddExpenseModal({ currentDate, onAdd, onClose }: Props) {
  const [form, setForm] = useState({
    date: currentDate,
    description: '',
    category: 'Food',
    amount: '',
    paymentMethod: 'M-Pesa',
    notes: '',
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(form.amount);
    if (!form.description || isNaN(amount) || amount <= 0) return;
    onAdd({
      id: uid(),
      date: form.date,
      description: form.description,
      category: form.category,
      amount,
      paymentMethod: form.paymentMethod,
      notes: form.notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div
        className="w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl p-6 space-y-4"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-base" style={{ color: 'var(--foreground)' }}>Add Expense</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all"
            style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Amount — prominent */}
          <div className="rounded-2xl p-4 text-center" style={{ background: 'var(--muted)' }}>
            <div className="text-xs font-medium mb-2" style={{ color: 'var(--muted-foreground)' }}>Amount (KES)</div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl font-semibold" style={{ color: 'var(--muted-foreground)' }}>KES</span>
              <input
                autoFocus
                type="number"
                step="any"
                value={form.amount}
                onChange={e => set('amount', e.target.value)}
                placeholder="0"
                required
                className="w-36 text-center text-3xl font-bold outline-none bg-transparent"
                style={{ fontFamily: 'var(--font-mono-data)', color: 'var(--foreground)' }}
              />
            </div>
          </div>

          <input
            type="text"
            placeholder="Description"
            value={form.description}
            onChange={e => set('description', e.target.value)}
            required
            className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: 'var(--muted-foreground)' }}>Category</label>
              <select value={form.category} onChange={e => set('category', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }}>
                {EXPENSE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: 'var(--muted-foreground)' }}>Payment method</label>
              <select value={form.paymentMethod} onChange={e => set('paymentMethod', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }}>
                {PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: 'var(--muted-foreground)' }}>Date</label>
              <input type="date" value={form.date} onChange={e => set('date', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }} />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: 'var(--muted-foreground)' }}>Notes (optional)</label>
              <input type="text" value={form.notes} onChange={e => set('notes', e.target.value)}
                placeholder="e.g. business lunch"
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }} />
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{ background: 'var(--muted)', color: 'var(--foreground)' }}>
              Cancel
            </button>
            <button type="submit"
              className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
