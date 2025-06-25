
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
    Promise.all([
      getAqiDataForLocation(lat, lon),
      getWeatherDataForLocation(lat, lon),
    ]).then(([aqiResult, weatherResult]) => {
      if (aqiResult && aqiResult.status === "ok") {
        setAqiData(aqiResult.data);
      } else {
        setError(aqiResult.data || 'Could not fetch AQI data.');
      }

      if (weatherResult && weatherResult.cod === "200") { // OpenWeather uses 'cod' for status
        setWeatherData(weatherResult);
      } else {
        setError(weatherResult.message || 'Could not fetch weather data.');
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
        let errorMessage = "Unable to retrieve your location. Please grant permission and try again.";
        if (geoError.code === geoError.PERMISSION_DENIED) {
            errorMessage = "Location access was denied. To use this feature, please enable location permissions for this site in your browser settings and then try again."
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
      {!isLoading && !error && aqiData && weatherData && (
        <MainDashboard aqiData={aqiData} weatherData={weatherData} />
      )}
    </main>
  );
}
