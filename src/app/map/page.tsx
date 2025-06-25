
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { getAqiStationsInBounds } from "@/app/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const AqiHeatmap = dynamic(() => import("@/components/dashboard/aqi-heatmap"), {
  ssr: false,
  loading: () => <Skeleton className="h-[calc(100vh-200px)] w-full" />,
});

interface StationData {
  uid: number;
  aqi: number;
  lat: number;
  lon: number;
}

const INDIA_BOUNDS = {
  minLat: 8,
  maxLat: 37,
  minLon: 68,
  maxLon: 98,
};

export default function MapPage() {
  const [stations, setStations] = useState<StationData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMapData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getAqiStationsInBounds(
          INDIA_BOUNDS.minLat,
          INDIA_BOUNDS.minLon,
          INDIA_BOUNDS.maxLat,
          INDIA_BOUNDS.maxLon
        );

        if (result.status === "ok") {
          const validStations: StationData[] = result.data
            .map((station: any) => ({
              uid: station.uid,
              aqi: parseInt(station.aqi, 10),
              lat: station.lat,
              lon: station.lon,
            }))
            .filter(
              (station: any) =>
                !isNaN(station.aqi) &&
                station.aqi >= 0 &&
                station.lat &&
                station.lon
            );
          setStations(validStations);
        } else {
          setError(
            (result as any).message ||
              "Failed to fetch AQI map data. Please ensure your API key is configured correctly in the .env file."
          );
        }
      } catch (e) {
        setError("An unexpected error occurred while fetching map data.");
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMapData();
  }, []);

  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8">
      <div className="container mx-auto">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Interactive AQI Heatmap</h1>
            <p className="text-muted-foreground">
              Air quality intensity visualization across the region.
            </p>
          </div>
          <div className="h-[calc(100vh-200px)] w-full rounded-lg border shadow-sm overflow-hidden">
            {isLoading && (
              <Skeleton className="h-full w-full" />
            )}
            {error && !isLoading && (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <Alert variant="destructive" className="max-w-md">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error Loading Map</AlertTitle>
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
