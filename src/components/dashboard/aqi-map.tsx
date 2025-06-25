
"use client";

import { getAqiInfo } from "@/lib/aqi";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

interface StationData {
  uid: number;
  aqi: number;
  lat: number;
  lon: number;
  city: string;
}

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

export default function AqiMap({ stations }: { stations: StationData[] }) {
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
    </MapContainer>
  );
}
