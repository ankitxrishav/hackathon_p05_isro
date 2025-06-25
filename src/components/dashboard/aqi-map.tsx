"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Map } from "lucide-react";
import { getAqiInfo } from "@/lib/aqi";

interface AqiMarkerProps {
  aqi: number;
  city: string;
  position: { top: string; left: string };
}

const AqiMarker = ({ aqi, city, position }: AqiMarkerProps) => {
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

const mockLocations: AqiMarkerProps[] = [
  { city: "Mumbai", aqi: 178, position: { top: "65%", left: "30%" } },
  { city: "Delhi", aqi: 250, position: { top: "40%", left: "45%" } },
  { city: "Bangalore", aqi: 85, position: { top: "80%", left: "48%" } },
  { city: "Kolkata", aqi: 195, position: { top: "55%", left: "80%" } },
  { city: "Chennai", aqi: 92, position: { top: "82%", left: "60%" } },
  { city: "Jaipur", aqi: 160, position: { top: "45%", left: "38%" } },
];

export default function AqiMap() {
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
            data-ai-hint="map city"
          />
          <div className="absolute inset-0">
            {mockLocations.map((loc) => (
              <AqiMarker key={loc.city} {...loc} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
