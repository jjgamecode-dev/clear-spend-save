import { useState } from 'react';
import { MonthData, CATEGORY_COLORS, MONTH_NAMES } from '../data/types';
import { getMonthSummary, getCategoryTotals, fmt } from '../utils/calculations';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from 'recharts';

interface Props {
  monthsData: MonthData[];
  selectedMonthIndex: number;
}

type Period = '1' | '3' | '6';

const PERIOD_LABELS: Record<Period, string> = { '1': '1 month', '3': '3 months', '6': '6 months' };

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-4 py-3 shadow-lg text-xs" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <div className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 mb-0.5">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color, display: 'inline-block' }} />
          <span style={{ color: 'var(--muted-foreground)' }}>{p.name}:</span>
          <span className="font-semibold mono" style={{ color: 'var(--foreground)' }}>{fmt(p.value, true)}</span>
        </div>
      ))}
    </div>
  );
};

export default function Reports({ monthsData, selectedMonthIndex }: Props) {
  const [period, setPeriod] = useState<Period>('6');
  const selectedMonth = monthsData[selectedMonthIndex] ?? monthsData[0];
  if (!selectedMonth) return null;

  const sliceCount = parseInt(period);
  const displayMonths = monthsData.slice(Math.max(0, monthsData.length - sliceCount));

  const summaries = displayMonths.map(m => ({
    ...getMonthSummary(m),
    name: (MONTH_NAMES[m.month] ?? '').slice(0, 3),
    month: m,
  }));

  const allSummaries = monthsData.map(m => getMonthSummary(m));
  const totalIncome = allSummaries.reduce((s, m) => s + m.totalIncome, 0);
  const totalExpenses = allSummaries.reduce((s, m) => s + m.totalExpenses, 0);
  const totalSavings = allSummaries.reduce((s, m) => s + m.totalSavings, 0);
  const avgSavingsRate = (totalSavings / totalIncome) * 100;
  const bestSavingsMonth = allSummaries.reduce((best, m, i) => m.totalSavings > (allSummaries[best]?.totalSavings ?? 0) ? i : best, 0);
  const highestSpendMonth = allSummaries.reduce((best, m, i) => m.totalExpenses > (allSummaries[best]?.totalExpenses ?? 0) ? i : best, 0);

  const trendData = summaries.map(s => ({
    name: s.name,
    Income: s.totalIncome,
    Expenses: s.totalExpenses,
    Savings: s.totalSavings,
  }));

  const savingsRateData = summaries.map(s => ({
    name: s.name,
    'Rate': parseFloat(s.savingsRate.toFixed(1)),
  }));

  // Category breakdown for selected month
  const selectedCatTotals = getCategoryTotals(selectedMonth);
  const catData = Object.entries(selectedCatTotals)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));

  return (
    <div className="page-content">
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>Reports</h1>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Historical view of your financial activity.</p>
        </div>
        {/* Period toggle */}
        <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--card)' }}>
          {(Object.keys(PERIOD_LABELS) as Period[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="px-4 py-2 text-xs font-semibold transition-all"
              style={{
                background: period === p ? 'var(--primary)' : 'transparent',
                color: period === p ? 'white' : 'var(--muted-foreground)',
              }}
            >
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>
      </div>

      {/* Period summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total income', value: fmt(totalIncome), color: 'var(--income)' },
          { label: 'Total expenses', value: fmt(totalExpenses), color: 'var(--expense)' },
          { label: 'Total saved', value: fmt(totalSavings), color: 'var(--savings)' },
          { label: 'Avg savings rate', value: `${avgSavingsRate.toFixed(1)}%`, color: 'var(--available)' },
        ].map(({ label, value, color }) => (
          <div key={label}>
            <div className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>{label}</div>
            <div className="text-lg font-bold mono" style={{ color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Income vs Expenses vs Savings */}
      <div className="mb-10">
        <h2 className="text-sm font-semibold mb-5" style={{ color: 'var(--foreground)' }}>Income · Expenses · Savings</h2>
        <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={trendData} margin={{ top: 0, right: 8, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-data)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-data)' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: 'var(--muted-foreground)' }} />
              <Bar dataKey="Income" fill="var(--income)" radius={[4, 4, 0, 0]} maxBarSize={32} />
              <Bar dataKey="Expenses" fill="var(--expense)" radius={[4, 4, 0, 0]} maxBarSize={32} />
              <Bar dataKey="Savings" fill="var(--savings)" radius={[4, 4, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Savings rate */}
      <div className="mb-10">
        <h2 className="text-sm font-semibold mb-5" style={{ color: 'var(--foreground)' }}>Savings rate</h2>
        <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={savingsRateData} margin={{ top: 0, right: 8, bottom: 0, left: -30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-data)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-data)' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="rounded-xl px-3 py-2 text-xs shadow-lg" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                      <div className="font-semibold mb-0.5" style={{ color: 'var(--foreground)' }}>{label}</div>
                      <div className="mono font-semibold" style={{ color: 'var(--savings)' }}>{payload[0]?.value}%</div>
                    </div>
                  );
                }}
              />
              <Line type="monotone" dataKey="Rate" stroke="var(--savings)" strokeWidth={2.5} dot={{ r: 4, fill: 'var(--savings)', strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category breakdown for selected month */}
      <div className="mb-10">
        <h2 className="text-sm font-semibold mb-5" style={{ color: 'var(--foreground)' }}>
          Spending by category — {MONTH_NAMES[selectedMonth.month]}
        </h2>
        <div className="space-y-3">
          {catData.map(({ name, value }) => {
            const totalExpenses = catData.reduce((s, d) => s + d.value, 0);
            const pct = totalExpenses > 0 ? (value / totalExpenses) * 100 : 0;
            return (
              <div key={name}>
                <div className="flex items-center justify-between mb-1.5 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: CATEGORY_COLORS[name] ?? 'var(--category-other)' }} />
                    <span style={{ color: 'var(--foreground)' }}>{name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="mono font-medium" style={{ color: 'var(--foreground)' }}>{fmt(value, true)}</span>
                    <span className="w-10 text-right text-xs mono" style={{ color: 'var(--muted-foreground)' }}>{pct.toFixed(0)}%</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: 'var(--border)' }}>
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: CATEGORY_COLORS[name] ?? 'var(--category-other)' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Month-by-month table */}
      <div>
        <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Month-by-month</h2>
        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--secondary)' }}>
                  {['Month', 'Income', 'Expenses', 'Savings', 'Available', 'Rate'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {monthsData.map((m, i) => {
                  const s = getMonthSummary(m);
                  return (
                    <tr
                      key={i}
                      style={{
                        borderBottom: i < monthsData.length - 1 ? '1px solid var(--border)' : 'none',
                        background: i === selectedMonthIndex ? 'var(--primary-soft)' : '',
                      }}
                    >
                      <td className="px-5 py-3 font-medium" style={{ color: 'var(--foreground)' }}>
                         {(MONTH_NAMES[m.month] ?? '').slice(0, 3)} {m.year}
                         {i === selectedMonthIndex && (
                           <span className="ml-2 rounded bg-primary-soft px-1.5 py-0.5 text-xs text-primary">current</span>
                        )}
                      </td>
                      <td className="px-5 py-3 mono font-medium" style={{ color: 'var(--income)' }}>{fmt(s.totalIncome, true)}</td>
                      <td className="px-5 py-3 mono font-medium" style={{ color: 'var(--expense)' }}>{fmt(s.totalExpenses, true)}</td>
                      <td className="px-5 py-3 mono font-medium" style={{ color: 'var(--savings)' }}>{fmt(s.totalSavings, true)}</td>
                      <td className="px-5 py-3 mono font-medium" style={{ color: s.available >= 0 ? 'var(--foreground)' : 'var(--expense)' }}>{fmt(s.available, true)}</td>
                      <td className="px-5 py-3 mono" style={{ color: 'var(--available)' }}>{s.savingsRate.toFixed(1)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Notable months */}
      <div className="mt-8 flex gap-6 flex-wrap">
        <div>
          <div className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Best savings month</div>
          <div className="text-sm font-semibold" style={{ color: 'var(--savings)' }}>
             {MONTH_NAMES[monthsData[bestSavingsMonth]?.month ?? 0]} · {fmt(allSummaries[bestSavingsMonth]?.totalSavings ?? 0, true)}
          </div>
        </div>
        <div>
          <div className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Highest spending month</div>
          <div className="text-sm font-semibold" style={{ color: 'var(--expense)' }}>
             {MONTH_NAMES[monthsData[highestSpendMonth]?.month ?? 0]} · {fmt(allSummaries[highestSpendMonth]?.totalExpenses ?? 0, true)}
          </div>
        </div>
      </div>
    </div>
  );
}
