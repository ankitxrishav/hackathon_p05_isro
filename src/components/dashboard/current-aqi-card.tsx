import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAqiInfo, type AqiLevel } from "@/lib/aqi";

interface CurrentAqiCardProps {
  aqiData: any;
}

const PollutantDisplay = ({ name, value, unit }: { name: string; value: number | undefined; unit: string }) => {
    if (value === undefined) return null;
    return (
        <div className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-muted/50">
            <span className="text-muted-foreground">{name}</span>
            <span className="font-medium">{value.toFixed(1)} <span className="text-xs text-muted-foreground">{unit}</span></span>
        </div>
    )
}

export default function CurrentAqiCard({ aqiData }: CurrentAqiCardProps) {
  const aqi = aqiData.aqi;
  const aqiInfo: AqiLevel = getAqiInfo(aqi);
  const pollutants = aqiData.iaqi;

  return (
    <Card>
      <CardHeader>
        <CardDescription>Current Air Quality</CardDescription>
        <CardTitle className="flex items-center justify-between">
          <span className="truncate">{aqiData.city.name}</span>
          <div className={`flex items-center gap-2 text-lg font-semibold ${aqiInfo.textColor}`}>
            <div className={`w-3 h-3 rounded-full ${aqiInfo.colorClass}`}></div>
            {aqiInfo.category}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center p-6 rounded-lg bg-muted/50">
            <div className="text-center">
                <p className="text-sm text-muted-foreground">US AQI</p>
                <p className={`text-6xl font-bold ${aqiInfo.textColor}`}>{aqi}</p>
            </div>
        </div>
        
        <div>
            <h4 className="mb-2 font-semibold text-sm">Main Pollutants</h4>
            <div className="space-y-1">
                <PollutantDisplay name="PM2.5" value={pollutants.pm25?.v} unit="µg/m³" />
                <PollutantDisplay name="PM10" value={pollutants.pm10?.v} unit="µg/m³" />
                <PollutantDisplay name="O₃" value={pollutants.o3?.v} unit="ppb" />
                <PollutantDisplay name="NO₂" value={pollutants.no2?.v} unit="ppb" />
                <PollutantDisplay name="SO₂" value={pollutants.so2?.v} unit="ppb" />
                <PollutantDisplay name="CO" value={pollutants.co?.v} unit="ppm" />
            </div>
        </div>

      </CardContent>
    </Card>
  );
}
