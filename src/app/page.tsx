"use client";

import { useState, useEffect } from "react";
import AqiMap from "@/components/dashboard/aqi-map";
import CurrentAqiCard from "@/components/dashboard/current-aqi-card";
import HealthAdvisory from "@/components/dashboard/health-advisory";
import { getAqiDataForLocation } from "./actions";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export default function Home() {
  const [aqiData, setAqiData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported by your browser.");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const data = await getAqiDataForLocation(
            position.coords.latitude,
            position.coords.longitude
          );
          if (data && data.status === "ok") {
            setAqiData(data.data);
          } else {
            const errorMessage = typeof data.data === 'string' ? data.data : 'Could not fetch AQI data.';
            setError(`${errorMessage} Ensure your AQI_API_TOKEN is set in the .env file.`);
          }
        } catch (e) {
          setError("Failed to fetch AQI data.");
        } finally {
          setIsLoading(false);
        }
      },
      (geoError) => {
        setError("Unable to retrieve your location. Please grant permission and refresh.");
        setIsLoading(false);
      }
    );
  }, []);

  const currentAqi = aqiData?.aqi;

  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8 grid gap-6 grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 container">
      <div className="lg:col-span-2 xl:col-span-3 space-y-6">
        <div className="animate-in fade-in duration-500">
          <AqiMap />
        </div>
      </div>
      <div className="lg:col-span-1 xl:col-span-1 space-y-6">
        {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        {isLoading ? (
          <>
            <Skeleton className="h-[340px] w-full bg-white/30" />
            <Skeleton className="h-[280px] w-full bg-white/30" />
          </>
        ) : aqiData ? (
          <>
            <div className="animate-in fade-in duration-500">
              <CurrentAqiCard aqiData={aqiData} />
            </div>
            <div className="animate-in fade-in duration-700">
              <HealthAdvisory aqi={currentAqi} />
            </div>
          </>
        ) : null }
      </div>
    </main>
  );
}
