
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "../ui/button";

const CityWeatherItem = ({ name, temp, icon, country }: { name: string, temp: number, icon: string, country: string }) => (
    <Card className="bg-card/50 border-0 shadow-none">
        <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
                <p className="font-semibold">{name}</p>
                <p className="text-xs text-muted-foreground">{country}</p>
                <p className="text-2xl font-bold">{temp}°</p>
            </div>
            <Image 
                src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                alt="weather"
                width={50}
                height={50}
            />
        </CardContent>
    </Card>
)

export default function OtherCitiesCard() {
    // Mock data for display
    const mockCities = [
        { name: "New York", country: "USA", temp: 14, icon: "01d" },
        { name: "Dubai", country: "UAE", temp: 27, icon: "02d" },
        { name: "London", country: "UK", temp: 16, icon: "04d" },
        { name: "Tokyo", country: "Japan", temp: 26, icon: "10d" },
    ]
    return (
        <Card className="bg-card/70 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base font-medium">Other Cities</CardTitle>
                <Button variant="ghost" size="sm">Show All</Button>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
               {mockCities.map(city => (
                   <CityWeatherItem key={city.name} {...city} />
               ))}
            </CardContent>
        </Card>
    );
}
