
"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Utensils,
  Clapperboard,
  Home,
  Heart,
  Book,
  Store,
  Smartphone,
  Car,
  Laptop,
  Bolt,
  PenSquare,
  Dumbbell,
  GraduationCap,
  School,
  Youtube,
  Salad,
  Scissors,
  Gift,
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
  place: string;
  amount: number;
  date: string;
  category: string;
  type: 'debit' | 'credit';
  icon: LucideIcon;
}

const initialTransactions: Omit<Transaction, 'icon' | 'id'>[] = [
    {
      place: "Grocery Store",
      amount: 2500,
      type: "debit",
      date: "2024-07-25",
      category: "Groceries",
    },
    {
      place: "Restaurant",
      amount: 1200,
      type: "debit",
      date: "2024-07-24",
      category: "Food",
    },
    {
      place: "Movie Tickets",
      amount: 800,
      type: "debit",
      date: "2024-07-23",
      category: "Entertainment",
    },
    {
      place: "Rent Payment",
      amount: 10000,
      type: "debit",
      date: "2024-07-22",
      category: "Rent",
    },
    {
      place: "Pharmacy",
      amount: 500,
      type: "debit",
      date: "2024-07-21",
      category: "Health",
    },
    {
      place: "Salary",
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
  Default: ShoppingBag,
  Income: TrendingUp,
  Transport: Car,
  Snacks: Utensils,
  Medical: Heart,
  Bookstore: Book,
  Pharmacy: Store,
  Recharge: Smartphone,
  "Online Shopping": Laptop,
  "Electricity Bill": Bolt,
  Stationery: PenSquare,
  Gym: Dumbbell,
  Tuition: GraduationCap,
  Canteen: School,
  "Hostel Fees": School,
  "Streaming Subscription": Youtube,
  "Fast Food": Salad,
  Salon: Scissors,
  "Gift Shop": Gift,
  Swiggy: Utensils,
};

const categoryColorMap: { [key: string]: string } = {
  Rent: "chart-2",
  Groceries: "chart-1",
  Food: "chart-3",
  Entertainment: "chart-4",
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
      if (!config[item.category]) {
        let colorVar = categoryColorMap[item.category];
        if (!colorVar) {
          // Get colors that are already used by the predefined categories
          const usedColors = new Set(Object.values(categoryColorMap));
          // Filter available colors to only include those not already used
          const remainingColors = availableColors.filter(color => !usedColors.has(color));
          colorVar = remainingColors[colorIndex % remainingColors.length] || availableColors[colorIndex % availableColors.length];
          colorIndex++;
        }
        config[item.category] = {
          label: item.category,
          color: `hsl(var(--${colorVar}))`,
        };
      }
    });
    return config;
  }, [chartData]);


  const budgetUsage = summary.totalIncome > 0 
    ? Math.round((summary.totalExpenses / summary.totalIncome) * 100)
    : 0;

  const handleAddTransaction = useCallback((newTx: Omit<Transaction, 'id' | 'type' | 'icon'> & {type?: 'debit' | 'credit'}) => {
    const category = newTx.category || "Default";
    const fullTransaction: Transaction = {
      ...newTx,
      id: new Date().toISOString(),
      type: newTx.type || (category === 'Income' ? 'credit' : 'debit'),
      category,
      icon: iconMap[category] || ShoppingBag,
    };
    setTransactions(prev => [fullTransaction, ...prev]);
  }, []);
  
  const handleDeleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  }, []);

  const handleAddMultipleTransactions = useCallback((newTransactions: (Omit<Transaction, 'id' | 'type' | 'icon' | 'place'> & { place: string, category: string })[]) => {
    const fullTransactions: Transaction[] = newTransactions.map(newTx => {
      return {
      ...newTx,
      id: new Date().toISOString() + Math.random(),
      type: 'debit', // Assume debit for extracted transactions
      icon: iconMap[newTx.category] || ShoppingBag,
      };
  });
    setTransactions(prev => [...fullTransactions, ...prev]);
  }, []);


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
            />
          </div>
        </div>

        <SmsImporter onTransactionsExtracted={handleAddMultipleTransactions} />
      </main>
    </div>
  );
}
