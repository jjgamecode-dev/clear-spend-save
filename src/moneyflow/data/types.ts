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
  currentAmount: number;
  targetDate: string;
  monthlyContribution: number;
  color: string;
  icon: string;
}

export interface SavingsContribution {
  goalId: string;
  amount: number;
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
  Housing: '#2563EB',
  Food: '#F59E0B',
  Transport: '#06B6D4',
  Utilities: '#8B5CF6',
  Subscriptions: '#EC4899',
  Entertainment: '#F97316',
  Personal: '#10B981',
  Savings: '#059669',
  Other: '#94A3B8',
};

export const PAYMENT_METHODS = ['M-Pesa', 'Cash', 'Visa Card', 'Bank Transfer', 'Airtel Money'];

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
