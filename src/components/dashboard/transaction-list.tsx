
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
import { PlusCircle, Trash2, ShoppingBag, Utensils, Clapperboard, Home, Heart, TrendingUp } from "lucide-react";
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
} from "@/components/ui/alert-dialog"

interface Transaction {
  id: string;
  merchant: string;
  date: string;
  amount: number;
  type: 'debit' | 'credit';
  category: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  onAddTransaction: (newTx: Omit<Transaction, 'id' | 'type' | 'icon'>) => void;
  onDeleteTransaction: (id: string) => void;
}

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
  Transport: ShoppingBag,
  Snacks: Utensils,
};


export default function TransactionList({
  transactions,
  onAddTransaction,
  onDeleteTransaction
}: TransactionListProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setTransactionToDelete(id);
  };

  const confirmDelete = () => {
    if (transactionToDelete) {
      onDeleteTransaction(transactionToDelete);
      setTransactionToDelete(null);
    }
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
              {transactions.map((transaction, index) => {
                const Icon = iconMap[transaction.category] || ShoppingBag;
                return (
                  <div key={transaction.id}>
                    <div className="flex items-center py-3 group">
                      <div className="rounded-full bg-secondary p-2">
                        <Icon className="h-5 w-5 text-muted-foreground" />
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
                      <Button variant="ghost" size="icon" className="ml-2 h-8 w-8 opacity-0 group-hover:opacity-100" onClick={() => handleDeleteClick(transaction.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    {index < transactions.length - 1 && <Separator />}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="border-t p-4">
          <Button asChild size="sm" variant="outline" className="w-full">
            <Link href="/transactions">View All</Link>
          </Button>
        </CardFooter>
      </Card>
      
      <AlertDialog open={!!transactionToDelete} onOpenChange={(open) => !open && setTransactionToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this transaction.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTransactionToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AddTransactionDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAddTransaction={onAddTransaction}
      />
    </>
  );
}
