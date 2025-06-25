
'use client';

import { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { getAqiDataForLocation, getWeatherDataForLocation, getAqiDataForCity, getWeatherDataForCity } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

type LocationType = { lat: number; lon: number } | { city: string };

interface LocationContextProps {
  location: LocationType | null;
  setLocation: (location: LocationType | null) => void;
  aqiData: any;
  weatherData: any;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  refetch: () => void;
}

export const LocationContext = createContext<LocationContextProps | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<LocationType | null>(null);
  const [aqiData, setAqiData] = useState<any>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFetchData = useCallback(async (loc: LocationType) => {
    setIsLoading(true);
    setError(null);
    setAqiData(null);
    setWeatherData(null);

    let aqiPromise, weatherPromise;

    if ('city' in loc) {
        // Fetch by city
        aqiPromise = getAqiDataForCity(loc.city);
        weatherPromise = getWeatherDataForCity(loc.city);
    } else {
        // Fetch by lat/lon
        aqiPromise = getAqiDataForLocation(loc.lat, loc.lon);
        weatherPromise = getWeatherDataForLocation(loc.lat, loc.lon);
    }
    
    try {
        const [aqiResponse, weatherResponse] = await Promise.all([aqiPromise, weatherPromise]);

        if (aqiResponse.error) {
            const errorMessage = `Could not find data for '${'city' in loc ? loc.city : 'your location'}'. Please check the spelling or try again.`;
            setError(errorMessage);
            setAqiData(null);
        } else {
            setAqiData(aqiResponse.data);
        }

        if (weatherResponse.error) {
            toast({
                variant: "destructive",
                title: "Weather Data Error",
                description: weatherResponse.error,
            });
            setWeatherData(null);
        } else {
            setWeatherData(weatherResponse.data);
        }
    } catch (e) {
        console.error(e);
        setError("An unexpected error occurred while fetching data.");
    } finally {
        setIsLoading(false);
    }
  }, [toast]);

  const getInitialLocation = useCallback(() => {
    setIsLoading(true);
    setError(null);
    if (!("geolocation" in navigator)) {
        setError("Geolocation is not supported. Please use the search bar.");
        setIsLoading(false);
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const newLocation = { lat: position.coords.latitude, lon: position.coords.longitude };
            setLocation(newLocation);
        },
        (geoError) => {
            let errorMessage;
            if (geoError.code === geoError.PERMISSION_DENIED) {
                errorMessage = "Location access denied. Please grant permission or search for a city.";
            } else {
                errorMessage = "Unable to retrieve your location. Please search for a city.";
            }
            setError(errorMessage);
            setIsLoading(false);
        }
    );
  }, []);

  useEffect(() => {
    if (location) {
        handleFetchData(location);
    } else {
        getInitialLocation();
    }
  }, [location]); // Note: removing handleFetchData and getInitialLocation from deps to avoid re-running on every render

  const refetch = useCallback(() => {
    if (location) {
        handleFetchData(location);
    } else {
        getInitialLocation();
    }
  }, [location, handleFetchData, getInitialLocation]);

  const value = {
    location,
    setLocation,
    aqiData,
    weatherData,
    isLoading,
    error,
    clearError: () => setError(null),
    refetch,
  };

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}
