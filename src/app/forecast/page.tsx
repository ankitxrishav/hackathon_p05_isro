
"use client";

import PredictiveForecastChart from "@/components/dashboard/predictive-forecast-chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "@/hooks/use-location";

export default function ForecastPage() {
  const { aqiData, weatherData, isLoading, error, refetch } = useLocation();

  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8">
      <div className="container mx-auto">
        <div className="space-y-6">
           <div className="text-center">
            <h1 className="text-3xl font-bold">Predictive Forecast</h1>
            <p className="text-muted-foreground">
              5-day forecast for AQI, temperature, and humidity.
            </p>
          </div>
          
          {isLoading && <Skeleton className="h-[450px] w-full" />}
          
          {error && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full p-4">
                <Alert variant="destructive" className="max-w-md text-center">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Location & Data Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
                <Button onClick={refetch} className="mt-4">
                  <MapPin className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
            </div>
          )}

          {!isLoading && !error && aqiData && weatherData && (
            <PredictiveForecastChart aqiData={aqiData} weatherData={weatherData} />
          )}
        </div>
      </div>
    </main>
  );
}
