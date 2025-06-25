
"use server";

import type { z } from "genkit/zod";
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

async function fetchWithToken(url: string, token: string | undefined, tokenName: string, isJson: boolean = true) {
  if (!token) {
    const errorMessage = `${tokenName} is not set in the .env file.`;
    console.error(errorMessage);
    return { status: 'error', data: errorMessage };
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
        const errorData = isJson ? await response.json() : await response.text();
        console.error(`API Error for ${tokenName}: ${response.status}`, errorData);
        return { status: 'error', cod: response.status, message: errorData?.data || errorData?.message || `Failed to fetch data from API. Status: ${response.status}` };
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching from ${tokenName} API:`, error);
    return { status: 'error', cod: '500', message: 'An unexpected error occurred while fetching data.' };
  }
}

export async function getAqiDataForLocation(lat: number, lon: number) {
  const token = process.env.AQI_API_TOKEN;
  return fetchWithToken(`https://api.waqi.info/feed/geo:${lat};${lon}/?token=${token}`, token, 'AQI_API_TOKEN');
}

export async function getWeatherDataForLocation(lat: number, lon: number) {
  const token = process.env.OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${token}&units=metric`;
  return fetchWithToken(url, token, 'OPENWEATHER_API_KEY');
}

export async function getAqiStationsInBounds(lat1: number, lon1: number, lat2: number, lon2: number) {
  const token = process.env.AQI_API_TOKEN;
  const url = `https://api.waqi.info/map/bounds/?latlng=${lat1},${lon1},${lat2},${lon2}&token=${token}`;
  return fetchWithToken(url, token, 'AQI_API_TOKEN');
}
