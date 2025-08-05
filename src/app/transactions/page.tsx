
"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  File,
  PlusCircle,
  ListFilter,
  Trash2,
} from "lucide-react";
import Header from "@/components/dashboard/header";
import AddTransactionDialog from "@/components/dashboard/add-transaction-dialog";

// Mock data, in a real app this would be fetched from a database
const allTransactions = [
  {
    id: "1",
    merchant: "Grocery Store",
    amount: 2500,
    type: "debit",
    date: "2024-07-25",
    category: "Groceries",
  },
  {
    id: "2",
    merchant: "Restaurant",
    amount: 1200,
    type: "debit",
    date: "2024-07-24",
    category: "Food",
  },
  {
    id: "3",
    merchant: "Movie Tickets",
    amount: 800,
    type: "debit",
    date: "2024-07-23",
    category: "Entertainment",
  },
  {
    id: "4",
    merchant: "Rent Payment",
    amount: 10000,
    type: "debit",
    date: "2024-07-22",
    category: "Rent",
  },
  {
    id: "5",
    merchant: "Pharmacy",
    amount: 500,
    type: "debit",
    date: "2024-07-21",
    category: "Health",
  },
  {
    id: "6",
    merchant: "Salary",
    amount: 25000,
    type: "credit",
    date: "2024-07-20",
    category: "Income",
  },
  {
    id: "7",
    merchant: "Online Shopping",
    amount: 3000,
    type: "debit",
    date: "2024-07-19",
    category: "Shopping",
  },
];

type Transaction = (typeof allTransactions)[0];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState(allTransactions);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [filter, setFilter] = useState("all");

  const handleAddTransaction = (newTx: Omit<Transaction, 'id' | 'type'> & { merchant: string }) => {
    const newTransaction: Transaction = {
      ...newTx,
      id: new Date().toISOString(),
      type: newTx.category === 'Income' ? 'credit' : 'debit',
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };
  
  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  };


  const filteredTransactions = transactions.filter(tx => {
    if (filter === "all") return true;
    return tx.category.toLowerCase() === filter;
  });
  
  const categories = Array.from(new Set(allTransactions.map(t => t.category)));


  return (
    <>
      <div className="flex min-h-screen w-full flex-col bg-background">
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">Transactions</h1>
            <div className="ml-auto flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <ListFilter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Filter
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by category</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={filter} onValueChange={setFilter}>
                    <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                    {categories.map(cat => (
                        <DropdownMenuRadioItem key={cat} value={cat.toLowerCase()}>{cat}</DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button size="sm" variant="outline" className="h-8 gap-1">
                <File className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Export
                </span>
              </Button>
              <Button size="sm" className="h-8 gap-1" onClick={() => setIsAddDialogOpen(true)}>
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Transaction
                </span>
              </Button>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>All Transactions</CardTitle>
              <CardDescription>
                A detailed list of all your recorded transactions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Merchant</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-medium">
                        {tx.merchant}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{tx.category}</Badge>
                      </TableCell>
                      <TableCell className={`text-right ${tx.type === 'debit' ? 'text-destructive' : 'text-green-600'}`}>
                        {tx.type === 'debit' ? '-' : '+'}₹{tx.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>{tx.date}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteTransaction(tx.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
      <AddTransactionDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAddTransaction={handleAddTransaction}
      />
    </>
  );
}
