
"use client";

import { useState, useEffect, useCallback } from "react";
import MainDashboard from "@/components/dashboard/main-dashboard";
import { getAqiDataForLocation, getWeatherDataForLocation } from "./actions";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [aqiData, setAqiData] = useState<any>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const handleFetchData = useCallback((lat: number, lon: number) => {
    setIsLoading(true);
    setError(null);
    
    Promise.all([
      getAqiDataForLocation(lat, lon),
      getWeatherDataForLocation(lat, lon),
    ]).then(([aqiResponse, weatherResponse]) => {
      
      if (aqiResponse.error) {
        setError(aqiResponse.error);
        setAqiData(null);
      } else {
        setAqiData(aqiResponse.data);
      }

      if (weatherResponse.error) {
         // Use toast for non-critical errors like weather
        toast({
            variant: "destructive",
            title: "Weather Data Error",
            description: weatherResponse.error,
        });
        setWeatherData(null);
      } else {
        setWeatherData(weatherResponse.data);
      }

    }).catch(e => {
      console.error(e);
      setError("An unexpected error occurred while fetching data.");
    }).finally(() => {
      setIsLoading(false);
    });
  }, [toast]);
  
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
    <main className="flex-1 overflow-auto bg-secondary/50">
      {isLoading && (
        <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div className="lg:col-span-2 xl:col-span-3 space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-72 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-72 w-full" />
          </div>
        </div>
      )}
      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center h-full p-4">
            <Alert variant="destructive" className="max-w-md text-center">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Location & Data Error</AlertTitle>
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
