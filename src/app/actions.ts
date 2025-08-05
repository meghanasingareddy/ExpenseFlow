
"use server";

import { getSpendingInsights, type SpendingInsightsInput } from "@/ai/flows/spending-insights";

export async function getAIInsightsAction() {
  // In a real app, this data would come from the user's actual financial data.
  const input: SpendingInsightsInput = {
    income: 5000,
    expenses: [
      { category: "Groceries", amount: 400 },
      { category: "Rent", amount: 1500 },
      { category: "Entertainment", amount: 250 },
      { category: "Transport", amount: 150 },
      { category: "Utilities", amount: 200 },
    ],
    savingsGoal: 1000,
  };

  try {
    const result = await getSpendingInsights(input);
    return { success: true, insights: result.insights };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to generate insights." };
  }
}
