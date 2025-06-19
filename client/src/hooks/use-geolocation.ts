import { useState } from "react";

export const useGeolocation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const error = "Geolocation is not supported by this browser";
        setError(error);
        reject(new Error(error));
        return;
      }

      setLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLoading(false);
          resolve(position);
        },
        (error) => {
          setLoading(false);
          const message = getGeolocationErrorMessage(error.code);
          setError(message);
          reject(new Error(message));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  };

  const getGeolocationErrorMessage = (code: number): string => {
    switch (code) {
      case 1:
        return "Location access denied by user";
      case 2:
        return "Location position unavailable";
      case 3:
        return "Location request timed out";
      default:
        return "An unknown location error occurred";
    }
  };

  return {
    getCurrentLocation,
    loading,
    error,
  };
};
