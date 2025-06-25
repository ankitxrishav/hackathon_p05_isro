
"use client";

import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { getAqiStationsInBounds } from "@/app/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Map as MapIcon } from "lucide-react";

// Dynamically import the map component with SSR disabled
const AqiMap = dynamic(() => import("@/components/dashboard/aqi-map"), {
  ssr: false,
  loading: () => <Skeleton className="h-[450px] w-full" />,
});

// Define the structure for station data
interface StationData {
  uid: number;
  aqi: number;
  lat: number;
  lon: number;
  city: string;
}

// Bounding box for India
const INDIA_BOUNDS = {
    minLat: 8,
    maxLat: 37,
    minLon: 68,
    maxLon: 98,
};

export default function MapPage() {
  const [stations, setStations] = useState<StationData[]>([]);
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

        if (result.status === 'ok') {
          const validStations: StationData[] = result.data
            .map((station: any) => ({
              uid: station.uid,
              city: station.station.name,
              aqi: parseInt(station.aqi, 10),
              lat: station.lat,
              lon: station.lon,
            }))
            .filter((station: any) => !isNaN(station.aqi) && station.aqi >= 0 && station.lat && station.lon);
          setStations(validStations);
        } else {
          setError((result as any).message || 'Failed to fetch AQI map data. Please ensure your API key is configured correctly in the .env file.');
        }
      } catch (e) {
        setError('An unexpected error occurred while fetching map data.');
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
            <h1 className="text-3xl font-bold">Live AQI Map</h1>
            <p className="text-muted-foreground">
              Real-time air quality visualization across different cities.
            </p>
          </div>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                  <MapIcon className="w-5 h-5 text-primary" />
                  <CardTitle>Live AQI Map</CardTitle>
              </div>
              <CardDescription>
                Real-time air quality visualization across different cities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[450px] w-full rounded-lg overflow-hidden border bg-muted relative">
                <AqiMap stations={stations} />
                {isLoading && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
                        <Skeleton className="h-full w-full" />
                    </div>
                )}
                {error && !isLoading && (
                    <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center p-4 text-center z-10">
                      <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
                      <p className="text-destructive text-sm">{error}</p>
                    </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
