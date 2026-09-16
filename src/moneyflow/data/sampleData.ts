import { MonthData, SavingsGoal } from './types';

const uid = () => Math.random().toString(36).slice(2, 10);

const defaultBudgets = [
  { category: 'Housing', budget: 30000 },
  { category: 'Food', budget: 20000 },
  { category: 'Transport', budget: 15000 },
  { category: 'Utilities', budget: 8000 },
  { category: 'Subscriptions', budget: 3000 },
  { category: 'Entertainment', budget: 5000 },
  { category: 'Personal', budget: 7000 },
  { category: 'Other', budget: 4000 },
];

export const initialSavingsGoals: SavingsGoal[] = [
  {
    id: 'sg1',
    name: 'Emergency Fund',
    targetAmount: 450000,
    currentAmount: 180000,
    targetDate: '2027-03-31',
    monthlyContribution: 15000,
    color: '#2563EB',
    icon: '🛡️',
  },
  {
    id: 'sg2',
    name: 'Holiday — Zanzibar',
    targetAmount: 120000,
    currentAmount: 68000,
    targetDate: '2026-12-20',
    monthlyContribution: 8000,
    color: '#F59E0B',
    icon: '✈️',
  },
  {
    id: 'sg3',
    name: 'New MacBook',
    targetAmount: 180000,
    currentAmount: 54000,
    targetDate: '2027-06-30',
    monthlyContribution: 7000,
    color: '#8B5CF6',
    icon: '💻',
  },
];

