# **App Name**: BreatheEasy

## Core Features:

- AQI Map Visualization: Display real-time Air Quality Index (AQI) using data from various sources like IQAir ('c57cb5f2-764a-4c42-8eea-5fd8cdaa714d'), OpenWeatherMap ('2aee8195971695d903f6c09724c88705'), OpenAQ ('10bd6b567bc354fb98f64f345a5d023be8db3646c088a8f4491c3e46fd62358a'), and WAQI ('5a1d59577e9e0d427bfb0e995a35cf7f3ad1e6c7') APIs. Visualize the AQI on a map with color-coded zones (Green = Good, Red = Hazardous).
- Historical AQI Trends: Show historical AQI trends for selected locations using graphs for PM2.5, NO2, and other pollutants.
- Predictive AQI Forecasts: Use historical AQI and current weather data to provide 24-72 hour air quality forecasts using a tool to interpret trends and incorporate the information.
- Health & Advisory Dashboard: Display health advisories and recommendations based on current AQI levels, such as suggesting to wear a mask or avoid outdoor activities.
- Advanced Location Analytics: Provide users ability to use Village Geocoding / Reverse (Convert lat/lng → village name for rural targeting), the API key is '2513f8457ae21172903e37b44d37a493cda34136'. Also provide LULC AOI Statistics (Visualize land use (urban/agriculture → pollution source) the API key is '569c36ab1e6863cdbc9356e4966fdab4112a8d7b'.

## Style Guidelines:

- Primary color: Soft sky blue (#87CEEB) to evoke a sense of clean air and calm.
- Background color: Very light desaturated blue (#F0F8FF) to provide a clean and airy feel.
- Accent color: Muted orange (#E6A919) to highlight important alerts and calls to action.
- Body and headline font: 'PT Sans' (sans-serif) for a modern and readable interface.
- Use simple, outlined icons to represent different air quality levels and pollution types.
- Employ a clean and intuitive layout that emphasizes key information such as AQI levels and health recommendations. Prioritize map visualization on the main screen.
- Use subtle animations, like a gentle fade-in effect, when updating AQI data to provide a smooth user experience.