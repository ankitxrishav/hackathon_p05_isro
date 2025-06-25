"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BrainCircuit, Loader2, Sparkles } from "lucide-react";
import { getAqiPrediction } from "@/app/actions";

const formSchema = z.object({
  location: z.string().min(1, { message: "Location is required." }),
  historicalAqiData: z.string().min(1, { message: "Historical AQI data is required." }),
  weatherData: z.string().min(1, { message: "Weather data is required." }),
});

export default function AqiForecast() {
  const [prediction, setPrediction] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "New Delhi",
      historicalAqiData: "Last 7 days AQI ranged from 120 to 180, with high PM2.5 levels in the evenings.",
      weatherData: "Current temperature is 25°C, humidity at 60%, wind speed 5 km/h from the northwest. No rain expected.",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setPrediction("");
    try {
      const result = await getAqiPrediction(values);
      setPrediction(result.forecast);
    } catch (error) {
      setPrediction("Failed to get prediction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-primary" />
            <CardTitle>Predictive Forecast</CardTitle>
        </div>
        <CardDescription>
          AI-powered 24-72 hour air quality forecast.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., New Delhi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="historicalAqiData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Historical AQI Data</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe past AQI trends..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weatherData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Weather Data</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe current weather conditions..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Predicting...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Forecast
                </>
              )}
            </Button>
          </form>
        </Form>
        {prediction && (
          <div className="mt-4 rounded-lg border bg-secondary/50 p-4 text-sm">
            <h4 className="font-semibold mb-2">AI Forecast:</h4>
            <p className="text-secondary-foreground">{prediction}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
