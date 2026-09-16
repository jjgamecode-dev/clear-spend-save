import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { initialMonthsData, initialSavingsGoals, CURRENT_MONTH_INDEX } from "./data/sampleData";
import type { Expense, IncomeSource, MonthData, SavingsGoal } from "./data/types";
import AddExpenseModal from "./components/AddExpenseModal";

interface MoneyFlowContextValue {
  monthsData: MonthData[];
  savingsGoals: SavingsGoal[];
  monthIndex: number;
  month: MonthData;
  setMonthIndex: (index: number) => void;
  openExpenseForm: () => void;
  addExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  updateExpense: (expense: Expense) => void;
  updateBudget: (category: string, amount: number) => void;
  updateIncomes: (incomes: IncomeSource[]) => void;
  addSavingsGoal: (goal: SavingsGoal) => void;
  deleteSavingsGoal: (id: string) => void;
  addContribution: (goalId: string, amount: number) => void;
}

const MoneyFlowContext = createContext<MoneyFlowContextValue | null>(null);

export function MoneyFlowProvider({ children }: { children: ReactNode }) {
  const [monthsData, setMonthsData] = useState(initialMonthsData);
  const [savingsGoals, setSavingsGoals] = useState(initialSavingsGoals);
  const [monthIndex, setMonthIndex] = useState(CURRENT_MONTH_INDEX);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const month = monthsData[monthIndex] ?? monthsData[0];

  if (!month) return null;

  const updateMonth = (updater: (value: MonthData) => MonthData) => {
    setMonthsData((previous) => previous.map((value, index) => index === monthIndex ? updater(value) : value));
  };

  const value = useMemo<MoneyFlowContextValue>(() => ({
    monthsData,
    savingsGoals,
    monthIndex,
    month,
    setMonthIndex,
    openExpenseForm: () => setShowExpenseForm(true),
    addExpense: (expense) => updateMonth((value) => ({ ...value, expenses: [...value.expenses, expense] })),
    deleteExpense: (id) => updateMonth((value) => ({ ...value, expenses: value.expenses.filter((expense) => expense.id !== id) })),
    updateExpense: (expense) => updateMonth((value) => ({ ...value, expenses: value.expenses.map((item) => item.id === expense.id ? expense : item) })),
    updateBudget: (category, amount) => updateMonth((value) => ({ ...value, budgets: value.budgets.map((line) => line.category === category ? { ...line, budget: amount } : line) })),
    updateIncomes: (incomes) => updateMonth((value) => ({ ...value, incomes })),
    addSavingsGoal: (goal) => setSavingsGoals((previous) => [...previous, goal]),
    deleteSavingsGoal: (id) => setSavingsGoals((previous) => previous.filter((goal) => goal.id !== id)),
    addContribution: (goalId, amount) => updateMonth((value) => ({
      ...value,
      savingsContributions: [...value.savingsContributions, {
        id: crypto.randomUUID(),
        goalId,
        amount,
        date: `${value.year}-${String(value.month + 1).padStart(2, "0")}-15`,
      }],
    })),
  }), [month, monthIndex, monthsData, savingsGoals]);

  return (
    <MoneyFlowContext.Provider value={value}>
      {children}
      {showExpenseForm && (
        <AddExpenseModal
          currentDate={`${month.year}-${String(month.month + 1).padStart(2, "0")}-15`}
          onAdd={value.addExpense}
          onClose={() => setShowExpenseForm(false)}
        />
      )}
    </MoneyFlowContext.Provider>
  );
}

export function useMoneyFlow() {
  const context = useContext(MoneyFlowContext);
  if (!context) throw new Error("useMoneyFlow must be used within MoneyFlowProvider");
  return context;
}