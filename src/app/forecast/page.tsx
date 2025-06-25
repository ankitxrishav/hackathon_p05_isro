import AqiForecast from "@/components/dashboard/aqi-forecast";

export default function ForecastPage() {
  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8">
      <div className="container mx-auto max-w-3xl">
        <div className="space-y-6">
           <div className="text-center">
            <h1 className="text-3xl font-bold">Predictive Forecast</h1>
            <p className="text-muted-foreground">
              AI-powered 24-72 hour air quality forecast.
            </p>
          </div>
          <AqiForecast />
        </div>
      </div>
    </main>
  );
}
