import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAqiInfo, type AqiLevel } from "@/lib/aqi";

interface CurrentAqiCardProps {
  aqi: number;
}

const PollutantDisplay = ({ name, value, unit }: { name: string; value: number; unit: string }) => (
    <div className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-muted/50">
        <span className="text-muted-foreground">{name}</span>
        <span className="font-medium">{value} <span className="text-xs text-muted-foreground">{unit}</span></span>
    </div>
)

export default function CurrentAqiCard({ aqi }: CurrentAqiCardProps) {
  const aqiInfo: AqiLevel = getAqiInfo(aqi);

  return (
    <Card>
      <CardHeader>
        <CardDescription>Current Air Quality</CardDescription>
        <CardTitle className="flex items-center justify-between">
          <span>New Delhi</span>
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
                <PollutantDisplay name="PM2.5" value={65.4} unit="µg/m³" />
                <PollutantDisplay name="PM10" value={98.2} unit="µg/m³" />
                <PollutantDisplay name="O₃" value={32.1} unit="ppb" />
                <PollutantDisplay name="NO₂" value={15.7} unit="ppb" />
                <PollutantDisplay name="SO₂" value={5.3} unit="ppb" />
                <PollutantDisplay name="CO" value={0.8} unit="ppm" />
            </div>
        </div>

      </CardContent>
    </Card>
  );
}
