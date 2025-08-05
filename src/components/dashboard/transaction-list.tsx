"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Trash2, ShoppingBag, Utensils, Clapperboard, Home, Heart } from "lucide-react";
import AddTransactionDialog from "./add-transaction-dialog";
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Transaction {
  id: string;
  icon: LucideIcon;
  merchant: string;
  date: string;
  amount: number;
  type: 'debit' | 'credit';
  category: string;
}

interface TransactionListProps {
  transactions: {
    id: string;
    icon: LucideIcon;
    title: string;
    date: string;
    value: string;
    category: string;
  }[];
}

const iconMap: { [key: string]: LucideIcon } = {
  Groceries: ShoppingBag,
  Food: Utensils,
  Entertainment: Clapperboard,
  Rent: Home,
  Health: Heart,
  Shopping: ShoppingBag,
  Other: ShoppingBag,
  Income: TrendingUp,
};
import { TrendingUp } from "lucide-react";


export default function TransactionList({
  transactions: initialTransactions,
}: TransactionListProps) {
    const [transactions, setTransactions] = useState(
    initialTransactions.map(t => ({
      ...t,
      // This is a bit of a hack to get the amount and type from the value string
      amount: parseFloat(t.value.replace(/[^0-9.-]+/g,"")),
      type: t.value.startsWith('-') ? 'debit' : 'credit' as 'debit' | 'credit',
      merchant: t.title,
    }))
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddTransaction = (newTx: { merchant: string; amount: number; date: string; category: string; }) => {
    const fullTransaction = {
      ...newTx,
      id: new Date().toISOString(),
      icon: iconMap[newTx.category] || ShoppingBag,
      type: newTx.category === 'Income' ? 'credit' : 'debit',
    };
    setTransactions(prev => [fullTransaction, ...prev]);
  };
  
  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  };


  return (
    <>
      <Card className="h-full shadow-sm flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest financial activities.</CardDescription>
          </div>
          <Button size="sm" variant="outline" onClick={() => setIsAddDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add
          </Button>
        </CardHeader>
        <CardContent className="p-0 flex-grow">
          <ScrollArea className="h-[320px]">
            <div className="space-y-1 p-6 pt-0">
              {transactions.map((transaction, index) => (
                <div key={transaction.id}>
                  <div className="flex items-center py-3 group">
                    <div className="rounded-full bg-secondary p-2">
                      <transaction.icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="ml-4 flex-grow space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {transaction.merchant}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.date}
                      </p>
                    </div>
                    <div className={`ml-auto text-right font-medium ${transaction.type === 'debit' ? 'text-destructive' : 'text-green-600'}`}>
                      {transaction.type === 'debit' ? '-' : '+'}₹{Math.abs(transaction.amount).toLocaleString()}
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="ml-2 h-8 w-8 opacity-0 group-hover:opacity-100">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this transaction.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteTransaction(transaction.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  {index < transactions.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="border-t p-4">
          <Button asChild size="sm" variant="outline" className="w-full">
            <Link href="/transactions">View All</Link>
          </Button>
        </CardFooter>
      </Card>
      <AddTransactionDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAddTransaction={handleAddTransaction}
      />
    </>
  );
}
