
import AqiMap from "@/components/dashboard/aqi-map";

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
