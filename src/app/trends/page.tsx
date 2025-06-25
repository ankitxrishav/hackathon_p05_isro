"use client";

import { useState, useEffect, useCallback } from "react";
import HistoricalTrendsChart from "@/components/dashboard/historical-trends-chart";
import { getAqiDataForLocation } from "../actions";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TrendsPage() {
  const [aqiData, setAqiData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleFetchData = useCallback(async (lat: number, lon: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getAqiDataForLocation(lat, lon);
      if (result.status === "ok") {
        setAqiData(result.data);
      } else {
        setError((result as any).message || result.data || "Could not fetch AQI data.");
        setAqiData(null);
      }
    } catch (e: any) {
      console.error(e);
      setError("An unexpected error occurred while fetching data.");
      setAqiData(null);
    } finally {
      setIsLoading(false);
    }
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
          errorMessage = "Location access denied. To use this app, please enable location permissions for this site in your browser's settings and then click 'Try Again'.";
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
    <main className="flex-1 p-4 md:p-6 lg:p-8">
      <div className="container mx-auto">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Historical Trends</h1>
            <p className="text-muted-foreground">
              Analyze past air quality data for any location.
            </p>
          </div>
          <div className="p-4 border-2 border-dashed rounded-lg bg-card/60 backdrop-blur-xl">
            <p className="text-center text-muted-foreground">
              City & Pollutant Filters (Coming Soon)
            </p>
          </div>
          
          {isLoading && <Skeleton className="h-[350px] w-full" />}
          
          {error && !isLoading && (
            <div className="flex flex-col items-center justify-center p-4">
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

          {!isLoading && !error && <HistoricalTrendsChart aqiData={aqiData} />}
        </div>
      </div>
    </main>
  );
}