export interface IncomeSource {
  id: string;
  name: string;
  amount: number;
}

export interface Expense {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  paymentMethod: string;
  notes?: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  targetDate: string;
  monthlyContribution: number;
  color: string;
  icon: string;
}

export interface SavingsContribution {
  id: string;
  goalId: string;
  amount: number;
  date: string;
}

export interface BudgetLine {
  category: string;
  budget: number;
}

export interface MonthData {
  year: number;
  month: number;
  incomes: IncomeSource[];
  expenses: Expense[];
  savingsContributions: SavingsContribution[];
  budgets: BudgetLine[];
}

export type Page = 'dashboard' | 'budget' | 'expenses' | 'savings' | 'reports' | 'settings';

export interface MonthSummary {
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  available: number;
  savingsRate: number;
}

export const EXPENSE_CATEGORIES = [
  'Housing',
  'Food',
  'Transport',
  'Utilities',
  'Subscriptions',
  'Entertainment',
  'Personal',
  'Other',
] as const;

export const CATEGORY_COLORS: Record<string, string> = {
  Housing: 'var(--category-housing)',
  Food: 'var(--category-food)',
  Transport: 'var(--category-transport)',
  Utilities: 'var(--category-utilities)',
  Subscriptions: 'var(--category-subscriptions)',
  Entertainment: 'var(--category-entertainment)',
  Personal: 'var(--category-personal)',
  Savings: 'var(--savings)',
  Other: 'var(--category-other)',
};

export const PAYMENT_METHODS = ['M-Pesa', 'Cash', 'Visa Card', 'Bank Transfer', 'Airtel Money'];

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
