"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { extractTransactionsAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { MessageSquareText, Loader2, ArrowRight } from "lucide-react";
import type { Transaction } from "@/ai/flows/extract-transactions-from-text";

export default function SmsImporter() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const { toast } = useToast();

  const handleExtract = async () => {
    setLoading(true);
    setTransactions(null);
    try {
      const result = await extractTransactionsAction(text);
      if (result.success && result.transactions) {
        setTransactions(result.transactions);
        if (result.transactions.length === 0) {
          toast({
            title: "No Transactions Found",
            description: "The AI couldn't find any transactions in the text provided.",
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Could not extract transactions.",
        });
      }
    } catch (error) {
       toast({
          variant: "destructive",
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
        });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquareText className="h-5 w-5 text-primary" />
          <span>Import from Text</span>
        </CardTitle>
        <CardDescription>
          Paste in messages to automatically extract transaction data.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4">
        <Textarea
          placeholder="Paste SMS messages or other transaction texts here..."
          className="h-32"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading}
        />
        {transactions && (
          <div className="flex-grow">
            <h4 className="text-sm font-medium mb-2">Extracted Transactions:</h4>
            <ScrollArea className="h-40 rounded-md border">
              <div className="p-4 text-sm">
                {transactions.length > 0 ? (
                  transactions.map((tx, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center py-2">
                        <div>
                          <p className="font-semibold">{tx.merchant}</p>
                          <p className="text-muted-foreground text-xs">{tx.date}</p>
                        </div>
                        <p className={`font-mono ${tx.type === 'debit' ? 'text-destructive' : 'text-green-600'}`}>
                          {tx.type === 'debit' ? '-' : '+'}₹{tx.amount.toFixed(2)}
                        </p>
                      </div>
                      {index < transactions.length - 1 && <Separator />}
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">No transactions found.</p>
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleExtract} disabled={loading || !text}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="mr-2 h-4 w-4" />
          )}
          {loading ? "Extracting..." : "Extract Transactions"}
        </Button>
      </CardFooter>
    </Card>
  );
}
