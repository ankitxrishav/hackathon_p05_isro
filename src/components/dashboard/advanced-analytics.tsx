"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Rocket } from "lucide-react";

export default function AdvancedAnalytics() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Rocket className="w-5 h-5 text-primary" />
          <CardTitle>Advanced Analytics</CardTitle>
        </div>
        <CardDescription>
          Geospatial tools for deeper insights.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="geocoding">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="geocoding">Geocoding</TabsTrigger>
            <TabsTrigger value="lulc">LULC Stats</TabsTrigger>
          </TabsList>
          <TabsContent value="geocoding">
            <div className="space-y-4 pt-4">
              <p className="text-sm text-muted-foreground">
                Convert Latitude/Longitude to village names for rural targeting.
              </p>
              <div className="space-y-2">
                <Label htmlFor="lat">Latitude</Label>
                <Input id="lat" placeholder="e.g., 28.6139" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lng">Longitude</Label>
                <Input id="lng" placeholder="e.g., 77.2090" />
              </div>
              <Button className="w-full" variant="outline">
                Geocode
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="lulc">
            <div className="space-y-4 pt-4">
              <p className="text-sm text-muted-foreground">
                Visualize Land Use/Land Cover (LULC) statistics for an Area of Interest (AOI).
              </p>
              <div className="space-y-2">
                <Label htmlFor="aoi">Area of Interest (GeoJSON)</Label>
                <Input id="aoi" placeholder="Enter GeoJSON coordinates" />
              </div>
              <Button className="w-full" variant="outline">
                Get LULC Stats
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
