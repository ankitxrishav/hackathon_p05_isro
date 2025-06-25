
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sunrise, Sunset } from "lucide-react";
import { format } from 'date-fns';

export default function SunriseCard({ weatherData }: { weatherData: any }) {
    if (!weatherData) {
        return (
            <Card className="bg-card/70 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-base font-medium text-muted-foreground">Sunrise & Sunset</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center items-center h-[124px]">
                    <p className="text-sm text-muted-foreground">Data unavailable</p>
                </CardContent>
            </Card>
        );
    }

    const sunriseTime = weatherData.city.sunrise ? format(new Date(weatherData.city.sunrise * 1000), 'p') : 'N/A';
    const sunsetTime = weatherData.city.sunset ? format(new Date(weatherData.city.sunset * 1000), 'p') : 'N/A';
    
    let dayLength = 'N/A';
    if(weatherData.city.sunrise && weatherData.city.sunset) {
        const diff = weatherData.city.sunset - weatherData.city.sunrise;
        const hours = Math.floor(diff / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        dayLength = `${hours}h ${minutes}m`;
    }


    return (
        <Card className="bg-card/70 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-base font-medium text-muted-foreground">Sunrise & Sunset</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Sunrise className="w-8 h-8 text-yellow-400" />
                        <div>
                            <p className="text-muted-foreground">Sunrise</p>
                            <p className="text-2xl font-semibold">{sunriseTime}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Sunset className="w-8 h-8 text-orange-400" />
                        <div>
                            <p className="text-muted-foreground">Sunset</p>
                            <p className="text-2xl font-semibold">{sunsetTime}</p>
                        </div>
                    </div>
                </div>
                 <p className="text-sm text-center text-muted-foreground">Length of day: {dayLength}</p>
            </CardContent>
        </Card>
    );
}
