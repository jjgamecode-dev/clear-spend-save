import { useState } from 'react';
import { SavingsGoal, MonthData } from '../data/types';
import { getSavingsGoalProgress, fmt } from '../utils/calculations';

interface Props {
  savingsGoals: SavingsGoal[];
  monthData: MonthData;
  onAddGoal: (g: SavingsGoal) => void;
  onUpdateGoal: (g: SavingsGoal) => void;
  onDeleteGoal: (id: string) => void;
  onAddContribution: (goalId: string, amount: number) => void;
}

const GOAL_COLORS = ['#2563EB', '#059669', '#F59E0B', '#8B5CF6', '#EC4899', '#F97316', '#06B6D4'];
const GOAL_ICONS = ['🛡️', '✈️', '💻', '🚗', '📈', '🏠', '🎓', '💎'];
const uid = () => Math.random().toString(36).slice(2, 10);

export default function Savings({ savingsGoals, monthData, onAddGoal, onDeleteGoal, onAddContribution }: Props) {
  const [showAdd, setShowAdd] = useState(false);
  const [contributeGoalId, setContributeGoalId] = useState<string | null>(null);
  const [contributionAmount, setContributionAmount] = useState('');
  const [newGoal, setNewGoal] = useState({ name: '', targetAmount: '', currentAmount: '', targetDate: '', monthlyContribution: '', color: GOAL_COLORS[0], icon: GOAL_ICONS[0] });

  const totalSavedThisMonth = monthData.savingsContributions.reduce((s, c) => s + c.amount, 0);
  const totalCurrentSavings = savingsGoals.reduce((s, g) => s + g.currentAmount, 0);

  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.targetAmount) return;
    onAddGoal({
      id: uid(),
      name: newGoal.name,
      targetAmount: parseFloat(newGoal.targetAmount) || 0,
      currentAmount: parseFloat(newGoal.currentAmount) || 0,
      targetDate: newGoal.targetDate || '2027-12-31',
      monthlyContribution: parseFloat(newGoal.monthlyContribution) || 0,
      color: newGoal.color,
      icon: newGoal.icon,
    });
    setNewGoal({ name: '', targetAmount: '', currentAmount: '', targetDate: '', monthlyContribution: '', color: GOAL_COLORS[0], icon: GOAL_ICONS[0] });
    setShowAdd(false);
  };

  const handleContribute = () => {
    const amount = parseFloat(contributionAmount);
    if (!contributeGoalId || isNaN(amount) || amount <= 0) return;
    onAddContribution(contributeGoalId, amount);
    setContributeGoalId(null);
    setContributionAmount('');
  };

  return (
    <div className="page-content">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>Savings Goals</h1>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>What are you building toward?</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: 'var(--primary)', color: 'white' }}
        >
          + New Goal
        </button>
      </div>

      {/* Summary */}
      {savingsGoals.length > 0 && (
        <div className="flex gap-6 mb-8 pb-8" style={{ borderBottom: '1px solid var(--border)' }}>
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Saved this month</div>
            <div className="text-2xl font-bold mono" style={{ color: 'var(--savings)' }}>{fmt(totalSavedThisMonth)}</div>
          </div>
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Total across goals</div>
            <div className="text-2xl font-bold mono" style={{ color: 'var(--foreground)' }}>{fmt(totalCurrentSavings)}</div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {savingsGoals.length === 0 && (
        <div className="text-center py-16">
          <div className="text-3xl mb-3">🎯</div>
          <div className="text-base font-semibold mb-2" style={{ color: 'var(--foreground)' }}>No savings goals yet</div>
          <div className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>Give your savings a destination.</div>
          <button onClick={() => setShowAdd(true)} className="px-5 py-2.5 rounded-xl text-sm font-semibold" style={{ background: 'var(--primary)', color: 'white' }}>
            Create goal
          </button>
        </div>
      )}

      {/* Goals list */}
      <div className="space-y-4">
        {savingsGoals.map(goal => {
          const { pct, remaining, monthsLeft, requiredMonthly } = getSavingsGoalProgress(goal);
          const monthContrib = monthData.savingsContributions.find(c => c.goalId === goal.id)?.amount ?? 0;

          return (
            <div
              key={goal.id}
              className="rounded-2xl p-5"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              {/* Goal header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0" style={{ background: `${goal.color}18` }}>
                    {goal.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{goal.name}</div>
                    <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Target: {goal.targetDate}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setContributeGoalId(goal.id); setContributionAmount(''); }}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                    style={{ background: `${goal.color}12`, color: goal.color, border: `1px solid ${goal.color}30` }}
                  >
                    + Add
                  </button>
                  <button
                    onClick={() => onDeleteGoal(goal.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs"
                    style={{ color: '#EF4444' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#FEF2F2'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Amount + percentage */}
              <div className="flex items-end justify-between mb-3">
                <div>
                  <div className="text-xl font-bold mono" style={{ color: 'var(--foreground)' }}>
                    {fmt(goal.currentAmount)}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    of {fmt(goal.targetAmount)}
                  </div>
                </div>
                <div className="text-2xl font-bold mono" style={{ color: goal.color }}>
                  {pct.toFixed(0)}%
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2.5 rounded-full overflow-hidden mb-3" style={{ background: 'var(--border)' }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, background: goal.color }}
                />
              </div>

              {/* Stats row */}
              <div className="flex gap-4 flex-wrap text-xs" style={{ color: 'var(--muted-foreground)' }}>
                <span><span className="font-semibold mono" style={{ color: 'var(--foreground)' }}>{fmt(remaining, true)}</span> remaining</span>
                <span><span className="font-semibold mono" style={{ color: 'var(--foreground)' }}>{monthsLeft}</span> months left</span>
                <span>Need <span className="font-semibold mono" style={{ color: 'var(--foreground)' }}>{fmt(requiredMonthly, true)}/mo</span></span>
                {monthContrib > 0 && (
                  <span className="font-medium" style={{ color: 'var(--savings)' }}>{fmt(monthContrib, true)} this month</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Goal modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl p-6 space-y-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base" style={{ color: 'var(--foreground)' }}>New Savings Goal</h2>
              <button onClick={() => setShowAdd(false)} style={{ color: 'var(--muted-foreground)' }}>✕</button>
            </div>
            <div className="space-y-3">
              <div className="flex gap-2">
                <select value={newGoal.icon} onChange={e => setNewGoal(g => ({ ...g, icon: e.target.value }))}
                  className="px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}>
                  {GOAL_ICONS.map(i => <option key={i}>{i}</option>)}
                </select>
                <input
                  placeholder="Goal name (e.g. Emergency Fund)"
                  value={newGoal.name}
                  onChange={e => setNewGoal(g => ({ ...g, name: e.target.value }))}
                  className="flex-1 px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                />
              </div>
              {[
                { key: 'targetAmount', label: 'Target amount (KES)', type: 'number' },
                { key: 'currentAmount', label: 'Current saved (KES)', type: 'number' },
                { key: 'monthlyContribution', label: 'Monthly contribution (KES)', type: 'number' },
                { key: 'targetDate', label: 'Target date', type: 'date' },
              ].map(({ key, label, type }) => (
                <input key={key} type={type} placeholder={label} value={(newGoal as any)[key]}
                  onChange={e => setNewGoal(g => ({ ...g, [key]: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }} />
              ))}
              <div className="flex gap-2 flex-wrap">
                {GOAL_COLORS.map(c => (
                  <button key={c} onClick={() => setNewGoal(g => ({ ...g, color: c }))}
                    className="w-7 h-7 rounded-full transition-all"
                    style={{ background: c, outline: newGoal.color === c ? `3px solid ${c}` : 'none', outlineOffset: '2px' }} />
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold" style={{ background: 'var(--muted)', color: 'var(--foreground)' }}>Cancel</button>
              <button onClick={handleAddGoal} className="flex-1 py-2.5 rounded-xl text-sm font-semibold" style={{ background: 'var(--primary)', color: 'white' }}>Create Goal</button>
            </div>
          </div>
        </div>
      )}

      {/* Contribute modal */}
      {contributeGoalId && (() => {
        const goal = savingsGoals.find(g => g.id === contributeGoalId);
        if (!goal) return null;
        return (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
            <div className="w-full sm:max-w-sm rounded-t-3xl sm:rounded-2xl p-6 space-y-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-base" style={{ color: 'var(--foreground)' }}>Add to {goal.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                    {fmt(goal.currentAmount)} of {fmt(goal.targetAmount)} saved
                  </div>
                </div>
                <button onClick={() => setContributeGoalId(null)} style={{ color: 'var(--muted-foreground)' }}>✕</button>
              </div>
              <div className="rounded-2xl p-4 text-center" style={{ background: `${goal.color}10` }}>
                <div className="text-xs font-medium mb-2" style={{ color: 'var(--muted-foreground)' }}>Amount (KES)</div>
                <input
                  autoFocus
                  type="number"
                  value={contributionAmount}
                  onChange={e => setContributionAmount(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleContribute()}
                  placeholder="0"
                  className="w-full text-center text-3xl font-bold outline-none bg-transparent mono"
                  style={{ color: goal.color }}
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setContributeGoalId(null)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold" style={{ background: 'var(--muted)', color: 'var(--foreground)' }}>Cancel</button>
                <button onClick={handleContribute} className="flex-1 py-2.5 rounded-xl text-sm font-semibold" style={{ background: goal.color, color: 'white' }}>Add Money</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
