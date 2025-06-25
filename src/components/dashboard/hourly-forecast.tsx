
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import Image from "next/image";

const HourForecast = ({ time, icon, temp }: { time: string; icon: string; temp: string }) => (
    <div className="flex flex-col items-center space-y-1">
        <p className="text-sm text-muted-foreground">{time}</p>
        <Image 
            src={`https://openweathermap.org/img/wn/${icon}@2x.png`} 
            alt="weather icon"
            width={40}
            height={40}
        />
        <p className="font-semibold">{temp}°</p>
    </div>
);

export default function HourlyForecast({ weatherData }: { weatherData: any }) {
    const forecastList = weatherData?.list.slice(0, 7) || [];

    return (
        <Card className="bg-card/70 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-base font-medium text-muted-foreground">Today / Week</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between items-center overflow-x-auto gap-4 pb-2">
                    {forecastList.map((item: any, index: number) => (
                        <div 
                            key={index}
                            className={cn(
                                "p-3 rounded-lg flex flex-col items-center space-y-2 min-w-[60px]",
                                index === 0 ? "bg-primary/20" : ""
                            )}
                        >
                            <span className="text-sm font-medium">{format(new Date(item.dt_txt), "ha")}</span>
                            <Image 
                                src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                                alt={item.weather[0].description}
                                width={40}
                                height={40}
                            />
                            <span className="font-semibold">{Math.round(item.main.temp)}°</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
