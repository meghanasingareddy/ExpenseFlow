
'use server';

/**
 * @fileOverview An AI flow for suggesting place names based on user input.
 * 
 * - suggestPlaces - A function that provides place suggestions.
 * - SuggestPlacesInput - The input type for the suggestion flow.
 * - SuggestPlacesOutput - The output type for the suggestion flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SuggestPlacesInputSchema = z.object({
  query: z.string().describe('The partial place name entered by the user.'),
  count: z.number().optional().default(3).describe('The number of suggestions to return.'),
});

export type SuggestPlacesInput = z.infer<typeof SuggestPlacesInputSchema>;

const SuggestPlacesOutputSchema = z.object({
  places: z.array(z.string()).describe('An array of suggested place names.'),
});

export type SuggestPlacesOutput = z.infer<typeof SuggestPlacesOutputSchema>;

export async function suggestPlaces(input: SuggestPlacesInput): Promise<SuggestPlacesOutput> {
    const prompt = ai.definePrompt({
    name: 'suggestPlacesPrompt',
    input: {
      schema: SuggestPlacesInputSchema,
    },
    output: {
      schema: SuggestPlacesOutputSchema,
    },
    prompt: `Based on the user's input query: "{{query}}", suggest {{count}} potential full place names. These are for an expense tracking app.
  
  Examples:
  - query: "starb" -> suggestions: ["Starbucks", "Star Bazaar"]
  - query: "ama" -> suggestions: ["Amazon", "Amato's", "Amara"]
  
  Return a JSON object with a "places" key containing the list of names.`,
    });

    const suggestPlacesFlow = ai.defineFlow(
    {
        name: 'suggestPlacesFlow',
        inputSchema: SuggestPlacesInputSchema,
        outputSchema: SuggestPlacesOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
    );
  return suggestPlacesFlow(input);
}
