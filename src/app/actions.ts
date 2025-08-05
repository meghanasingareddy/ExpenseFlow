
"use server";

import { getSpendingInsights, type SpendingInsightsInput } from "@/ai/flows/spending-insights";
import { extractTransactionsFromText, type Transaction } from "@/ai/flows/extract-transactions-from-text";

export async function getAIInsightsAction() {
  // In a real app, this data would come from the user's actual financial data.
  const input: SpendingInsightsInput = {
    income: 50000,
    expenses: [
      { category: "Groceries", amount: 8000 },
      { category: "Rent", amount: 20000 },
      { category: "Entertainment", amount: 5000 },
      { category: "Transport", amount: 3000 },
      { category: "Utilities", amount: 4000 },
    ],
    savingsGoal: 10000,
  };

  try {
    const result = await getSpendingInsights(input);
    return { success: true, insights: result.insights };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to generate insights." };
  }
}

export async function extractTransactionsAction(text: string): Promise<{ success: boolean, transactions?: Transaction[], error?: string }> {
  if (!text) {
    return { success: false, error: "No text provided." };
  }

  try {
    const result = await extractTransactionsFromText({ text });
    return { success: true, transactions: result.transactions };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to extract transactions." };
  }
}
