import { createFileRoute } from "@tanstack/react-router";
import Reports from "../moneyflow/components/Reports";
import { useMoneyFlow } from "../moneyflow/MoneyFlowProvider";

export const Route = createFileRoute("/reports")({ head: () => ({ meta: [{ title: "Reports — MoneyFlow" }, { name: "description", content: "Explore income, expense, savings, and category trends over time." }, { property: "og:title", content: "MoneyFlow Reports" }, { property: "og:description", content: "Understand your financial history and trends." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }), component: ReportsPage });
function ReportsPage() { const { monthsData, monthIndex } = useMoneyFlow(); return <Reports monthsData={monthsData} selectedMonthIndex={monthIndex} />; }