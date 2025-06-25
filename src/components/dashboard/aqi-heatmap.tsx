
"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getAqiInfo } from '@/lib/aqi';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

interface Station {
  uid: number;
  lat: number;
  lon: number;
  aqi: string;
  station: {
    name: string;
    time: string;
  };
}

interface AqiHeatmapProps {
  stations: Station[];
}

const AqiCard = ({ station }: { station: Station }) => {
  const aqiValue = parseInt(station.aqi, 10);
  if (isNaN(aqiValue) || aqiValue < 0) return null;

  const aqiInfo = getAqiInfo(aqiValue);

  return (
    <Card
      style={{ backgroundColor: `${aqiInfo.hexColor}40` }} // hex with 25% opacity
      className={cn('border-2', `border-[${aqiInfo.hexColor}]`)}
    >
      <CardContent className="p-3">
        <div className="flex justify-between items-center">
          <p className="text-3xl font-bold">{aqiValue}</p>
          <div
            className={cn(
              'px-2 py-1 rounded-full text-xs font-semibold text-white',
              aqiInfo.colorClass
            )}
            style={{ backgroundColor: aqiInfo.hexColor }}
          >
            {aqiInfo.category}
          </div>
        </div>
        <p className="text-sm font-semibold mt-2 truncate" title={station.station.name}>
          {station.station.name.split(',')[0]}
        </p>
      </CardContent>
      <CardFooter className="p-2 text-xs text-muted-foreground">
        <p className="truncate">Updated: {station.station.time}</p>
      </CardFooter>
    </Card>
  );
};

export default function AqiHeatmap({ stations }: AqiHeatmapProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStations = useMemo(() => {
    return stations.filter(
      (station) =>
        station.station.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        station.aqi !== '-' &&
        !isNaN(parseInt(station.aqi, 10))
    );
  }, [stations, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Filter stations by name..."
          className="w-full rounded-lg bg-card pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredStations.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {filteredStations.map((station) => (
            <AqiCard key={station.uid} station={station} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-center bg-card rounded-lg border border-dashed">
            <h3 className="text-xl font-semibold">No Stations Found</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your search term.</p>
        </div>
      )}
    </div>
  );
};
