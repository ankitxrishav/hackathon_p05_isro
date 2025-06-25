
"use client";

import L from "leaflet";
import "leaflet.heat";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useEffect } from "react";

interface StationData {
  uid: number;
  aqi: number;
  lat: number;
  lon: number;
}

interface HeatmapLayerProps {
  points: [number, number, number][];
}

const HeatmapLayer = ({ points }: HeatmapLayerProps) => {
  const map = useMap();

  useEffect(() => {
    if (!map || typeof window === 'undefined') return;

    const heatLayer = (L as any).heatLayer(points, {
        radius: 25,
        max: 200, // Cap intensity for better visualization
        blur: 40,
        gradient: {
            0.1: '#22c55e', // green
            0.5: '#facc15', // yellow
            0.8: '#f97316', // orange
            1.0: '#ef4444'  // red
        }
    }).addTo(map);

    return () => {
        map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
};


export default function AqiHeatmap({ stations }: { stations: StationData[] }) {
  const points: [number, number, number][] = stations.map((station) => [
    station.lat,
    station.lon,
    station.aqi,
  ]);

  return (
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
      <HeatmapLayer points={points} />
    </MapContainer>
  );
}
