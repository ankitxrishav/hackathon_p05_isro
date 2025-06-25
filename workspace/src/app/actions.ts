
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
  if (!token || token === "your_token_here" || token.length < 10) {
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


export async function getGeocodeForCoords(lat: number, lon: number): Promise<{village?: string; error?: string}> {
  const apiKey = process.env.GEOCODING_API_KEY;
  if (!apiKey) {
    return { error: "Geocoding API key not configured in .env file." };
  }
  try {
    // NOTE: This is a fictional API endpoint. Replace with your actual geocoding service.
    const response = await fetch(`https://api.fictional-geocoder.com/v1/reverse?lat=${lat}&lon=${lon}&apiKey=${apiKey}`);
    if (!response.ok) {
      const errorData = await response.text();
      return { error: `Geocoding API error: ${response.status} - ${errorData}` };
    }
    const data = await response.json();
    // Assuming the API returns a response like { "villageName": "Some Village" }
    return { village: data.villageName || "Unknown Location" };
  } catch (error) {
    console.error("Geocoding fetch error:", error);
    return { error: "Failed to fetch geocoding data due to a network or server error." };
  }
}

export async function getLulcStats(geojson: string): Promise<{stats?: any; error?: string}> {
    const apiKey = process.env.LULC_API_KEY;
    if (!apiKey) {
        return { error: "LULC API key not configured in .env file." };
    }
    try {
        // NOTE: This is a fictional API endpoint. Replace with your actual LULC service.
        const response = await fetch(`https://api.fictional-lulc-stats.com/v1/stats`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'X-Api-Key': apiKey
            },
            body: JSON.stringify({ aoi: JSON.parse(geojson) })
        });
        if (!response.ok) {
            const errorData = await response.text();
            return { error: `LULC API error: ${response.status} - ${errorData}` };
        }
        const data = await response.json();
        // Assuming the API returns a response with a 'statistics' object.
        return { stats: data.statistics };
    } catch (error) {
        console.error("LULC stats fetch error:", error);
        if (error instanceof SyntaxError) {
          return { error: "Invalid GeoJSON format. Please check your input." };
        }
        return { error: "Failed to fetch LULC stats due to a network or server error." };
    }
}
