"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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

const chartData = [
  { date: "Mon", pm25: 155 },
  { date: "Tue", pm25: 140 },
  { date: "Wed", pm25: 175 },
  { date: "Thu", pm25: 160 },
  { date: "Fri", pm25: 180 },
  { date: "Sat", pm25: 190 },
  { date: "Sun", pm25: 165 },
];

const chartConfig = {
  pm25: {
    label: "PM2.5",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function HistoricalTrendsChart() {
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
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              domain={[0, 250]}
             />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="pm25" fill="var(--color-pm25)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
