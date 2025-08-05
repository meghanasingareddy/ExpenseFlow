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
import type { ChartConfig } from "@/components/ui/chart";
import SmsImporter from "@/components/dashboard/sms-importer";

export default function DashboardPage() {
  const summaryData = [
    {
      icon: Wallet,
      title: "Total Balance",
      value: "₹1,20,500",
      subtitle: "+2.5% from last month",
    },
    {
      icon: TrendingUp,
      title: "Income",
      value: "₹50,000",
      subtitle: "Monthly salary",
    },
    {
      icon: TrendingDown,
      title: "Expenses",
      value: "₹40,000",
      subtitle: "-10.1% from last month",
    },
  ];

  const chartData = [
    { category: "Groceries", value: 8000, label: "Groceries" },
    { category: "Rent", value: 20000, label: "Rent" },
    { category: "Entertainment", value: 5000, label: "Entertainment" },
    { category: "Transport", value: 3000, label: "Transport" },
    { category: "Utilities", value: 4000, label: "Utilities" },
  ];

  const chartConfig = {
    value: {
      label: "Value",
    },
    Groceries: {
      label: "Groceries",
      color: "hsl(var(--chart-1))",
    },
    Rent: {
      label: "Rent",
      color: "hsl(var(--chart-2))",
    },
    Entertainment: {
      label: "Entertainment",
      color: "hsl(var(--chart-3))",
    },
    Transport: {
      label: "Transport",
      color: "hsl(var(--chart-4))",
    },
    Utilities: {
      label: "Utilities",
      color: "hsl(var(--chart-5))",
    },
  } satisfies ChartConfig

  const transactionData = [
    {
      icon: ShoppingBag,
      title: "Grocery Store",
      date: "2024-07-25",
      value: "-₹2,500",
    },
    {
      icon: Utensils,
      title: "Restaurant",
      date: "2024-07-24",
      value: "-₹1,200",
    },
    {
      icon: Clapperboard,
      title: "Movie Tickets",
      date: "2024-07-23",
      value: "-₹800",
    },
    {
      icon: Home,
      title: "Rent Payment",
      date: "2024-07-22",
      value: "-₹20,000",
    },
    {
      icon: Heart,
      title: "Pharmacy",
      date: "2024-07-21",
      value: "-₹500",
    },
  ];

  const totalExpenses = chartData.reduce((acc, curr) => acc + curr.value, 0);
  const totalIncome = 50000;
  const budgetUsage = Math.round((totalExpenses / totalIncome) * 100);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <Header />
      <main className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
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
                <BudgetProgress value={budgetUsage} />
                <div className="h-[280px] w-full">
                  <SpendingChart data={chartData} config={chartConfig} />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2">
            <TransactionList transactions={transactionData} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AIInsights />
          <SmsImporter />
        </div>
      </main>
    </div>
  );
}
