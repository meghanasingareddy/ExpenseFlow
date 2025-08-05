
'use server';

/**
 * @fileOverview An AI flow for suggesting merchant names based on user input.
 * 
 * - suggestMerchants - A function that provides merchant suggestions.
 * - SuggestMerchantsInput - The input type for the suggestion flow.
 * - SuggestMerchantsOutput - The output type for the suggestion flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SuggestMerchantsInputSchema = z.object({
  query: z.string().describe('The partial merchant name entered by the user.'),
  count: z.number().optional().default(3).describe('The number of suggestions to return.'),
});

export type SuggestMerchantsInput = z.infer<typeof SuggestMerchantsInputSchema>;

const SuggestMerchantsOutputSchema = z.object({
  merchants: z.array(z.string()).describe('An array of suggested merchant names.'),
});

export type SuggestMerchantsOutput = z.infer<typeof SuggestMerchantsOutputSchema>;

export async function suggestMerchants(input: SuggestMerchantsInput): Promise<SuggestMerchantsOutput> {
    const prompt = ai.definePrompt({
    name: 'suggestMerchantsPrompt',
    input: {
      schema: SuggestMerchantsInputSchema,
    },
    output: {
      schema: SuggestMerchantsOutputSchema,
    },
    prompt: `Based on the user's input query: "{{query}}", suggest {{count}} potential full merchant names. These are for an expense tracking app.
  
  Examples:
  - query: "starb" -> suggestions: ["Starbucks", "Star Bazaar"]
  - query: "ama" -> suggestions: ["Amazon", "Amato's", "Amara"]
  
  Provide only the list of names.`,
    });

    const suggestMerchantsFlow = ai.defineFlow(
    {
        name: 'suggestMerchantsFlow',
        inputSchema: SuggestMerchantsInputSchema,
        outputSchema: SuggestMerchantsOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
    );
  return suggestMerchantsFlow(input);
}
