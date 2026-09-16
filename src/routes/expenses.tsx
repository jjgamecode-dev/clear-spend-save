import { createFileRoute } from "@tanstack/react-router";
import Expenses from "../moneyflow/components/Expenses";
import { useMoneyFlow } from "../moneyflow/MoneyFlowProvider";

export const Route = createFileRoute("/expenses")({ head: () => ({ meta: [{ title: "Expenses — MoneyFlow" }, { name: "description", content: "Review where your money went and record expenses quickly." }, { property: "og:title", content: "MoneyFlow Expenses" }, { property: "og:description", content: "A clear view of your monthly transactions." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }), component: ExpensesPage });
function ExpensesPage() { const { month, deleteExpense, updateExpense, openExpenseForm } = useMoneyFlow(); return <Expenses expenses={month.expenses} year={month.year} month={month.month} onDelete={deleteExpense} onUpdate={updateExpense} onAddExpense={openExpenseForm} />; }