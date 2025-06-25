
"use client";

import { useLocation } from "@/hooks/use-location";
import { getAqiInfo } from "@/lib/aqi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";

export default function HealthAdvisory() {
  const { aqiData, isLoading } = useLocation();

  if (isLoading) {
    return (
        <Card className="bg-transparent border-0 shadow-none">
            <CardHeader>
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </CardContent>
        </Card>
    )
  }
  
  if (!aqiData?.aqi) {
    return (
        <div className="flex items-center gap-4 text-muted-foreground p-4 bg-muted/50 rounded-lg">
            <AlertTriangle className="h-8 w-8" />
            <div>
                <h4 className="font-semibold">No AQI Data</h4>
                <p className="text-sm">Health advisory cannot be displayed.</p>
            </div>
        </div>
    )
  }

  const aqiInfo = getAqiInfo(aqiData.aqi);

  return (
    <Card 
        style={{ backgroundColor: `${aqiInfo.hexColor}20`, borderColor: aqiInfo.hexColor }} 
        className="border-2 shadow-none"
    >
        <CardHeader>
            <div className="flex items-center gap-3">
                <div 
                    className="p-2 rounded-full"
                    style={{ backgroundColor: aqiInfo.hexColor, color: 'white' }}
                >
                    <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                    <CardTitle className={cn("font-bold", `text-[${aqiInfo.hexColor}]`)} style={{color: aqiInfo.hexColor}}>{aqiInfo.category}</CardTitle>
                    <CardDescription className="font-semibold">AQI: {aqiData.aqi}</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
            <div>
                <h4 className="font-semibold mb-1">Health Implications</h4>
                <p className="text-muted-foreground">{aqiInfo.healthImplications}</p>
            </div>
             <div>
                <h4 className="font-semibold mb-1">Cautionary Statement</h4>
                <p className="text-muted-foreground">{aqiInfo.cautionaryStatement}</p>
            </div>
        </CardContent>
    </Card>
  );
}
