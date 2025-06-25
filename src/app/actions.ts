
"use server";

async function fetchWithToken(url: string, tokenName: string) {
  const token = process.env[tokenName];
  if (!token) {
    const errorMessage = `${tokenName} is not set in the .env file.`;
    console.error(errorMessage);
    return { data: null, error: errorMessage };
  }

  const finalUrl = url.replace(`{${tokenName}}`, token);

  try {
    const response = await fetch(finalUrl, { next: { revalidate: 3600 } }); // Cache for 1 hour
    const responseData = await response.json();

    if (!response.ok) {
        const message = responseData?.data || responseData?.message || `API Error: ${response.status}`;
        console.error(`API Error for ${tokenName}: ${response.status}`, message);
        return { data: null, error: message };
    }
    
    // Handle API-specific success/error structures
    if (responseData.status && responseData.status !== 'ok') {
      return { data: null, error: responseData.data || 'The API returned an error.' };
    }

    if (responseData.cod && String(responseData.cod) !== '200') {
      return { data: null, error: responseData.message || 'The weather API returned an error code.' };
    }
    
    // The WAQI API wraps its primary result in a `data` property.
    // Other APIs (like OpenWeather) do not. This handles both cases.
    const data = responseData.data || responseData;

    return { data, error: null };
  } catch (error) {
    console.error(`Error fetching from ${tokenName} API:`, error);
    return { data: null, error: 'An unexpected error occurred while fetching data.' };
  }
}


export async function getAqiDataForLocation(lat: number, lon: number) {
  return fetchWithToken(`https://api.waqi.info/feed/geo:${lat};${lon}/?token={AQI_API_TOKEN}`, 'AQI_API_TOKEN');
}

export async function getWeatherDataForLocation(lat: number, lon: number) {
  return fetchWithToken(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid={OPENWEATHER_API_KEY}&units=metric`, 'OPENWEATHER_API_KEY');
}

export async function getAqiStationsInBounds(lat1: number, lon1: number, lat2: number, lon2: number) {
  return fetchWithToken(`https://api.waqi.info/map/bounds/?latlng=${lat1},${lon1},${lat2},${lon2}&token={AQI_API_TOKEN}`, 'AQI_API_TOKEN');
}

// NOTE: The two functions below use fictional API endpoints.
// You will need to replace the URLs with your actual geocoding and LULC services.

export async function getGeocodeForCoords(lat: number, lon: number): Promise<{village?: string; error?: string}> {
  const apiKey = process.env.VILLAGE_GEOCODING_API_KEY;
  if (!apiKey) {
    return { error: "VILLAGE_GEOCODING_API_KEY not configured in .env file." };
  }
  try {
    const response = await fetch(`https://api.fictional-geocoder.com/v1/reverse?lat=${lat}&lon=${lon}&apiKey=${apiKey}`);
    if (!response.ok) {
      const errorData = await response.text();
      return { error: `Geocoding API error: ${response.status} - ${errorData}` };
    }
    const data = await response.json();
    return { village: data.villageName || "Unknown Location" };
  } catch (error) {
    console.error("Geocoding fetch error:", error);
    return { error: "Failed to fetch geocoding data due to a network or server error." };
  }
}

export async function getLulcStats(geojson: string): Promise<{stats?: any; error?: string}> {
    const apiKey = process.env.LULC_API_KEY;
    if (!apiKey) {
        return { error: "LULC_API_KEY not configured in .env file." };
    }
    try {
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
        return { stats: data.statistics };
    } catch (error) {
        console.error("LULC stats fetch error:", error);
        if (error instanceof SyntaxError) {
          return { error: "Invalid GeoJSON format. Please check your input." };
        }
        return { error: "Failed to fetch LULC stats due to a network or server error." };
    }
}
