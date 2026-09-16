import { createFileRoute } from "@tanstack/react-router";
import Budget from "../moneyflow/components/Budget";
import { useMoneyFlow } from "../moneyflow/MoneyFlowProvider";

export const Route = createFileRoute("/budget")({ head: () => ({ meta: [{ title: "Budget — MoneyFlow" }, { name: "description", content: "Compare your monthly budget, actual spending, and remaining amounts." }, { property: "og:title", content: "MoneyFlow Budget" }, { property: "og:description", content: "Plan your salary and stay aware of every category." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }), component: BudgetPage });
function BudgetPage() { const { month, updateBudget, updateIncomes } = useMoneyFlow(); return <Budget month={month} onUpdateBudget={updateBudget} onUpdateIncomes={updateIncomes} />; }