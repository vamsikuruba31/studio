'use server';

/**
 * @fileOverview AI agent to suggest catchy event captions.
 *
 * - suggestEventCaption - A function that suggests an event caption.
 * - SuggestEventCaptionInput - The input type for the suggestEventCaption function.
 * - SuggestEventCaptionOutput - The return type for the suggestEventCaption function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestEventCaptionInputSchema = z.object({
  eventTitle: z.string().describe('The title of the event.'),
  eventDescription: z.string().describe('The description of the event.'),
  eventDepartment: z.string().describe('The department organizing the event.'),
});
export type SuggestEventCaptionInput = z.infer<typeof SuggestEventCaptionInputSchema>;

const SuggestEventCaptionOutputSchema = z.object({
  caption: z.string().describe('A catchy one-line caption for the event.'),
});
export type SuggestEventCaptionOutput = z.infer<typeof SuggestEventCaptionOutputSchema>;

export async function suggestEventCaption(input: SuggestEventCaptionInput): Promise<SuggestEventCaptionOutput> {
  return suggestEventCaptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestEventCaptionPrompt',
  input: {schema: SuggestEventCaptionInputSchema},
  output: {schema: SuggestEventCaptionOutputSchema},
  prompt: `You are an expert marketing copywriter specializing in creating catchy event captions.

  Generate a one-line catchy event description for an event with the following details:

  Title: {{{eventTitle}}}
  Description: {{{eventDescription}}}
  Department: {{{eventDepartment}}}
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
