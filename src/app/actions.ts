
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

export async function getAqiDataForLocation(lat: number, lon: number) {
  const token = process.env.AQI_API_TOKEN;
  if (!token) {
    console.error("AQI_API_TOKEN is not set or is invalid.");
    return { status: 'error', data: 'Server configuration error: Missing or invalid API token.' };
  }

  try {
    const response = await fetch(`https://api.waqi.info/feed/geo:${lat};${lon}/?token=${token}`);
    if (!response.ok) {
        const errorData = await response.json();
        console.error(`API Error: ${response.status}`, errorData);
        return { status: 'error', data: errorData.data || `Failed to fetch data from AQI API. Status: ${response.status}` };
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching from WAQI API:", error);
    return { status: 'error', data: 'An unexpected error occurred while fetching AQI data.' };
  }
}
