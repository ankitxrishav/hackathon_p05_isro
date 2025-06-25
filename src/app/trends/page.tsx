import HistoricalTrendsChart from "@/components/dashboard/historical-trends-chart";

export default function TrendsPage() {
  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8">
      <div className="container mx-auto">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Historical Trends</h1>
            <p className="text-muted-foreground">Analyze past air quality data for any location.</p>
          </div>
          <div className="p-4 border-2 border-dashed rounded-lg bg-card/60 backdrop-blur-xl">
            <p className="text-center text-muted-foreground">City & Pollutant Filters (Coming Soon)</p>
          </div>
          <HistoricalTrendsChart />
        </div>
      </div>
    </main>
  );
}
