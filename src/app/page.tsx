import { Header } from "@/components/layout/header";
import AqiMap from "@/components/dashboard/aqi-map";
import CurrentAqiCard from "@/components/dashboard/current-aqi-card";
import HealthAdvisory from "@/components/dashboard/health-advisory";
import HistoricalTrendsChart from "@/components/dashboard/historical-trends-chart";
import AqiForecast from "@/components/dashboard/aqi-forecast";
import AdvancedAnalytics from "@/components/dashboard/advanced-analytics";

export default function Home() {
  const currentAqi = 155; // Example AQI value

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 p-4 md:p-6 lg:p-8 grid gap-6 grid-cols-1 lg:grid-cols-3 xl:grid-cols-4">
        <div className="lg:col-span-2 xl:col-span-3 space-y-6">
          <div className="animate-in fade-in duration-500">
            <AqiMap />
          </div>
          <div className="animate-in fade-in duration-700">
            <HistoricalTrendsChart />
          </div>
        </div>
        <div className="lg:col-span-1 xl:col-span-1 space-y-6">
          <div className="animate-in fade-in duration-500">
            <CurrentAqiCard aqi={currentAqi} />
          </div>
          <div className="animate-in fade-in duration-700">
            <HealthAdvisory aqi={currentAqi} />
          </div>
          <div className="animate-in fade-in duration-900">
            <AqiForecast />
          </div>
          <div className="animate-in fade-in duration-1000">
            <AdvancedAnalytics />
          </div>
        </div>
      </main>
    </div>
  );
}
