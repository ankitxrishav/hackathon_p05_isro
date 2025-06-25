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
    healthImplications: 'Air quality is considered satisfactory, and air pollution poses little or no risk.',
    cautionaryStatement: 'Enjoy your usual outdoor activities.',
  },
  {
    category: 'Moderate',
    colorClass: 'bg-aqi-moderate',
    textColor: 'text-aqi-moderate',
    hexColor: '#facc15',
    healthImplications: 'Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution.',
    cautionaryStatement: 'Unusually sensitive people should consider reducing prolonged or heavy exertion.',
  },
  {
    category: 'Unhealthy for Sensitive Groups',
    colorClass: 'bg-aqi-unhealthy-sensitive',
    textColor: 'text-aqi-unhealthy-sensitive',
    hexColor: '#f97316',
    healthImplications: 'Members of sensitive groups may experience health effects. The general public is not likely to be affected.',
    cautionaryStatement: 'People with lung disease, older adults and children are at a greater risk from exposure to ozone, whereas persons with heart and lung disease, older adults and children are at greater risk from the presence of particles in the air.',
  },
  {
    category: 'Unhealthy',
    colorClass: 'bg-aqi-unhealthy',
    textColor: 'text-aqi-unhealthy',
    hexColor: '#ef4444',
    healthImplications: 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.',
    cautionaryStatement: 'Everyone should reduce prolonged or heavy exertion. It’s a good idea to take more breaks and do less intense activities.',
  },
  {
    category: 'Very Unhealthy',
    colorClass: 'bg-aqi-very-unhealthy',
    textColor: 'text-aqi-very-unhealthy',
    hexColor: '#a855f7',
    healthImplications: 'Health alert: everyone may experience more serious health effects.',
    cautionaryStatement: 'Everyone should avoid all outdoor exertion.',
  },
  {
    category: 'Hazardous',
    colorClass: 'bg-aqi-hazardous',
    textColor: 'text-aqi-hazardous',
    hexColor: '#b91c1c',
    healthImplications: 'Health warnings of emergency conditions. The entire population is more likely to be affected.',
    cautionaryStatement: 'Everyone should avoid all physical activity outdoors.',
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
