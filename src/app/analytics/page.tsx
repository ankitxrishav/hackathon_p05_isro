import AdvancedAnalytics from "@/components/dashboard/advanced-analytics";

export default function AnalyticsPage() {
  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8">
      <div className="container mx-auto max-w-3xl">
        <div className="space-y-6">
           <div className="text-center">
            <h1 className="text-3xl font-bold">Advanced Analytics</h1>
            <p className="text-muted-foreground">
              Geospatial tools for deeper air quality insights.
            </p>
          </div>
          <AdvancedAnalytics />
        </div>
      </div>
    </main>
  );
}
