
"use client";

import HistoricalTrendsChart from "@/components/dashboard/historical-trends-chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "@/hooks/use-location";

export default function TrendsPage() {
  const { aqiData, isLoading, error, refetch } = useLocation();

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
                <Button onClick={refetch} className="mt-4">
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
