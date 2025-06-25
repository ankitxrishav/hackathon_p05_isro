"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Rocket, Loader2, AlertTriangle } from "lucide-react";
import { getGeocodeForCoords, getLulcStats } from "@/app/actions";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AdvancedAnalytics() {
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [geocodeResult, setGeocodeResult] = useState<string | null>(null);
  const [geocodeLoading, setGeocodeLoading] = useState(false);
  const [geocodeError, setGeocodeError] = useState<string | null>(null);

  const [aoi, setAoi] = useState("");
  const [lulcResult, setLulcResult] = useState<any | null>(null);
  const [lulcLoading, setLulcLoading] = useState(false);
  const [lulcError, setLulcError] = useState<string | null>(null);

  const handleGeocode = async () => {
    setGeocodeLoading(true);
    setGeocodeError(null);
    setGeocodeResult(null);
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    if (isNaN(latNum) || isNaN(lngNum)) {
      setGeocodeError("Invalid latitude or longitude.");
      setGeocodeLoading(false);
      return;
    }

    const result = await getGeocodeForCoords(latNum, lngNum);
    if (result.error) {
      setGeocodeError(result.error);
    } else if (result.village) {
      setGeocodeResult(result.village);
    }
    setGeocodeLoading(false);
  };

  const handleLulc = async () => {
    setLulcLoading(true);
    setLulcError(null);
    setLulcResult(null);
    
    if (!aoi) {
      setLulcError("Area of Interest (GeoJSON) is required.");
      setLulcLoading(false);
      return;
    }

    try {
      JSON.parse(aoi);
    } catch (e) {
      setLulcError("Invalid GeoJSON format.");
      setLulcLoading(false);
      return;
    }

    const result = await getLulcStats(aoi);
    if (result.error) {
      setLulcError(result.error);
    } else if (result.stats) {
      setLulcResult(result.stats);
    }
    setLulcLoading(false);
  };


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
                <Input id="lat" placeholder="e.g., 28.6139" value={lat} onChange={(e) => setLat(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lng">Longitude</Label>
                <Input id="lng" placeholder="e.g., 77.2090" value={lng} onChange={(e) => setLng(e.target.value)} />
              </div>
              <Button className="w-full" variant="outline" onClick={handleGeocode} disabled={geocodeLoading}>
                {geocodeLoading ? <Loader2 className="animate-spin" /> : "Geocode"}
              </Button>
              {geocodeError && <Alert variant="destructive"><AlertTriangle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{geocodeError}</AlertDescription></Alert>}
              {geocodeResult && <div className="mt-4 rounded-lg border bg-secondary/50 p-4 text-sm"><p><span className="font-semibold">Village Name:</span> {geocodeResult}</p></div>}
            </div>
          </TabsContent>
          <TabsContent value="lulc">
            <div className="space-y-4 pt-4">
              <p className="text-sm text-muted-foreground">
                Visualize Land Use/Land Cover (LULC) statistics for an Area of Interest (AOI).
              </p>
              <div className="space-y-2">
                <Label htmlFor="aoi">Area of Interest (GeoJSON)</Label>
                <Textarea id="aoi" placeholder='e.g., { "type": "Polygon", "coordinates": [ ... ] }' value={aoi} onChange={(e) => setAoi(e.target.value)} />
              </div>
              <Button className="w-full" variant="outline" onClick={handleLulc} disabled={lulcLoading}>
                {lulcLoading ? <Loader2 className="animate-spin" /> : "Get LULC Stats"}
              </Button>
              {lulcError && <Alert variant="destructive"><AlertTriangle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{lulcError}</AlertDescription></Alert>}
              {lulcResult && <div className="mt-4 rounded-lg border bg-secondary/50 p-4 text-sm"><h4 className="font-semibold mb-2">LULC Statistics:</h4><pre className="text-xs bg-muted p-2 rounded-md overflow-x-auto">{JSON.stringify(lulcResult, null, 2)}</pre></div>}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
