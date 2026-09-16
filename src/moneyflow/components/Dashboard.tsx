import { MonthData, SavingsGoal, CATEGORY_COLORS, MONTH_NAMES } from '../data/types';
import { getMonthSummary, getCategoryTotals, fmt, getGoalBalance, getSavingsGoalProgress } from '../utils/calculations';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell, Tooltip } from 'recharts';

interface Props {
  monthsData: MonthData[];
  selectedMonthIndex: number;
  savingsGoals: SavingsGoal[];
  onAddExpense: () => void;
  onNavigate: (page: string) => void;
}

// Signature MoneyFlow allocation bar
function AllocationBar({ income, expenses, savings, available }: { income: number; expenses: number; savings: number; available: number }) {
  if (income === 0) return null;
  const expPct = (expenses / income) * 100;
  const savPct = (savings / income) * 100;
  const avPct = Math.max(100 - expPct - savPct, 0);

  return (
    <div className="space-y-3">
      <div className="flex h-3 rounded-full overflow-hidden gap-px" style={{ background: 'var(--border)' }}>
        <div style={{ width: `${expPct}%`, background: 'var(--expense)', minWidth: expPct > 0 ? 4 : 0 }} className="rounded-l-full" />
        <div style={{ width: `${savPct}%`, background: 'var(--savings)', minWidth: savPct > 0 ? 4 : 0 }} />
        <div style={{ width: `${avPct}%`, background: 'var(--available)', minWidth: avPct > 0 ? 4 : 0 }} className="rounded-r-full" />
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs">
        {[
          { label: 'Spent', value: expenses, color: 'var(--expense)', pct: expPct },
          { label: 'Saved', value: savings, color: 'var(--savings)', pct: savPct },
          { label: 'Available', value: available, color: 'var(--available)', pct: avPct },
        ].map(({ label, value, color, pct }) => (
          <div key={label}>
            <div className="flex items-center gap-1.5 mb-0.5">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
              <span style={{ color: 'var(--muted-foreground)' }}>{label}</span>
            </div>
            <div className="font-semibold mono text-sm" style={{ color: 'var(--foreground)' }}>
              {fmt(value, true)}
            </div>
            <div style={{ color: 'var(--muted-foreground)' }}>{pct.toFixed(0)}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard({ monthsData, selectedMonthIndex, savingsGoals, onAddExpense, onNavigate }: Props) {
  const month = monthsData[selectedMonthIndex];
  if (!month) return null;
  const summary = getMonthSummary(month);
  const categoryTotals = getCategoryTotals(month);

  const catBarData = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, value]) => ({ name: name.slice(0, 5), fullName: name, value }));

  const recentExpenses = [...month.expenses]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  // Budget health — categories that have exceeded or are close to budget
  const budgetWarnings = month.budgets
    .map(b => {
      const actual = categoryTotals[b.category] ?? 0;
      const pct = b.budget > 0 ? (actual / b.budget) * 100 : 0;
      return { category: b.category, budget: b.budget, actual, pct };
    })
    .filter(b => b.pct >= 70)
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 3);

  // Insights
  const prevIndex = selectedMonthIndex > 0 ? selectedMonthIndex - 1 : null;
  const prevMonth = prevIndex !== null ? monthsData[prevIndex] : null;
  const prevCatTotals = prevMonth ? getCategoryTotals(prevMonth) : null;

  const insights: string[] = [];
  if (prevCatTotals) {
    const curTransport = categoryTotals['Transport'] ?? 0;
    const prevTransport = prevCatTotals['Transport'] ?? 0;
    if (prevTransport > 0) {
      const diff = ((curTransport - prevTransport) / prevTransport) * 100;
      if (Math.abs(diff) >= 10) {
        insights.push(`You've spent ${Math.abs(diff).toFixed(0)}% ${diff < 0 ? 'less' : 'more'} on transport than last month.`);
      }
    }
  }
  const foodBudget = month.budgets.find(b => b.category === 'Food');
  if (foodBudget) {
    const foodSpent = categoryTotals['Food'] ?? 0;
    const remaining = foodBudget.budget - foodSpent;
    if (remaining > 0) {
      insights.push(`You have ${fmt(remaining, true)} remaining in your food budget.`);
    }
  }
  const topGoal = savingsGoals[0];
  if (topGoal) {
    const { pct } = getSavingsGoalProgress(topGoal, getGoalBalance(topGoal.id, monthsData));
    insights.push(`Your ${topGoal.name} goal is ${pct.toFixed(0)}% complete.`);
  }

  const isNoExpenses = month.expenses.length === 0;

  return (
    <div className="page-content">
      {/* Month header */}
      <div className="mb-8">
        <div className="text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>
          {MONTH_NAMES[month.month]} {month.year}
        </div>
        <div className="flex items-baseline gap-3 flex-wrap">
          <div className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>
            Monthly Income
          </div>
          <div className="text-2xl font-bold mono" style={{ color: 'var(--foreground)' }}>
            {fmt(summary.totalIncome)}
          </div>
          {month.incomes.length > 1 && (
            <div className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#EFF6FF', color: 'var(--primary)' }}>
              {month.incomes.length} sources
            </div>
          )}
        </div>
      </div>

      {/* Primary: Available */}
      <div className="mb-8">
        <div className="text-sm font-medium mb-2" style={{ color: 'var(--muted-foreground)' }}>
          Available after expenses &amp; savings
        </div>
        <div
          className="text-5xl font-bold mono mb-1"
          style={{ color: summary.available >= 0 ? 'var(--available)' : 'var(--expense)' }}
        >
          {fmt(summary.available)}
        </div>
        {summary.available < 0 && (
          <div className="text-sm font-medium" style={{ color: 'var(--expense)' }}>
            Over budget this month
          </div>
        )}
      </div>

      {/* MoneyFlow allocation bar */}
      <div className="mb-10 pb-8" style={{ borderBottom: '1px solid var(--border)' }}>
        <AllocationBar
          income={summary.totalIncome}
          expenses={summary.totalExpenses}
          savings={summary.totalSavings}
          available={summary.available}
        />
      </div>

      {/* Two-column layout */}
      <div className="grid lg:grid-cols-[1fr_288px] gap-10">

        {/* Left column */}
        <div className="space-y-10">

          {/* Spending overview */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Spending this month</h2>
              <button
                onClick={() => onNavigate('expenses')}
                className="text-xs font-medium transition-all"
                style={{ color: 'var(--primary)' }}
              >
                View breakdown →
              </button>
            </div>

            {isNoExpenses ? (
              <div className="text-center py-10" style={{ color: 'var(--muted-foreground)' }}>
                <div className="text-2xl mb-2">📋</div>
                <div className="text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>No expenses yet</div>
                <div className="text-xs mb-4">Start tracking where your money goes.</div>
                <button onClick={onAddExpense} className="px-4 py-2 rounded-xl text-sm font-semibold" style={{ background: 'var(--primary)', color: 'white' }}>
                  Add expense
                </button>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={catBarData.length * 36 + 16}>
                <BarChart
                  data={catBarData}
                  layout="vertical"
                  margin={{ top: 0, right: 60, bottom: 0, left: 0 }}
                  barSize={14}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={46}
                    tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-data)' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
    const d = payload[0]?.payload;
    if (!d) return null;
                      return (
                        <div className="rounded-xl px-3 py-2 text-xs shadow-lg" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                          <div className="font-semibold mb-0.5" style={{ color: 'var(--foreground)' }}>{d.fullName}</div>
                          <div className="mono" style={{ color: 'var(--foreground)' }}>{fmt(d.value)}</div>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                    {catBarData.map(entry => (
                      <Cell key={entry.fullName} fill={CATEGORY_COLORS[entry.fullName] ?? '#94A3B8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Recent transactions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Recent</h2>
              <button onClick={() => onNavigate('expenses')} className="text-xs font-medium" style={{ color: 'var(--primary)' }}>
                View all →
              </button>
            </div>

            {recentExpenses.length === 0 ? (
              <div className="text-sm text-center py-6" style={{ color: 'var(--muted-foreground)' }}>No transactions yet</div>
            ) : (
              <div className="space-y-0">
                {recentExpenses.map((e, i) => (
                  <div
                    key={e.id}
                    className="flex items-center justify-between py-3 gap-3"
                    style={{ borderBottom: i < recentExpenses.length - 1 ? '1px solid var(--border)' : 'none' }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-semibold shrink-0"
                        style={{ background: CATEGORY_COLORS[e.category] ?? '#94A3B8' }}
                      >
                        {e.category[0]}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate" style={{ color: 'var(--foreground)' }}>{e.description}</div>
                        <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{e.category} · {e.date}</div>
                      </div>
                    </div>
                    <div className="text-sm font-semibold mono shrink-0" style={{ color: 'var(--foreground)' }}>{fmt(e.amount)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-8">

          {/* Budget status */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Budget</h2>
              <button onClick={() => onNavigate('budget')} className="text-xs font-medium" style={{ color: 'var(--primary)' }}>
                View budget →
              </button>
            </div>
            <div className="mb-3">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  {fmt(summary.totalExpenses, true)} of {fmt(month.budgets.reduce((s, b) => s + b.budget, 0), true)} planned
                </span>
                <span className="text-xs font-semibold mono" style={{ color: 'var(--foreground)' }}>
                  {month.budgets.reduce((s, b) => s + b.budget, 0) > 0
                    ? ((summary.totalExpenses / month.budgets.reduce((s, b) => s + b.budget, 0)) * 100).toFixed(0)
                    : 0}%
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min((summary.totalExpenses / Math.max(month.budgets.reduce((s, b) => s + b.budget, 0), 1)) * 100, 100)}%`,
                    background: 'var(--expense)',
                  }}
                />
              </div>
            </div>
            {budgetWarnings.length > 0 && (
              <div className="space-y-2">
                {budgetWarnings.map(bw => (
                  <div key={bw.category} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: bw.pct >= 100 ? 'var(--expense)' : '#F59E0B' }} />
                      <span style={{ color: 'var(--foreground)' }}>{bw.category}</span>
                    </div>
                    <span className="mono font-medium" style={{ color: bw.pct >= 100 ? 'var(--expense)' : '#D97706' }}>
                      {bw.pct.toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Savings */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Savings</h2>
              <button onClick={() => onNavigate('savings')} className="text-xs font-medium" style={{ color: 'var(--primary)' }}>
                View savings →
              </button>
            </div>
            <div className="text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>
              <span className="text-base font-bold mono" style={{ color: 'var(--savings)' }}>{fmt(summary.totalSavings)}</span>
              {' '}saved this month
            </div>
            {savingsGoals.slice(0, 2).map(goal => {
              const { pct } = getSavingsGoalProgress(goal, getGoalBalance(goal.id, monthsData));
              return (
                <div key={goal.id} className="mb-3">
                  <div className="flex items-center justify-between mb-1.5 text-xs">
                    <span style={{ color: 'var(--foreground)' }}>{goal.name}</span>
                    <span className="mono" style={{ color: 'var(--muted-foreground)' }}>{pct.toFixed(0)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'var(--border)' }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: goal.color }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Insights */}
          {insights.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Insights</h2>
              <div className="space-y-3">
                {insights.slice(0, 3).map((insight, i) => (
                  <div key={i} className="flex gap-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    <span className="shrink-0 mt-0.5" style={{ color: 'var(--primary)' }}>→</span>
                    <span>{insight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
