
"use client";

import { useState, useEffect } from "react";
import { getAqiStationsInBounds } from "@/app/actions";
import { Skeleton } from "@/components/ui/skeleton";
import AqiHeatmap from "@/components/dashboard/aqi-heatmap";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

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
                    <h1 className="text-3xl font-bold">Interactive AQI Heatmap</h1>
                    <p className="text-muted-foreground">
                        Real-time air quality visualization across monitoring stations.
                    </p>
                </div>

                {isLoading && (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                )}
                
                {error && !isLoading && (
                  <Alert variant="destructive" className="max-w-md mx-auto">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Error Fetching Data</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {!isLoading && !error && stations && stations.length > 0 && (
                  <AqiHeatmap stations={stations} />
                )}
            </div>
        </div>
    </main>
  );
}
