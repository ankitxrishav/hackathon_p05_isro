
"use client";

import { useState, useEffect } from "react";
import { getAqiStationsInBounds } from "@/app/actions";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import dynamic from 'next/dynamic';

// Dynamically import the map component to ensure it's client-side only and won't cause SSR issues.
const AqiHeatmap = dynamic(() => import('@/components/dashboard/aqi-heatmap'), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
});

export default function MapPage() {
  const [stations, setStations] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStations() {
      setIsLoading(true);
      setError(null);
      // Fetch stations for a wide area (e.g., India)
      const { data, error } = await getAqiStationsInBounds(6.5, 68.0, 35.5, 97.5);

      if (error) {
        setError(error);
      } else {
        setStations(data);
      }
      setIsLoading(false);
    }

    fetchStations();
  }, []);

  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="container mx-auto">
            <div className="space-y-4">
                 <div className="text-center">
                    <h1 className="text-3xl font-bold">Live AQI Heatmap</h1>
                    <p className="text-muted-foreground">
                        Real-time air quality visualization across monitoring stations.
                    </p>
                </div>
                <div className="h-[600px] w-full rounded-lg overflow-hidden border bg-muted">
                    {isLoading && <Skeleton className="h-full w-full" />}
                    {error && !isLoading && (
                        <div className="flex items-center justify-center h-full p-4">
                            <Alert variant="destructive" className="max-w-md text-center">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Data Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        </div>
                    )}
                    {!isLoading && !error && stations && (
                        <AqiHeatmap stations={stations} />
                    )}
                </div>
            </div>
        </div>
    </main>
  );
}