function makeExpenses(year: number, month: number, seed: number): MonthData['expenses'] {
  const d = (day: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const base = [
    { date: d(1), description: 'Rent — Kilimani Apartment', category: 'Housing', amount: 30000, paymentMethod: 'Bank Transfer' },
    { date: d(2), description: 'Quickmart Weekly Shop', category: 'Food', amount: 4800 + seed * 200, paymentMethod: 'M-Pesa' },
    { date: d(3), description: 'Safaricom Postpay', category: 'Utilities', amount: 2200, paymentMethod: 'M-Pesa' },
    { date: d(5), description: 'Uber — Office Commute', category: 'Transport', amount: 1500 + seed * 100, paymentMethod: 'Visa Card' },
    { date: d(6), description: 'Netflix', category: 'Subscriptions', amount: 1100, paymentMethod: 'Visa Card' },
    { date: d(7), description: 'Java House — Lunch', category: 'Food', amount: 950, paymentMethod: 'M-Pesa' },
    { date: d(8), description: 'KPLC Electricity', category: 'Utilities', amount: 3200 + seed * 150, paymentMethod: 'M-Pesa' },
    { date: d(10), description: 'Matatu — Nairobi CBD', category: 'Transport', amount: 800, paymentMethod: 'Cash' },
    { date: d(11), description: 'Carrefour Grocery Run', category: 'Food', amount: 5500 + seed * 300, paymentMethod: 'Visa Card' },
    { date: d(12), description: 'Spotify Premium', category: 'Subscriptions', amount: 500, paymentMethod: 'Visa Card' },
    { date: d(13), description: 'Salon & Grooming', category: 'Personal', amount: 2500 + seed * 200, paymentMethod: 'Cash' },
    { date: d(14), description: 'Nairobi Water', category: 'Utilities', amount: 1400, paymentMethod: 'M-Pesa' },
    { date: d(15), description: 'Bolt — Weekend Trip', category: 'Transport', amount: 1200 + seed * 50, paymentMethod: 'M-Pesa' },
    { date: d(16), description: 'Westgate Cinema + Dinner', category: 'Entertainment', amount: 3800 + seed * 400, paymentMethod: 'Visa Card' },
    { date: d(18), description: 'Naivas Supermarket', category: 'Food', amount: 3200 + seed * 100, paymentMethod: 'M-Pesa' },
    { date: d(19), description: 'Amazon Prime', category: 'Subscriptions', amount: 780, paymentMethod: 'Visa Card' },
    { date: d(20), description: 'Gym Membership', category: 'Personal', amount: 3000, paymentMethod: 'M-Pesa' },
    { date: d(21), description: 'Petrol — Toyota Corolla', category: 'Transport', amount: 4500 + seed * 200, paymentMethod: 'Visa Card' },
    { date: d(22), description: 'Clothes & Accessories', category: 'Personal', amount: 5500 + seed * 500, paymentMethod: 'Visa Card' },
    { date: d(23), description: 'Artcaffe Brunch', category: 'Food', amount: 2100 + seed * 100, paymentMethod: 'M-Pesa' },
    { date: d(24), description: 'Showmax Subscription', category: 'Subscriptions', amount: 400, paymentMethod: 'M-Pesa' },
    { date: d(25), description: 'Internet — Zuku', category: 'Utilities', amount: 3500, paymentMethod: 'Bank Transfer' },
    { date: d(26), description: 'Books — Text Books Centre', category: 'Personal', amount: 1800 + seed * 200, paymentMethod: 'M-Pesa' },
    { date: d(27), description: 'Weekend Outing — Karura Forest', category: 'Entertainment', amount: 1500 + seed * 200, paymentMethod: 'Cash' },
    { date: d(28), description: 'Miscellaneous', category: 'Other', amount: 2200 + seed * 300, paymentMethod: 'M-Pesa' },
  ];
  return base.map(e => ({ ...e, id: uid() }));
}

function makeIncomes(year: number, month: number, hasFree: boolean, freeAmount = 0): MonthData['incomes'] {
  const incomes = [
    { id: uid(), name: 'Salary — Nairobi Tech Ltd', amount: 150000 },
  ];
  if (hasFree) incomes.push({ id: uid(), name: 'Freelance — Web Project', amount: freeAmount });
  return incomes;
}

export const initialMonthsData: MonthData[] = [
  {
    year: 2026, month: 3,
    incomes: makeIncomes(2026, 3, false),
    expenses: makeExpenses(2026, 3, 1),
    savingsContributions: [{ goalId: 'sg1', amount: 15000 }, { goalId: 'sg2', amount: 8000 }, { goalId: 'sg3', amount: 7000 }],
    budgets: defaultBudgets,
  },
  {
    year: 2026, month: 4,
    incomes: makeIncomes(2026, 4, true, 25000),
    expenses: makeExpenses(2026, 4, 3),
    savingsContributions: [{ goalId: 'sg1', amount: 15000 }, { goalId: 'sg2', amount: 8000 }, { goalId: 'sg3', amount: 7000 }],
    budgets: defaultBudgets,
  },
  {
    year: 2026, month: 5,
    incomes: makeIncomes(2026, 5, false),
    expenses: makeExpenses(2026, 5, 2),
    savingsContributions: [{ goalId: 'sg1', amount: 15000 }, { goalId: 'sg2', amount: 8000 }, { goalId: 'sg3', amount: 7000 }],
    budgets: defaultBudgets,
  },
  {
    year: 2026, month: 6,
    incomes: makeIncomes(2026, 6, true, 40000),
    expenses: makeExpenses(2026, 6, 4),
    savingsContributions: [{ goalId: 'sg1', amount: 15000 }, { goalId: 'sg2', amount: 10000 }, { goalId: 'sg3', amount: 7000 }],
    budgets: defaultBudgets,
  },
  {
    year: 2026, month: 7,
    incomes: makeIncomes(2026, 7, false),
    expenses: makeExpenses(2026, 7, 2),
    savingsContributions: [{ goalId: 'sg1', amount: 15000 }, { goalId: 'sg2', amount: 8000 }, { goalId: 'sg3', amount: 7000 }],
    budgets: defaultBudgets,
  },
  {
    year: 2026, month: 8,
    incomes: makeIncomes(2026, 8, true, 18000),
    expenses: makeExpenses(2026, 8, 1),
    savingsContributions: [{ goalId: 'sg1', amount: 15000 }, { goalId: 'sg2', amount: 8000 }, { goalId: 'sg3', amount: 7000 }],
    budgets: defaultBudgets,
  },
];

export const CURRENT_MONTH_INDEX = 5;
