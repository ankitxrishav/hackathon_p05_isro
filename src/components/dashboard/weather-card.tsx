
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Thermometer, Cloud, AlertCircle } from "lucide-react";
import { format } from 'date-fns';
import Image from 'next/image';
import { Button } from "../ui/button";

export default function WeatherCard({ weatherData, aqiData }: { weatherData: any, aqiData: any }) {

    if (!weatherData) {
        return (
            <Card className="bg-destructive/20 backdrop-blur-sm w-full border-destructive">
                <CardContent className="p-6 flex flex-col justify-center items-center h-full text-center">
                    <AlertCircle className="w-10 h-10 text-destructive mb-2" />
                    <h3 className="text-lg font-semibold text-destructive-foreground">Weather Data Unavailable</h3>
                    <p className="text-sm text-destructive-foreground/80">
                        Could not fetch weather data. Please ensure your OpenWeatherMap API key is valid and configured in the .env file.
                    </p>
                </CardContent>
            </Card>
        );
    }
    
    const currentWeatherData = weatherData.list[0];
    const cityName = aqiData.city.name;
    const country = aqiData.city.country;

    return (
        <Card className="bg-card/70 backdrop-blur-sm w-full">
            <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start">
                {/* Left Side */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <MapPin className="text-primary w-5 h-5" />
                        <span className="text-lg font-semibold">{cityName}, {country}</span>
                    </div>
                    <div>
                        <p className="text-7xl font-bold">{Math.round(currentWeatherData.main.temp)}°C</p>
                        <p className="text-muted-foreground">
                            High: {Math.round(currentWeatherData.main.temp_max)}° / Low: {Math.round(currentWeatherData.main.temp_min)}°
                        </p>
                    </div>
                    <p className="text-muted-foreground">{format(new Date(), 'eeee, d MMM yyyy')}</p>
                </div>

                {/* Right Side */}
                <div className="flex flex-col items-center md:items-end mt-4 md:mt-0">
                     <Image 
                        src={`https://openweathermap.org/img/wn/${currentWeatherData.weather[0].icon}@4x.png`}
                        alt={currentWeatherData.weather[0].description}
                        width={160}
                        height={160}
                    />
                    <p className="text-2xl font-semibold capitalize">{currentWeatherData.weather[0].description}</p>
                    <p className="text-muted-foreground">Feels like {Math.round(currentWeatherData.main.feels_like)}°</p>
                </div>
            </CardContent>
        </Card>
    );
}
