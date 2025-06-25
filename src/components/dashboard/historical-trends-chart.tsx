"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

const chartConfig = {
  pm25: {
    label: "PM2.5",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;

export default function HistoricalTrendsChart({ aqiData }: { aqiData: any }) {
  const chartData = useMemo(() => {
    if (!aqiData?.forecast?.daily?.pm25) {
      return [];
    }
    return aqiData.forecast.daily.pm25.map((d: any) => ({
      date: new Date(d.day).toLocaleDateString('en-US', { weekday: 'short'}),
      pm25: d.avg,
    })).slice(0, 7); // Show up to 7 days
  }, [aqiData]);

  if (!aqiData) {
      return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <CardTitle>Historical Trends</CardTitle>
                </div>
                <CardDescription>Last 7 days of PM2.5 AQI</CardDescription>
            </CardHeader>
            <CardContent>
                <Skeleton className="h-[250px] w-full" />
            </CardContent>
        </Card>
      )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <CardTitle>Historical Trends</CardTitle>
        </div>
        <CardDescription>PM2.5 AQI forecast for the next 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                domain={['dataMin - 20', 'dataMax + 20']}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar dataKey="pm25" fill="var(--color-pm25)" radius={8} />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="flex items-center justify-center h-[250px] text-muted-foreground">
            Historical forecast data is not available.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
