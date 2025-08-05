import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface Transaction {
  icon: LucideIcon;
  title: string;
  date: string;
  value: string;
}

interface TransactionListProps {
  transactions: Transaction[];
}

export default function TransactionList({
  transactions,
}: TransactionListProps) {
  return (
    <Card className="h-full shadow-sm">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[320px]">
          <div className="space-y-1 p-6 pt-0">
            {transactions.map((transaction, index) => (
              <div key={index}>
                <div className="flex items-center py-3">
                  <div className="rounded-full bg-secondary p-2">
                    <transaction.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="ml-4 flex-grow space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {transaction.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {transaction.date}
                    </p>
                  </div>
                  <div className="ml-auto text-right font-medium">
                    {transaction.value}
                  </div>
                </div>
                {index < transactions.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t p-4">
        <Button size="sm" variant="outline" className="w-full">
          View All
        </Button>
      </CardFooter>
    </Card>
  );
}
