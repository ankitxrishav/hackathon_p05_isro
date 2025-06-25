
"use client";

import { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

interface Station {
  lat: number;
  lon: number;
  aqi: string;
}

interface HeatmapLayerProps {
  stations: Station[];
}

// This component adds the heatmap layer to the map instance provided by its parent.
const HeatmapLayer = ({ stations }: HeatmapLayerProps) => {
  const map = useMap();

  useEffect(() => {
    if (!map || stations.length === 0) return;

    // Filter out invalid stations and format data for leaflet.heat
    // The intensity is the third value in the array. We normalize AQI for better visualization.
    const points = stations
      .filter(station => station.lat && station.lon && station.aqi && !isNaN(Number(station.aqi)) && Number(station.aqi) > 0)
      .map(station => [station.lat, station.lon, Number(station.aqi) / 300]); // Normalize AQI: 300 is a reasonable upper bound for intensity

    if ((L as any).heatLayer) {
      const heatLayer = (L as any).heatLayer(points, { 
        radius: 25, 
        blur: 15,
        maxZoom: 12,
        max: 1.0, // Corresponds to the normalized AQI
        gradient: {0.1: 'blue', 0.3: 'lime', 0.5: 'yellow', 0.7: 'orange', 1.0: 'red'}
      });

      map.addLayer(heatLayer);

      // Cleanup function to remove the layer when the component unmounts or stations change
      return () => {
        map.removeLayer(heatLayer);
      };
    }

  }, [map, stations]);

  return null; // This component does not render any visible DOM element itself
};


interface AqiHeatmapProps {
  stations: Station[];
}

const AqiHeatmap = ({ stations }: AqiHeatmapProps) => {
  return (
    <MapContainer center={[22.5, 83.0]} zoom={5} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      <HeatmapLayer stations={stations} />
    </MapContainer>
  );
};

export default AqiHeatmap;
