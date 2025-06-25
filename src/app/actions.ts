
"use server";

import { predictAirQuality, type PredictAirQualityInput, type PredictAirQualityOutput } from "@/ai/flows/predict-aqi-flow";

export async function getAqiPrediction(input: PredictAirQualityInput): Promise<PredictAirQualityOutput> {
  try {
    const result = await predictAirQuality(input);
    if (!result || !result.forecast) {
        return { forecast: 'The AI model could not generate a forecast with the provided data. Please try adjusting your inputs.' };
    }
    return result;
  } catch (error) {
    console.error("Error getting AQI prediction:", error);
    return { forecast: "An unexpected error occurred while generating the forecast. Please try again later." };
  }
}
