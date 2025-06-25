
"use client";

import { useState, useEffect, useCallback } from "react";
import MainDashboard from "@/components/dashboard/main-dashboard";
import { getAqiDataForLocation, getWeatherDataForLocation } from "./actions";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [aqiData, setAqiData] = useState<any>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleFetchData = useCallback((lat: number, lon: number) => {
    setIsLoading(true);
    setError(null);
    
    Promise.allSettled([
      getAqiDataForLocation(lat, lon),
      getWeatherDataForLocation(lat, lon),
    ]).then(([aqiResult, weatherResult]) => {
      
      if (aqiResult.status === 'fulfilled' && aqiResult.value.status === "ok") {
        setAqiData(aqiResult.value.data);
      } else {
        const errorMessage = aqiResult.status === 'rejected' 
          ? (aqiResult.reason as Error).message 
          : aqiResult.value.data || 'Could not fetch AQI data.';
        setError(errorMessage);
        setAqiData(null);
      }

      if (weatherResult.status === 'fulfilled' && weatherResult.value.cod === "200") {
        setWeatherData(weatherResult.value);
      } else {
         const errorMessage = weatherResult.status === 'rejected' 
            ? (weatherResult.reason as Error).message 
            : weatherResult.value.message || 'Could not fetch weather data.';
        console.error("Weather data fetch failed:", errorMessage);
        setWeatherData(null);
      }

    }).catch(e => {
      console.error(e);
      setError("An unexpected error occurred while fetching data.");
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);
  
  const getLocation = useCallback(() => {
    setIsLoading(true);
    setError(null);
    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported by your browser.");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        handleFetchData(position.coords.latitude, position.coords.longitude);
      },
      (geoError) => {
        let errorMessage;
        if (geoError.code === geoError.PERMISSION_DENIED) {
            errorMessage = "Location access denied. To use this app, please enable location permissions for this site in your browser's settings and then click 'Try Again'."
        } else {
            errorMessage = "Unable to retrieve your location. Please ensure location services are enabled on your device and try again.";
        }
        setError(errorMessage);
        setIsLoading(false);
      }
    );
  }, [handleFetchData]);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  return (
    <main className="flex-1 overflow-auto">
      {isLoading && (
        <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-72 w-full" />
          </div>
        </div>
      )}
      {error && (
        <div className="flex flex-col items-center justify-center h-full p-4">
            <Alert variant="destructive" className="max-w-md text-center">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Location Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button onClick={getLocation} className="mt-4">
              <MapPin className="mr-2 h-4 w-4" />
              Try Again
            </Button>
        </div>
      )}
      {!isLoading && !error && aqiData && (
        <MainDashboard aqiData={aqiData} weatherData={weatherData} />
      )}
    </main>
  );
}
