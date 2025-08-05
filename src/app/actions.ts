
"use server";

import { extractTransactionsFromText, type Transaction } from "@/ai/flows/extract-transactions-from-text";
import { suggestPlaces, type SuggestPlacesInput } from "@/ai/flows/suggest-merchants";

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

export async function suggestPlacesAction(input: SuggestPlacesInput): Promise<{ success: boolean, places?: string[], error?: string }> {
  try {
    const result = await suggestPlaces(input);
    return { success: true, places: result.places };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to suggest merchants." };
  }
}
