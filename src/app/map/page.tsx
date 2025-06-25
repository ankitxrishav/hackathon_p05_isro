"use client";

import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";

const AqiMap = dynamic(() => import("@/components/dashboard/aqi-map"), {
  ssr: false,
  loading: () => <Skeleton className="h-[580px] w-full" />,
});

export default function MapPage() {
  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8">
      <div className="container mx-auto">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Live AQI Map</h1>
            <p className="text-muted-foreground">
              Real-time air quality visualization across different cities.
            </p>
          </div>
          <AqiMap />
        </div>
      </div>
    </main>
  );
}
