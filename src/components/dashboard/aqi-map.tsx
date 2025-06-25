
"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Map, Loader2, AlertTriangle } from "lucide-react";
import { getAqiInfo } from "@/lib/aqi";
import { useEffect, useState } from "react";
import { getAqiStationsInBounds } from "@/app/actions";

interface StationData {
  uid: number;
  aqi: number;
  city: string;
  position: { top: string; left: string };
}

const AqiMarker = ({ aqi, city, position }: { aqi: number, city: string, position: {top: string, left: string}}) => {
  const { colorClass } = getAqiInfo(aqi);

  return (
    <div
      className="absolute group transform -translate-x-1/2 -translate-y-1/2"
      style={{ top: position.top, left: position.left }}
    >
      <div className="relative flex flex-col items-center">
        <div
          className={`h-6 w-6 rounded-full ${colorClass} border-2 border-white shadow-lg flex items-center justify-center text-white font-bold text-xs`}
        >
          {aqi}
        </div>
        <div className="absolute top-full mt-1.5 hidden group-hover:block transition-all">
          <div className="bg-card text-card-foreground rounded-md px-2 py-1 text-xs shadow-lg whitespace-nowrap">
            {city}
          </div>
        </div>
        <div className={`w-2 h-2 ${colorClass} rounded-full absolute top-0 animate-ping`}></div>
      </div>
    </div>
  );
};

// Bounding box for India for coordinate conversion
const INDIA_BOUNDS = {
  minLat: 8,
  maxLat: 37,
  minLon: 68,
  maxLon: 98,
};

function convertGeoToPercent(lat: number, lon: number) {
  const { minLat, maxLat, minLon, maxLon } = INDIA_BOUNDS;
  const left = ((lon - minLon) / (maxLon - minLon)) * 100;
  const top = ((maxLat - lat) / (maxLat - minLat)) * 100;

  // Clamp values to be within the map boundaries
  return {
    left: `${Math.max(0, Math.min(100, left))}%`,
    top: `${Math.max(0, Math.min(100, top))}%`,
  };
}

export default function AqiMap() {
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
                        .filter((station: any) => !isNaN(station.aqi) && station.aqi >= 0)
                        .map((station: any) => ({
                            uid: station.uid,
                            city: station.city,
                            aqi: station.aqi,
                            position: convertGeoToPercent(station.lat, station.lon)
                        }));
                    setStations(validStations);
                } else {
                    setError(result.message || 'Failed to fetch AQI map data.');
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
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
            <Map className="w-5 h-5 text-primary" />
            <CardTitle>Live AQI Map</CardTitle>
        </div>
        <CardDescription>
          Real-time air quality visualization across different cities.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-[300px] md:h-[450px] rounded-lg overflow-hidden border">
          <Image
            src="https://placehold.co/1200x800.png"
            alt="Map of India"
            layout="fill"
            objectFit="cover"
            className="opacity-50"
            data-ai-hint="map india"
          />
          <div className="absolute inset-0">
             {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-card/50">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            {error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/50 p-4">
                <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
                <p className="text-destructive text-center">{error}</p>
              </div>
            )}
            {!isLoading && !error && stations.map((loc) => (
              <AqiMarker key={loc.uid} aqi={loc.aqi} city={loc.city} position={loc.position} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
