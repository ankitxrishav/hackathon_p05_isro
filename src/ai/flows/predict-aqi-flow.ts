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

const ForecastBreakdownSchema = z.object({
    day: z.string().describe("The day of the week for the forecast (e.g., 'Tomorrow', 'Friday')."),
    aqi: z.string().describe("The predicted AQI range for the day (e.g., '110-130')."),
    summary: z.string().describe("A brief summary for that day's air quality."),
});

const PredictAirQualityOutputSchema = z.object({
  overallSummary: z.string().describe("A 2-3 sentence high-level summary of the air quality forecast for the next 72 hours."),
  healthRecommendations: z.string().describe("Actionable health recommendations based on the forecast. Use bullet points."),
  dailyForecasts: z.array(ForecastBreakdownSchema).describe("An array of forecasts for the next 3 days."),
});
export type PredictAirQualityOutput = z.infer<typeof PredictAirQualityOutputSchema>;

export async function predictAirQuality(input: PredictAirQualityInput): Promise<PredictAirQualityOutput> {
  return predictAirQualityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictAirQualityPrompt',
  input: {schema: PredictAirQualityInputSchema},
  output: {schema: PredictAirQualityOutputSchema},
  prompt: `You are an expert environmental data scientist specializing in air quality prediction. Your task is to provide a detailed and easy-to-understand 72-hour air quality forecast.

Analyze the provided historical data and weather forecast to identify trends and predict future AQI levels.

**Input Data:**
- **Location:** {{{location}}}
- **Historical & Current AQI Data:** {{{historicalAqiData}}}
- **Weather Forecast Data:** {{{weatherData}}}

**Your Output MUST be in a structured JSON format and include the following:**
1.  **overallSummary**: A 2-3 sentence high-level summary of what to expect over the next 3 days.
2.  **healthRecommendations**: Provide 2-3 bullet points with actionable health advice based on the predicted AQI levels. For example, suggest if it's safe for outdoor activities, if masks are needed, etc.
3.  **dailyForecasts**: An array of predictions for the next 3 days, with each day having:
    - **day**: The name of the day (e.g., Tomorrow, Wednesday).
    - **aqi**: The predicted AQI range (e.g., "155-170").
    - **summary**: A short sentence describing the conditions for that day (e.g., "Air quality will be unhealthy due to increased PM2.5 levels.").

Provide a realistic and scientifically plausible forecast based on the input data. Do not just repeat the input data. Synthesize it to create your prediction.`,
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
