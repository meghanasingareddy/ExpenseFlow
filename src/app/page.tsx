
"use client";

import { useState, useMemo } from "react";
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
import type { LucideIcon } from "lucide-react";
import Header from "@/components/dashboard/header";
import SummaryCard from "@/components/dashboard/summary-card";
import BudgetProgress from "@/components/dashboard/budget-progress";
import SpendingChart from "@/components/dashboard/spending-chart";
import TransactionList from "@/components/dashboard/transaction-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChartConfig } from "@/components/ui/chart";
import SmsImporter from "@/components/dashboard/sms-importer";

interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  date: string;
  category: string;
  type: 'debit' | 'credit';
  icon: LucideIcon;
}

const initialTransactions: Omit<Transaction, 'icon' | 'id'>[] = [
    {
      merchant: "Grocery Store",
      amount: 2500,
      type: "debit",
      date: "2024-07-25",
      category: "Groceries",
    },
    {
      merchant: "Restaurant",
      amount: 1200,
      type: "debit",
      date: "2024-07-24",
      category: "Food",
    },
    {
      merchant: "Movie Tickets",
      amount: 800,
      type: "debit",
      date: "2024-07-23",
      category: "Entertainment",
    },
    {
      merchant: "Rent Payment",
      amount: 10000,
      type: "debit",
      date: "2024-07-22",
      category: "Rent",
    },
    {
      merchant: "Pharmacy",
      amount: 500,
      type: "debit",
      date: "2024-07-21",
      category: "Health",
    },
    {
      merchant: "Salary",
      amount: 25000,
      type: "credit",
      date: "2024-07-20",
      category: "Income",
    },
];

const iconMap: { [key: string]: LucideIcon } = {
  Groceries: ShoppingBag,
  Food: Utensils,
  Entertainment: Clapperboard,
  Rent: Home,
  Health: Heart,
  Shopping: ShoppingBag,
  Daily: ShoppingBag,
  Other: ShoppingBag,
  Income: TrendingUp,
};

const categoryColorMap: { [key: string]: string } = {
  Rent: "chart-2",
  Groceries: "chart-1",
  Food: "chart-4",
  Entertainment: "chart-3",
  Health: "chart-5",
};


export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    return initialTransactions.map((t, i) => ({
      ...t,
      id: `${i + 1}`,
      icon: iconMap[t.category] || ShoppingBag,
    }));
  });

  const summary = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'credit')
      .reduce((acc, curr) => acc + curr.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'debit')
      .reduce((acc, curr) => acc + curr.amount, 0);
      
    const totalBalance = totalIncome - totalExpenses;

    return { totalIncome, totalExpenses, totalBalance };
  }, [transactions]);
  
  const summaryData = [
    {
      icon: Wallet,
      title: "Total Balance",
      value: `₹${summary.totalBalance.toLocaleString()}`,
      subtitle: "+2.5% from last month",
    },
    {
      icon: TrendingUp,
      title: "Income",
      value: `₹${summary.totalIncome.toLocaleString()}`,
      subtitle: "This month",
    },
    {
      icon: TrendingDown,
      title: "Expenses",
      value: `₹${summary.totalExpenses.toLocaleString()}`,
      subtitle: "-10.1% from last month",
    },
  ];

  const chartData = useMemo(() => {
    const expenseCategories = transactions
      .filter(t => t.type === 'debit')
      .reduce((acc, curr) => {
        if (!acc[curr.category]) {
          acc[curr.category] = 0;
        }
        acc[curr.category] += curr.amount;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(expenseCategories).map(([category, value]) => ({
      category,
      value,
      label: category,
    }));
  }, [transactions]);


  const chartConfig = useMemo(() => {
    const config: ChartConfig = { value: { label: "Value" } };
    const availableColors = ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"];
    let colorIndex = 0;

    chartData.forEach((item) => {
      let colorVar: string;
      if (categoryColorMap[item.category]) {
        colorVar = categoryColorMap[item.category];
      } else {
        // Find a color that's not already used by the mapped categories
        do {
          colorVar = availableColors[colorIndex % availableColors.length];
          colorIndex++;
        } while (Object.values(categoryColorMap).includes(colorVar) && colorIndex < availableColors.length * 2);
      }
      
      config[item.category] = {
        label: item.category,
        color: `hsl(var(--${colorVar}))`,
      };
    });
    return config;
  }, [chartData]);


  const budgetUsage = summary.totalIncome > 0 
    ? Math.round((summary.totalExpenses / summary.totalIncome) * 100)
    : 0;

  const handleAddTransaction = (newTx: Omit<Transaction, 'id' | 'type' | 'icon'> & {type?: 'debit' | 'credit'}) => {
    const fullTransaction: Transaction = {
      ...newTx,
      id: new Date().toISOString(),
      type: newTx.category === 'Income' ? 'credit' : 'debit',
      icon: iconMap[newTx.category] || ShoppingBag,
    };
    setTransactions(prev => [fullTransaction, ...prev]);
  };
  
  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  };


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
                   {chartData.length > 0 ? (
                    <SpendingChart data={chartData} config={chartConfig} />
                   ) : (
                     <div className="flex h-full items-center justify-center text-muted-foreground">
                       No expense data to display.
                     </div>
                   )}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2">
            <TransactionList 
              transactions={transactions} 
              onAddTransaction={handleAddTransaction}
              onDeleteTransaction={handleDeleteTransaction}
              iconMap={iconMap}
            />
          </div>
        </div>

        <SmsImporter />
      </main>
    </div>
  );
}
