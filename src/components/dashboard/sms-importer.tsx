
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

interface SmsImporterProps {
    onTransactionsExtracted: (transactions: Transaction[]) => void;
}

export default function SmsImporter({ onTransactionsExtracted }: SmsImporterProps) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [extractedTransactions, setExtractedTransactions] = useState<Transaction[] | null>(null);
  const { toast } = useToast();

  const handleExtract = async () => {
    setLoading(true);
    setExtractedTransactions(null);
    try {
      const result = await extractTransactionsAction(text);
      if (result.success && result.transactions) {
        if (result.transactions.length > 0) {
          setExtractedTransactions(result.transactions);
           toast({
            title: "Transactions Extracted!",
            description: `Successfully found ${result.transactions.length} transaction(s). Click Add to import them.`,
          });
        } else {
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

  const handleAddTransactions = () => {
    if (extractedTransactions) {
      onTransactionsExtracted(extractedTransactions);
      toast({
        title: "Success",
        description: `${extractedTransactions.length} transaction(s) have been added.`,
      });
      // Clear the state after adding
      setExtractedTransactions(null);
      setText("");
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
          placeholder="Paste SMS messages or other transaction texts here... e.g., 'spent 450 on groceries'"
          className="h-32"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading}
        />
        {extractedTransactions && (
          <div className="flex-grow">
            <h4 className="text-sm font-medium mb-2">Extracted Transactions (Preview):</h4>
            <ScrollArea className="h-40 rounded-md border">
              <div className="p-4 text-sm">
                {extractedTransactions.length > 0 ? (
                  extractedTransactions.map((tx, index) => (
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
                      {index < extractedTransactions.length - 1 && <Separator />}
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
      <CardFooter className="flex justify-between">
        <Button onClick={handleExtract} disabled={loading || !text}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="mr-2 h-4 w-4" />
          )}
          {loading ? "Extracting..." : "Extract Transactions"}
        </Button>
        {extractedTransactions && extractedTransactions.length > 0 && (
          <Button onClick={handleAddTransactions}>
            Add {extractedTransactions.length} Transaction(s)
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
