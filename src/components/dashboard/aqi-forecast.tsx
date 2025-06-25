
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Loader2, AlertTriangle } from "lucide-react";
import { getAqiPrediction } from "@/app/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getAqiInfo } from "@/lib/aqi";

export default function AqiForecast({ aqiData, weatherData }: { aqiData: any, weatherData: any }) {
  const [prediction, setPrediction] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!aqiData || !weatherData) {
      return;
    }

    const generatePrediction = async () => {
      setIsLoading(true);
      setError(null);
      setPrediction("");

      try {
        const location = aqiData.city.name;
        
        // Create descriptive strings from the available data for the AI model
        const historicalAqiData = `The current AQI is ${aqiData.aqi} which is considered ${getAqiInfo(aqiData.aqi).category}. The dominant pollutant is ${aqiData.dominentpol}. The API's forecast for the next few days suggests average PM2.5 levels will be around ${aqiData.forecast.daily.pm25.map((d: any) => d.avg).join(', ')}.`;
        const weatherDataString = `Current temperature is ${weatherData.list[0].main.temp}°C with ${weatherData.list[0].weather[0].description}. Humidity is at ${weatherData.list[0].main.humidity}%, and wind speed is ${weatherData.list[0].wind.speed} m/s.`;

        const input = {
          location,
          historicalAqiData,
          weatherData: weatherDataString,
        };
        
        const result = await getAqiPrediction(input);
        if(result.forecast){
            setPrediction(result.forecast);
        } else {
            setError("The AI model could not generate a forecast with the provided data.");
        }
      } catch (e) {
        console.error("Prediction error:", e);
        setError("Failed to get prediction due to an unexpected error.");
      } finally {
        setIsLoading(false);
      }
    };

    generatePrediction();
  }, [aqiData, weatherData]);
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-primary" />
            <CardTitle>Predictive Forecast</CardTitle>
        </div>
        <CardDescription>
          AI-powered 24-72 hour air quality forecast for {aqiData?.city?.name || 'your location'}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center h-24">
            <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Generating AI forecast...</p>
          </div>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {prediction && !isLoading && !error && (
          <div className="mt-4 rounded-lg border bg-secondary/50 p-4 text-sm">
            <h4 className="font-semibold mb-2">AI Forecast:</h4>
            <p className="text-secondary-foreground whitespace-pre-wrap">{prediction}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
