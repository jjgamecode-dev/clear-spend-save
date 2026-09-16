import { createFileRoute, useNavigate } from "@tanstack/react-router";
import Dashboard from "../moneyflow/components/Dashboard";
import { useMoneyFlow } from "../moneyflow/MoneyFlowProvider";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Dashboard — MoneyFlow" },
    { name: "description", content: "See your monthly income, spending, savings, available money, and budget status." },
    { property: "og:title", content: "MoneyFlow Dashboard" },
    { property: "og:description", content: "See how you are doing financially this month." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

function Index() {
  const { monthsData, savingsGoals, monthIndex, openExpenseForm } = useMoneyFlow();
  const navigate = useNavigate();
  return <Dashboard monthsData={monthsData} selectedMonthIndex={monthIndex} savingsGoals={savingsGoals} onAddExpense={openExpenseForm} onNavigate={(page) => navigate({ to: page === "dashboard" ? "/" : `/${page}` as "/budget" })} />;
}
