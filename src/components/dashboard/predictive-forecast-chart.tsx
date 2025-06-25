
"use client";

import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BrainCircuit } from "lucide-react";
import { format, parseISO } from "date-fns";

export default function PredictiveForecastChart({ aqiData, weatherData }: { aqiData: any, weatherData: any }) {
  const chartData = useMemo(() => {
    if (!weatherData?.list || !aqiData?.forecast?.daily?.pm25) {
      return [];
    }

    const aqiForecastMap = new Map();
    aqiData.forecast.daily.pm25.forEach((day: any) => {
        // The date from the API is a simple 'YYYY-MM-DD' string.
        const forecastDate = format(parseISO(day.day), 'yyyy-MM-dd');
        aqiForecastMap.set(forecastDate, day.avg);
    });

    return weatherData.list.map((item: any) => {
        const itemDate = format(new Date(item.dt * 1000), 'yyyy-MM-dd');
        const itemTime = format(new Date(item.dt * 1000), 'ha');
        const dayOfWeek = format(new Date(item.dt * 1000), 'E');

        return {
            time: `${dayOfWeek} ${itemTime}`,
            temp: Math.round(item.main.temp),
            humidity: item.main.humidity,
            aqi: aqiForecastMap.get(itemDate) || null,
        };
    });
  }, [aqiData, weatherData]);

  if (!chartData.length) {
    return (
        <div className="flex items-center justify-center h-[450px] text-muted-foreground bg-card rounded-lg border">
            Forecast data is not available.
        </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-primary" />
            <CardTitle>5-Day Forecast Analysis</CardTitle>
        </div>
        <CardDescription>
            Interactive graph showing AQI (PM2.5), Temperature (°C), and Humidity (%).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
            <AreaChart
                data={chartData}
                margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 12 }} 
                    tickLine={false} 
                    axisLine={false}
                />
                <YAxis yAxisId="left" stroke="hsl(var(--primary))" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} unit="°C" />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--accent))" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} unit=" AQI" />
                <Tooltip
                    contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                    }}
                    labelStyle={{ fontWeight: 'bold' }}
                    formatter={(value: number, name: string) => {
                        let unit = '';
                        if (name === 'Temperature') {
                          unit = '°C';
                        } else if (name === 'Humidity') {
                          unit = '%';
                        } else if (name === 'AQI (PM2.5)') {
                          unit = ' AQI';
                        }
                        return [`${value}${unit}`, name];
                    }}
                />
                <Legend iconType="circle" iconSize={10} />
                <Area yAxisId="left" type="monotone" dataKey="temp" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" name="Temperature" />
                <Area yAxisId="left" type="monotone" dataKey="humidity" stackId="1" stroke="#82ca9d" fill="rgba(130, 202, 157, 0.2)" name="Humidity" />
                <Area yAxisId="right" type="monotone" dataKey="aqi" stackId="1" stroke="hsl(var(--accent))" fill="hsl(var(--accent) / 0.2)" name="AQI (PM2.5)" />
            </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
