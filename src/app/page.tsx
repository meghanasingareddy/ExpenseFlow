import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Utensils,
  Clapperboard,
  Home,
  Heart,
} from "lucide-react";
import Header from "@/components/dashboard/header";
import SummaryCard from "@/components/dashboard/summary-card";
import BudgetProgress from "@/components/dashboard/budget-progress";
import SpendingChart from "@/components/dashboard/spending-chart";
import TransactionList from "@/components/dashboard/transaction-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AIInsights from "@/components/dashboard/ai-insights";

export default function DashboardPage() {
  const summaryData = [
    {
      icon: Wallet,
      title: "Total Balance",
      value: "₹1,028,805.59",
      subtitle: "+2.5% from last month",
    },
    {
      icon: TrendingUp,
      title: "Income",
      value: "₹400,000.00",
      subtitle: "Monthly salary",
    },
    {
      icon: TrendingDown,
      title: "Expenses",
      value: "₹151,234.40",
      subtitle: "-10.1% from last month",
    },
  ];

  const chartData = [
    { category: "Groceries", value: 32000, fill: "var(--chart-1)" },
    { category: "Rent", value: 120000, fill: "var(--chart-2)" },
    { category: "Entertainment", value: 20000, fill: "var(--chart-3)" },
    { category: "Transport", value: 12000, fill: "var(--chart-4)" },
    { category: "Utilities", value: 16000, fill: "var(--chart-5)" },
  ];

  const transactionData = [
    {
      icon: ShoppingBag,
      title: "Grocery Store",
      date: "2024-07-25",
      value: "-₹6,280.00",
    },
    {
      icon: Utensils,
      title: "Restaurant",
      date: "2024-07-24",
      value: "-₹3,616.00",
    },
    {
      icon: Clapperboard,
      title: "Movie Tickets",
      date: "2024-07-23",
      value: "-₹2,400.00",
    },
    {
      icon: Home,
      title: "Rent Payment",
      date: "2024-07-22",
      value: "-₹96,000.00",
    },
    {
      icon: Heart,
      title: "Pharmacy",
      date: "2024-07-21",
      value: "-₹1,820.00",
    },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <Header />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {summaryData.map((data, index) => (
            <SummaryCard
              key={index}
              icon={data.icon}
              title={data.title}
              value={data.value}
              subtitle={data.subtitle}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Spending Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <BudgetProgress value={65} />
                <div className="h-[280px] w-full">
                  <SpendingChart data={chartData} />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2">
            <TransactionList transactions={transactionData} />
          </div>
        </div>

        <div>
          <AIInsights />
        </div>
      </main>
    </div>
  );
}
