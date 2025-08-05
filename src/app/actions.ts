
"use server";

import { getSpendingInsights, type SpendingInsightsInput } from "@/ai/flows/spending-insights";

export async function getAIInsightsAction() {
  // In a real app, this data would come from the user's actual financial data.
  const input: SpendingInsightsInput = {
    income: 400000,
    expenses: [
      { category: "Groceries", amount: 32000 },
      { category: "Rent", amount: 120000 },
      { category: "Entertainment", amount: 20000 },
      { category: "Transport", amount: 12000 },
      { category: "Utilities", amount: 16000 },
    ],
    savingsGoal: 80000,
  };

  try {
    const result = await getSpendingInsights(input);
    return { success: true, insights: result.insights };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to generate insights." };
  }
}
