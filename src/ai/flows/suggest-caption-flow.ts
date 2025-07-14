
'use server';
/**
 * @fileOverview An AI flow to suggest a catchy caption for an event.
 *
 * - suggestEventCaption - A function that generates a caption.
 * - SuggestEventCaptionInput - The input type for the suggestEventCaption function.
 * - SuggestEventCaptionOutput - The return type for the suggestEventCaption function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestEventCaptionInputSchema = z.object({
  title: z.string().describe('The title of the event.'),
  description: z.string().describe('The description of the event.'),
});
export type SuggestEventCaptionInput = z.infer<typeof SuggestEventCaptionInputSchema>;

const SuggestEventCaptionOutputSchema = z.object({
  caption: z.string().describe('A catchy and engaging caption for the event, suitable for social media. Include relevant hashtags.'),
});
export type SuggestEventCaptionOutput = z.infer<typeof SuggestEventCaptionOutputSchema>;

export async function suggestEventCaption(input: SuggestEventCaptionInput): Promise<SuggestEventCaptionOutput> {
  return suggestEventCaptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestEventCaptionPrompt',
  input: {schema: SuggestEventCaptionInputSchema},
  output: {schema: SuggestEventCaptionOutputSchema},
  prompt: `You are a university event marketing expert. Your goal is to generate a short, catchy, and exciting social media caption to promote a campus event.

Event Details:
- Title: {{{title}}}
- Description: {{{description}}}

Generate a caption that is energetic, includes a call to action (like "Don't miss out!" or "See you there!"), and adds 2-3 relevant hashtags.
`,
});

const suggestEventCaptionFlow = ai.defineFlow(
  {
    name: 'suggestEventCaptionFlow',
    inputSchema: SuggestEventCaptionInputSchema,
    outputSchema: SuggestEventCaptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
