
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
  const { toast } = useToast();

  const handleExtractAndAdd = async () => {
    setLoading(true);
    try {
      const result = await extractTransactionsAction(text);
      if (result.success && result.transactions) {
        if (result.transactions.length > 0) {
          onTransactionsExtracted(result.transactions);
           toast({
            title: "Transactions Added!",
            description: `Successfully imported ${result.transactions.length} transaction(s).`,
          });
          setText(""); // Clear textarea on success
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


  return (
    <Card className="shadow-sm h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquareText className="h-5 w-5 text-primary" />
          <span>Import from Text</span>
        </CardTitle>
        <CardDescription>
          Paste in messages to automatically extract and add transaction data.
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
