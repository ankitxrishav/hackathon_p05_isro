
"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Map as MapIcon, AlertTriangle } from "lucide-react";
import { getAqiInfo } from "@/lib/aqi";
import { useEffect, useState } from "react";
import { getAqiStationsInBounds } from "@/app/actions";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Skeleton } from "../ui/skeleton";

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

const createAqiIcon = (aqi: number) => {
    const { hexColor } = getAqiInfo(aqi);
    const displayAqi = aqi > 999 ? '999+' : aqi;

    return L.divIcon({
        html: `<div style="background-color: ${hexColor};" class="h-7 w-7 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white font-bold text-xs">${displayAqi}</div>`,
        className: 'bg-transparent border-0',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -15]
    });
};

const DynamicMarkers = ({ stations }: { stations: StationData[] }) => {
  return (
    <>
      {stations.map((station) => (
        <Marker
          key={station.uid}
          position={[station.lat, station.lon]}
          icon={createAqiIcon(station.aqi)}
        >
          <Popup>
            <b>{station.city}</b>
            <br />
            AQI: {station.aqi}
          </Popup>
        </Marker>
      ))}
    </>
  );
};


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
            <MapContainer 
                center={[22.5, 83.0]} 
                zoom={5} 
                scrollWheelZoom={true} 
                className="h-full w-full z-0"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <DynamicMarkers stations={stations} />
            </MapContainer>

            {isLoading && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
                    <Skeleton className="h-full w-full" />
                </div>
            )}
            {error && (
                <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center p-4 text-center z-10">
                  <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
                  <p className="text-destructive text-sm">{error}</p>
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
