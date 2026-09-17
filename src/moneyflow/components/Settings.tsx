import { useState } from 'react';
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from '../data/types';

export default function Settings() {
  const [categories, setCategories] = useState<string[]>([...EXPENSE_CATEGORIES]);
  const [methods, setMethods] = useState([...PAYMENT_METHODS]);
  const [newCat, setNewCat] = useState('');
  const [newMethod, setNewMethod] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="page-content max-w-2xl">
      <div className="mb-8">
        <h1 className="text-xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>Settings</h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Manage your profile and preferences.</p>
      </div>

      {/* Profile */}
      <section className="mb-10">
        <h2 className="text-xs font-semibold uppercase tracking-wider mb-5" style={{ color: 'var(--muted-foreground)' }}>Profile</h2>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold shrink-0" style={{ background: 'var(--avatar)', color: 'var(--avatar-foreground)' }}>
            AK
          </div>
          <div>
            <div className="font-semibold" style={{ color: 'var(--foreground)' }}>Amara Kimani</div>
            <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Senior Software Engineer · Nairobi</div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Full name', value: 'Amara Kimani' },
            { label: 'Job title', value: 'Senior Software Engineer' },
            { label: 'Email', value: 'amara@nairobitech.co.ke' },
            { label: 'Location', value: 'Nairobi, Kenya' },
          ].map(({ label, value }) => (
            <div key={label}>
              <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--muted-foreground)' }}>{label}</label>
              <input
                defaultValue={value}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
                style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                onFocus={e => (e.target as HTMLElement).style.borderColor = 'var(--primary)'}
                onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--border)'}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Currency */}
      <section className="mb-10" style={{ borderTop: '1px solid var(--border)', paddingTop: '32px' }}>
        <h2 className="text-xs font-semibold uppercase tracking-wider mb-5" style={{ color: 'var(--muted-foreground)' }}>Currency</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Currency</label>
            <select
              defaultValue="KES"
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
            >
              <option value="KES">KES — Kenyan Shilling</option>
              <option value="USD">USD — US Dollar</option>
              <option value="EUR">EUR — Euro</option>
              <option value="GBP">GBP — British Pound</option>
              <option value="UGX">UGX — Ugandan Shilling</option>
              <option value="TZS">TZS — Tanzanian Shilling</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Monthly income</label>
            <input
              defaultValue="150000"
              type="number"
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none mono"
              style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
              onFocus={e => (e.target as HTMLElement).style.borderColor = 'var(--primary)'}
              onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--border)'}
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mb-10" style={{ borderTop: '1px solid var(--border)', paddingTop: '32px' }}>
        <h2 className="text-xs font-semibold uppercase tracking-wider mb-5" style={{ color: 'var(--muted-foreground)' }}>Expense categories</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map(c => (
            <div
              key={c}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium"
              style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
            >
              {c}
              {categories.length > 3 && (
                <button
                  onClick={() => setCategories(prev => prev.filter(x => x !== c))}
                  className="w-4 h-4 rounded-full flex items-center justify-center text-xs transition-all"
                  style={{ color: 'var(--muted-foreground)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--expense)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--muted-foreground)'}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add category"
            value={newCat}
            onChange={e => setNewCat(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && newCat.trim() && !categories.includes(newCat.trim())) {
                setCategories(prev => [...prev, newCat.trim()]);
                setNewCat('');
              }
            }}
            className="flex-1 px-3 py-2 rounded-xl text-sm outline-none"
            style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
          />
          <button
            onClick={() => {
              if (newCat.trim() && !categories.includes(newCat.trim())) {
                setCategories(prev => [...prev, newCat.trim()]);
                setNewCat('');
              }
            }}
            className="px-4 py-2 rounded-xl text-sm font-semibold"
            style={{ background: 'var(--muted)', color: 'var(--foreground)' }}
          >
            Add
          </button>
        </div>
      </section>

      {/* Payment methods */}
      <section className="mb-10" style={{ borderTop: '1px solid var(--border)', paddingTop: '32px' }}>
        <h2 className="text-xs font-semibold uppercase tracking-wider mb-5" style={{ color: 'var(--muted-foreground)' }}>Payment methods</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {methods.map(m => (
            <div key={m} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium" style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}>
              {m}
              {methods.length > 1 && (
                <button
                  onClick={() => setMethods(prev => prev.filter(x => x !== m))}
                  className="w-4 h-4 flex items-center justify-center text-xs"
                  style={{ color: 'var(--muted-foreground)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--expense)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--muted-foreground)'}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add payment method"
            value={newMethod}
            onChange={e => setNewMethod(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && newMethod.trim()) {
                setMethods(prev => [...prev, newMethod.trim()]);
                setNewMethod('');
              }
            }}
            className="flex-1 px-3 py-2 rounded-xl text-sm outline-none"
            style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
          />
          <button
            onClick={() => { if (newMethod.trim()) { setMethods(prev => [...prev, newMethod.trim()]); setNewMethod(''); } }}
            className="px-4 py-2 rounded-xl text-sm font-semibold"
            style={{ background: 'var(--muted)', color: 'var(--foreground)' }}
          >
            Add
          </button>
        </div>
      </section>

      {/* Preferences */}
      <section className="mb-10" style={{ borderTop: '1px solid var(--border)', paddingTop: '32px' }}>
        <h2 className="text-xs font-semibold uppercase tracking-wider mb-5" style={{ color: 'var(--muted-foreground)' }}>Preferences</h2>
        <div className="space-y-5">
          {[
            { label: 'Monthly budget reminders', desc: 'Notify when a category exceeds 80% of budget', on: true },
            { label: 'Savings milestone alerts', desc: 'Notify when a goal reaches 25%, 50%, 75%, 100%', on: true },
            { label: 'Month summary', desc: 'Show a monthly summary when the month ends', on: false },
          ].map(({ label, desc, on }) => (
            <div key={label} className="flex items-start justify-between gap-6">
              <div>
                <div className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{label}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{desc}</div>
              </div>
              <div
                className="w-10 rounded-full relative cursor-pointer shrink-0 mt-0.5 transition-all"
                style={{ background: on ? 'var(--primary)' : 'var(--border)', height: '22px' }}
              >
                <div
                  className="absolute top-0.5 w-[18px] h-[18px] rounded-full bg-primary-foreground shadow-sm transition-all"
                  style={{ left: on ? 'calc(100% - 20px)' : '2px' }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Save */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{ background: saved ? 'var(--savings)' : 'var(--primary)', color: 'var(--primary-foreground)' }}
        >
          {saved ? '✓ Saved' : 'Save changes'}
        </button>
      </div>
    </div>
  );
}
