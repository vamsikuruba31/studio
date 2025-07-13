'use server';

/**
 * @fileOverview Recommends events based on user's previous registrations.
 *
 * - recommendEvents - A function that recommends events based on user's previous registrations.
 * - RecommendEventsInput - The input type for the recommendEvents function.
 * - RecommendEventsOutput - The return type for the recommendEvents function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendEventsInputSchema = z.object({
  registeredEvents: z
    .array(z.string())
    .describe('List of event titles the user has registered for.'),
});
export type RecommendEventsInput = z.infer<typeof RecommendEventsInputSchema>;

const RecommendEventsOutputSchema = z.object({
  recommendedEvents: z
    .array(z.string())
    .describe('List of recommended event titles.'),
});
export type RecommendEventsOutput = z.infer<typeof RecommendEventsOutputSchema>;

export async function recommendEvents(input: RecommendEventsInput): Promise<RecommendEventsOutput> {
  return recommendEventsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendEventsPrompt',
  input: {schema: RecommendEventsInputSchema},
  output: {schema: RecommendEventsOutputSchema},
  prompt: `Suggest 2-3 similar upcoming events for a student who registered for the following events:\n\n  {{#each registeredEvents}}- {{{this}}}\n  {{/each}}\n  `,
});

const recommendEventsFlow = ai.defineFlow(
  {
    name: 'recommendEventsFlow',
    inputSchema: RecommendEventsInputSchema,
    outputSchema: RecommendEventsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
