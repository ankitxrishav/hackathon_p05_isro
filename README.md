# bxcd project

An intuitive and comprehensive air quality and weather visualizer designed for real-time monitoring, historical analysis, and predictive forecasting.

## Team

- **Team Name**: bxcd
- **Team Members**: ankit, mehak, ashish, harsh

---

## Core Features

Our platform provides a suite of tools to help users understand and anticipate air quality conditions:

*   **Live Dashboard**: At-a-glance view of the current Air Quality Index (AQI), weather conditions, temperature, humidity, wind speed, and sunrise/sunset times for your current location.
*   **Historical Trends**: Visualize past air quality data with interactive charts, allowing users to analyze trends for key pollutants like PM2.5.
*   **Predictive Forecasts**: A 5-day forecast that combines AQI, temperature, and humidity data, providing a comprehensive look at upcoming environmental conditions.
*   **Health & Advisory Dashboard**: Get clear, actionable health recommendations based on the current AQI level, from "Good" to "Hazardous".
*   **Advanced Geospatial Analytics**:
    *   **Village Geocoding**: Convert latitude/longitude coordinates into specific village names for targeted rural analysis.
    *   **LULC Statistics**: Analyze Land Use/Land Cover (LULC) data for any Area of Interest (AOI) to understand potential pollution sources.

## Tech Stack

This project is built with a modern, performant, and scalable tech stack:

*   **Framework**: [Next.js](https://nextjs.org/) (using the App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **UI Library**: [React](https://react.dev/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Component Library**: [ShadCN UI](https://ui.shadcn.com/)
*   **Data Fetching**: Server Actions & Route Handlers
*   **Charting**: [Recharts](https://recharts.org/)
*   **AI/ML**: [Genkit](https://firebase.google.com/docs/genkit) for predictive modeling (future implementation).

## Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd bxcd-project
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the root of the project and add your API keys. You can get these from the respective service providers.

    ```env
    # From https://aqicn.org/api/
    AQI_API_TOKEN=your_token_here

    # From https://openweathermap.org/api
    OPENWEATHER_API_KEY=your_token_here

    # Fictional APIs for analytics - replace with real services if available
    VILLAGE_GEOCODING_API_KEY=your_token_here
    LULC_API_KEY=your_token_here
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

---

Built with ❤️ for the hackathon.
