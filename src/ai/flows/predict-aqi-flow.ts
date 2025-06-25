'use server';
/**
 * @fileOverview Predicts air quality for the next 24-72 hours based on historical data and weather conditions.
 *
 * - predictAirQuality - A function that predicts air quality.
 * - PredictAirQualityInput - The input type for the predictAirQuality function.
 * - PredictAirQualityOutput - The return type for the predictAirQuality function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictAirQualityInputSchema = z.object({
  location: z.string().describe('The location for which to predict air quality.'),
  historicalAqiData: z.string().describe('Historical AQI data for the location.'),
  weatherData: z.string().describe('Current weather data for the location.'),
});
export type PredictAirQualityInput = z.infer<typeof PredictAirQualityInputSchema>;

const PredictAirQualityOutputSchema = z.object({
  forecast: z.string().describe('A 24-72 hour air quality forecast for the location.'),
});
export type PredictAirQualityOutput = z.infer<typeof PredictAirQualityOutputSchema>;

export async function predictAirQuality(input: PredictAirQualityInput): Promise<PredictAirQualityOutput> {
  return predictAirQualityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictAirQualityPrompt',
  input: {schema: PredictAirQualityInputSchema},
  output: {schema: PredictAirQualityOutputSchema},
  prompt: `You are an expert in air quality prediction.

  Based on the historical AQI data and current weather data for the specified location, provide a 24-72 hour air quality forecast.

  Location: {{{location}}}
  Historical AQI Data: {{{historicalAqiData}}}
  Weather Data: {{{weatherData}}}

  Forecast:`,
});

const predictAirQualityFlow = ai.defineFlow(
  {
    name: 'predictAirQualityFlow',
    inputSchema: PredictAirQualityInputSchema,
    outputSchema: PredictAirQualityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
