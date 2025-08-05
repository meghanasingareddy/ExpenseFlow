"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Wand2 } from "lucide-react";
import { getAIInsightsAction } from "@/app/actions";
import { Skeleton } from "../ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Terminal } from "lucide-react";

export default function AIInsights() {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGetInsights = async () => {
    setLoading(true);
    setInsights(null);
    try {
      const result = await getAIInsightsAction();
      if (result.success) {
        setInsights(result.insights ?? "No insights generated.");
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "An unknown error occurred.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch AI insights. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-primary" />
          <span>AI-Powered Insights</span>
        </CardTitle>
        <CardDescription>
          Get personalized insights on your spending habits and find savings
          opportunities.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!insights && !loading && (
          <Button onClick={handleGetInsights} disabled={loading}>
            <Wand2 className="mr-2 h-4 w-4" />
            {loading ? "Analyzing..." : "Generate Insights"}
          </Button>
        )}
        {loading && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        )}
        {insights && (
          <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>Your Financial Analysis</AlertTitle>
            <AlertDescription>
              <p className="whitespace-pre-wrap">{insights}</p>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
