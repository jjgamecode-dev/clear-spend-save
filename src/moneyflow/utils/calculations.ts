import { MonthData, MonthSummary, SavingsGoal } from '../data/types';

export function getMonthSummary(month: MonthData): MonthSummary {
  const totalIncome = month.incomes.reduce((s, i) => s + i.amount, 0);
  const totalExpenses = month.expenses.reduce((s, e) => s + e.amount, 0);
  const totalSavings = month.savingsContributions.reduce((s, c) => s + c.amount, 0);
  const available = totalIncome - totalExpenses - totalSavings;
  const savingsRate = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;
  return { totalIncome, totalExpenses, totalSavings, available, savingsRate };
}

export function getCategoryTotals(month: MonthData): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const e of month.expenses) {
    totals[e.category] = (totals[e.category] ?? 0) + e.amount;
  }
  return totals;
}

export function fmt(amount: number, compact = false): string {
  if (compact && Math.abs(amount) >= 1000) {
    return `KES ${(amount / 1000).toFixed(0)}K`;
  }
  return `KES ${amount.toLocaleString('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function fmtShort(amount: number): string {
  return amount.toLocaleString('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export function getSavingsGoalProgress(goal: SavingsGoal) {
  const pct = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0);
  const today = new Date();
  const target = new Date(goal.targetDate);
  const monthsLeft = Math.max(
    (target.getFullYear() - today.getFullYear()) * 12 + (target.getMonth() - today.getMonth()),
    1,
  );
  const requiredMonthly = remaining > 0 ? Math.ceil(remaining / monthsLeft) : 0;
  return { pct, remaining, monthsLeft, requiredMonthly };
}
