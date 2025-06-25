
"use client";

import MainDashboard from "@/components/dashboard/main-dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "@/hooks/use-location";

export default function Home() {
  const { aqiData, weatherData, isLoading, error, refetch } = useLocation();

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
            <Button onClick={refetch} className="mt-4">
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
