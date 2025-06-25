
"use client";

import { useState, useEffect } from "react";
import { getAqiStationsInBounds } from "@/app/actions";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from 'next/dynamic';

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
                <div className="h-[600px] w-full rounded-lg overflow-hidden border bg-muted relative">
                    <AqiHeatmap stations={stations} isLoading={isLoading} error={error} />
                </div>
            </div>
        </div>
    </main>
  );
}
