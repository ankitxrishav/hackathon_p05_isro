
"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { getAqiStationsInBounds } from "@/app/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Grid3x3 } from "lucide-react";
import AqiHeatmap from "@/components/dashboard/aqi-heatmap";

interface StationData {
  uid: number;
  aqi: number;
  lat: number;
  lon: number;
  city: string;
}

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
            <h1 className="text-3xl font-bold">Interactive AQI Heatmap</h1>
            <p className="text-muted-foreground">
              Color-coded air quality visualization across different cities.
            </p>
          </div>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                  <Grid3x3 className="w-5 h-5 text-primary" />
                  <CardTitle>AQI Heatmap</CardTitle>
              </div>
              <CardDescription>
                Live air quality readings. Filter by city name.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
              )}
              {error && !isLoading && (
                  <div className="bg-background/80 flex flex-col items-center justify-center p-4 text-center z-10">
                    <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
                    <p className="text-destructive text-sm">{error}</p>
                  </div>
              )}
              {!isLoading && !error && <AqiHeatmap stations={stations} />}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
