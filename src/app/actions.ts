
"use server";

import { extractTransactionsFromText, type Transaction } from "@/ai/flows/extract-transactions-from-text";
import { suggestMerchants, type SuggestMerchantsInput } from "@/ai/flows/suggest-merchants";

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

export async function suggestMerchantsAction(input: SuggestMerchantsInput): Promise<{ success: boolean, merchants?: string[], error?: string }> {
  try {
    const result = await suggestMerchants(input);
    return { success: true, merchants: result.merchants };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to suggest merchants." };
  }
}
