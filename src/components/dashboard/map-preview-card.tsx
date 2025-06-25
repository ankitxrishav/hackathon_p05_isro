
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Map } from "lucide-react";

export function MapPreviewCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
            <Map className="w-5 h-5 text-primary" />
            <CardTitle>Live AQI Map</CardTitle>
        </div>
        <CardDescription>
          Explore real-time air quality data across the region on our interactive map.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 relative">
        <Image
          src="https://placehold.co/800x400.png"
          alt="Map preview"
          width={800}
          height={400}
          className="w-full h-auto opacity-40"
          data-ai-hint="world map"
        />
        <div className="absolute inset-0 flex items-center justify-center">
            <Link href="/map" passHref>
                <Button size="lg">
                    View Live Map
                </Button>
            </Link>
        </div>
      </CardContent>
    </Card>
  )
}
