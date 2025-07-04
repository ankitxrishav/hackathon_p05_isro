
"use client";
import HealthAdvisory from "./health-advisory";
import HistoricalTrendsChart from "./historical-trends-chart";
import WeatherCard from "./weather-card";
import HourlyForecast from "./hourly-forecast";
import SunriseCard from "./sunrise-card";
import OtherCitiesCard from "./other-cities-card";
import TodayHighlights from "./today-highlights";

export default function MainDashboard({ aqiData, weatherData }: { aqiData: any, weatherData: any }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto">
        {/* Left/Main Column */}
        <div className="lg:col-span-2 xl:col-span-3 space-y-6">
          <WeatherCard weatherData={weatherData} aqiData={aqiData} />
          <HourlyForecast weatherData={weatherData} />
          <HistoricalTrendsChart aqiData={aqiData} />
        </div>
        {/* Right Sidebar Column */}
        <div className="lg:col-span-1 xl:col-span-1 space-y-6">
          <HealthAdvisory />
          <TodayHighlights weatherData={weatherData} aqiData={aqiData} />
          <SunriseCard weatherData={weatherData} />
          <OtherCitiesCard />
        </div>
      </div>
    </div>
  );
}
