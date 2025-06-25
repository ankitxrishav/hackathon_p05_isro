
"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getAqiInfo } from '@/lib/aqi';
import { Search } from 'lucide-react';

interface StationData {
  uid: number;
  aqi: number;
  lat: number;
  lon: number;
  city: string;
}

const getTextColorForBg = (hexColor: string) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const luma = 0.299 * r + 0.587 * g + 0.114 * b;
    return luma > 128 ? 'text-black' : 'text-white';
};

const StationCard = ({ station }: { station: StationData }) => {
    const { hexColor, category } = getAqiInfo(station.aqi);
    const textColor = getTextColorForBg(hexColor);
    
    return (
        <Card style={{ backgroundColor: hexColor }} className={`border-0 ${textColor}`}>
            <CardContent className="p-4 flex flex-col justify-between h-full">
                <div>
                    <span className="text-3xl font-bold">{station.aqi}</span>
                    <span className="text-xs ml-1">AQI</span>
                </div>
                <div className="mt-2 text-right">
                    <p className="font-semibold truncate" title={station.city}>{station.city}</p>
                    <p className="text-xs opacity-80">{category}</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default function AqiHeatmap({ stations }: { stations: StationData[] }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredStations = useMemo(() => {
        if (!searchTerm) return stations;
        return stations.filter(station =>
            station.city.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [stations, searchTerm]);

    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search by city..."
                    className="pl-10 w-full md:w-1/2 lg:w-1/3"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {filteredStations.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredStations.map(station => (
                        <StationCard key={station.uid} station={station} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 text-muted-foreground">
                    <p>No stations found for "{searchTerm}".</p>
                </div>
            )}
        </div>
    );
}
