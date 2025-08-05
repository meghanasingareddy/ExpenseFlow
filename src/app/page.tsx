import {
  Wallet,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import Header from "@/components/dashboard/header";
import SummaryCard from "@/components/dashboard/summary-card";
import BudgetProgress from "@/components/dashboard/budget-progress";
import SpendingChart from "@/components/dashboard/spending-chart";
import TransactionList from "@/components/dashboard/transaction-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChartConfig } from "@/components/ui/chart";
import SmsImporter from "@/components/dashboard/sms-importer";

export default function DashboardPage() {
  const summaryData = [
    {
      icon: Wallet,
      title: "Total Balance",
      value: "₹59,500",
      subtitle: "+2.5% from last month",
    },
    {
      icon: TrendingUp,
      title: "Income",
      value: "₹25,000",
      subtitle: "Monthly salary",
    },
    {
      icon: TrendingDown,
      title: "Expenses",
      value: "₹15,500",
      subtitle: "-10.1% from last month",
    },
  ];

  const chartData = [
    { category: "Groceries", value: 3500, label: "Groceries" },
    { category: "Rent", value: 10000, label: "Rent" },
    { category: "Entertainment", value: 1000, label: "Entertainment" },
    { category: "Transport", value: 500, label: "Transport" },
    { category: "Utilities", value: 500, label: "Utilities" },
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
      id: "1",
      title: "Grocery Store",
      date: "2024-07-25",
      value: "-₹2,500",
      category: "Groceries",
    },
    {
      id: "2",
      title: "Restaurant",
      date: "2024-07-24",
      value: "-₹1,200",
      category: "Food",
    },
    {
      id: "3",
      title: "Movie Tickets",
      date: "2024-07-23",
      value: "-₹800",
      category: "Entertainment",
    },
    {
      id: "4",
      title: "Rent Payment",
      date: "2024-07-22",
      value: "-₹10,000",
      category: "Rent",
    },
    {
      id: "5",
      title: "Pharmacy",
      date: "2024-07-21",
      value: "-₹500",
      category: "Health",
    },
  ];

  const totalExpenses = chartData.reduce((acc, curr) => acc + curr.value, 0);
  const totalIncome = 25000;
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

        <SmsImporter />
      </main>
    </div>
  );
}
