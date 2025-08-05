
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
import { useToast } from "@/hooks/use-toast";
import { MessageSquareText, Loader2, ArrowRight } from "lucide-react";
import type { Transaction } from "@/ai/flows/extract-transactions-from-text";

interface SmsImporterProps {
    onTransactionsExtracted: (transactions: Omit<Transaction, 'id' | 'type' | 'icon' | 'place'> & { place: string, category: string }[]) => void;
}

const months: { [key: string]: number } = {
  january: 0, januarys: 0, jan: 0,
  february: 1, februarys: 1, feb: 1,
  march: 2, marchs: 2, mar: 2,
  april: 3, aprils: 3, apr: 3,
  may: 4, mays: 4,
  june: 5, junes: 5, jun: 5,
  july: 6, julys: 6, jul: 6,
  august: 7, augusts: 7, aug: 7,
  september: 8, septembers: 8, sep: 8, sept: 8,
  october: 9, octobers: 9, oct: 9,
  november: 10, novembers: 10, nov: 10,
  december: 11, decembers: 11, dec: 11
};


function extractTransactionData(message: string): (Omit<Transaction, 'id' | 'type' | 'icon' | 'place'> & { place: string, category: string }) | null {
  const regex = /Paid\s?₹(\d+(?:\.\d{1,2})?)\s?to\s?([a-zA-Z\s]+)(?: on (\d{1,2})(?:st|nd|rd|th)?\s([a-zA-Z]+))?/i;
  const match = message.match(regex);

  if (match) {
    const amount = parseFloat(match[1]);
    const place = match[2].trim();
    const day = match[3] ? parseInt(match[3], 10) : new Date().getDate();
    const monthName = match[4] ? match[4].toLowerCase() : new Date().toLocaleString('default', { month: 'long' }).toLowerCase();
    const month = months[monthName] ?? new Date().getMonth();
    const year = new Date().getFullYear();
    
    const transactionDate = new Date(year, month, day);

    // If the parsed date is in the future, assume it was last year
    if (transactionDate > new Date()) {
      transactionDate.setFullYear(year - 1);
    }
    
    return {
      amount,
      place,
      date: transactionDate.toISOString().split("T")[0],
      category: place, // Use place as category
    };
  }
  return null;
}

export default function SmsImporter({ onTransactionsExtracted }: SmsImporterProps) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleExtractAndAdd = () => {
    setLoading(true);
    try {
      const lines = text.split('\n').filter(line => line.trim() !== '');
      const extractedTransactions = lines.map(extractTransactionData).filter(Boolean) as (Omit<Transaction, 'id' | 'type' | 'icon' | 'place'> & { place: string, category: string })[];

      if (extractedTransactions.length > 0) {
        onTransactionsExtracted(extractedTransactions);
        toast({
          title: "Transactions Added!",
          description: `Successfully imported ${extractedTransactions.length} transaction(s).`,
        });
        setText(""); // Clear textarea on success
      } else {
        toast({
          variant: "destructive",
          title: "No Transactions Found",
          description: "Could not extract any transactions. Please check the format.",
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
          Paste messages like 'Paid ₹550 to Swiggy on 3rd August' to automatically add transactions.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4">
        <Textarea
          id="messageInput"
          placeholder="Paid ₹550 to Swiggy on 3rd August..."
          className="h-32"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading}
        />
      </CardContent>
      <CardFooter className="flex justify-start">
        <Button onClick={handleExtractAndAdd} disabled={loading || !text}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="mr-2 h-4 w-4" />
          )}
          {loading ? "Importing..." : "Import Transactions"}
        </Button>
      </CardFooter>
    </Card>
  );
}
