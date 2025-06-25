import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAqiInfo, type AqiLevel } from "@/lib/aqi";
import { Activity, AirVent, HeartPulse, Shield, AlertTriangle } from "lucide-react";

interface HealthAdvisoryProps {
  aqi: number;
}

const AdvisoryItem = ({ icon, text }: { icon: React.ElementType, text: string }) => {
    const Icon = icon;
    return (
        <div className="flex items-start gap-3">
            <div className="p-1.5 bg-primary/10 rounded-full">
                <Icon className="w-4 h-4 text-primary" />
            </div>
            <p className="text-sm text-foreground flex-1 pt-0.5">{text}</p>
        </div>
    );
};

export default function HealthAdvisory({ aqi }: HealthAdvisoryProps) {
  const aqiInfo: AqiLevel = getAqiInfo(aqi);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <CardTitle>Health Advisory</CardTitle>
        </div>
        <CardDescription>
          {aqiInfo.healthImplications}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 rounded-lg bg-accent/20 border border-accent/30">
            <h4 className="font-semibold text-accent-foreground mb-2">Recommendations</h4>
            <p className="text-sm text-accent-foreground/90">{aqiInfo.cautionaryStatement}</p>
        </div>
        <div className="space-y-3">
            <AdvisoryItem icon={AlertTriangle} text="Sensitive groups should consider wearing a mask outdoors." />
            <AdvisoryItem icon={Activity} text="Reduce prolonged or heavy exertion outdoors." />
            <AdvisoryItem icon={AirVent} text="Consider running an air purifier indoors." />
            <AdvisoryItem icon={HeartPulse} text="Pay attention to symptoms like coughing or shortness of breath." />
        </div>
      </CardContent>
    </Card>
  );
}
