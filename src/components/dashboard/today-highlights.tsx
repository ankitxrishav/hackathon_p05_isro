"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAqiInfo } from "@/lib/aqi";
import { Gauge, Wind, Droplets, Sun, Thermometer } from "lucide-react";

const HighlightItem = ({ icon, title, value, unit, description }: { icon: React.ReactNode, title: string, value: string | number, unit?: string, description?: string }) => (
    <Card className="bg-card/50 border-0 shadow-none">
        <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex items-center justify-between">
                {icon}
                <div className="text-right">
                    <p className="text-2xl font-bold">{value} <span className="text-lg font-normal">{unit}</span></p>
                    {description && <p className="text-xs text-muted-foreground">{description}</p>}
                </div>
            </div>
        </CardContent>
    </Card>
)

export default function TodayHighlights({ aqiData, weatherData }: { aqiData: any, weatherData: any }) {
    const aqi = aqiData.aqi;
    const aqiInfo = getAqiInfo(aqi);

    const windSpeed = weatherData.list[0].wind.speed; // m/s
    const humidity = weatherData.list[0].main.humidity;
    const feelsLike = Math.round(weatherData.list[0].main.feels_like);
    
    // UV Index not available in this API endpoint, using AQI as a proxy for example
    const uvIndex = aqi > 150 ? "High" : aqi > 100 ? "Moderate" : "Low";

    return (
        <Card className="bg-card/70 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-base font-medium">Today's Highlights</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                <HighlightItem
                    icon={<Gauge className="w-8 h-8 text-primary" />}
                    title="AQI"
                    value={aqi}
                    description={aqiInfo.category}
                />
                 <HighlightItem
                    icon={<Sun className="w-8 h-8 text-primary" />}
                    title="UV Index"
                    value={uvIndex}
                />
                <HighlightItem
                    icon={<Wind className="w-8 h-8 text-primary" />}
                    title="Wind Status"
                    value={windSpeed.toFixed(1)}
                    unit="m/s"
                />
                <HighlightItem
                    icon={<Droplets className="w-8 h-8 text-primary" />}
                    title="Humidity"
                    value={humidity}
                    unit="%"
                />
                <HighlightItem
                    icon={<Thermometer className="w-8 h-8 text-primary" />}
                    title="Feels Like"
                    value={feelsLike}
                    unit="°C"
                />
            </CardContent>
        </Card>
    );
}
