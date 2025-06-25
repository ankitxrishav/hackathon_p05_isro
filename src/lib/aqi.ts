export type AqiLevel = {
  category: string;
  colorClass: string;
  textColor: string;
  hexColor: string;
  healthImplications: string;
  cautionaryStatement: string;
};

const levels: AqiLevel[] = [
  {
    category: 'Good',
    colorClass: 'bg-aqi-good',
    textColor: 'text-aqi-good',
    hexColor: '#22c55e',
    healthImplications: 'Air quality is considered satisfactory, with minimal risk.',
    cautionaryStatement: "It's a great day to be active outside.",
  },
  {
    category: 'Moderate',
    colorClass: 'bg-aqi-moderate',
    textColor: 'text-aqi-moderate',
    hexColor: '#facc15',
    healthImplications: 'Air quality is acceptable, but some pollutants may pose a moderate risk for sensitive groups.',
    cautionaryStatement: 'Unusually sensitive people should consider reducing prolonged or heavy exertion outdoors.',
  },
  {
    category: 'Unhealthy for Sensitive Groups',
    colorClass: 'bg-aqi-unhealthy-sensitive',
    textColor: 'text-aqi-unhealthy-sensitive',
    hexColor: '#f97316',
    healthImplications: 'Individuals with respiratory conditions may experience health effects, while others are less likely to be affected.',
    cautionaryStatement: "Sensitive groups should reduce prolonged or heavy exertion. It's OK to be active outside, but take more breaks.",
  },
  {
    category: 'Unhealthy',
    colorClass: 'bg-aqi-unhealthy',
    textColor: 'text-aqi-unhealthy',
    hexColor: '#ef4444',
    healthImplications: 'Everyone may experience health effects, with sensitive groups experiencing more serious effects.',
    cautionaryStatement: 'Everyone should reduce prolonged or heavy exertion outdoors. Take more breaks and do less intense activities.',
  },
  {
    category: 'Very Unhealthy',
    colorClass: 'bg-aqi-very-unhealthy',
    textColor: 'text-aqi-very-unhealthy',
    hexColor: '#a855f7',
    healthImplications: 'This triggers a health alert, with everyone likely to experience more serious health effects.',
    cautionaryStatement: 'Everyone should avoid prolonged or heavy exertion. Consider moving activities indoors or rescheduling.',
  },
  {
    category: 'Hazardous',
    colorClass: 'bg-aqi-hazardous',
    textColor: 'text-aqi-hazardous',
    hexColor: '#b91c1c',
    healthImplications: 'This triggers a health warning of emergency conditions, with the entire population at risk of experiencing serious health effects.',
    cautionaryStatement: 'Everyone should avoid all outdoor physical activity. Remain indoors and keep activity levels low.',
  },
];

export const getAqiInfo = (aqi: number): AqiLevel => {
  if (aqi <= 50) return levels[0];
  if (aqi <= 100) return levels[1];
  if (aqi <= 150) return levels[2];
  if (aqi <= 200) return levels[3];
  if (aqi <= 300) return levels[4];
  return levels[5];
};
