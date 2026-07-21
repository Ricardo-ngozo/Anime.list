import { useCallback, useEffect, useState } from 'react';

const weatherCodes = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with hail',
  99: 'Thunderstorm with heavy hail',
};

function formatTime(value) {
  if (!value) return 'Unavailable';
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

function normalizeWeather(location, forecast) {
  const current = forecast.current ?? {};
  const daily = forecast.daily ?? {};

  return {
    city: location.name,
    country: location.country,
    temperature: current.temperature_2m,
    windSpeed: current.wind_speed_10m,
    humidity: current.relative_humidity_2m,
    condition: weatherCodes[current.weather_code] ?? 'Weather data available',
    sunrise: formatTime(daily.sunrise?.[0]),
    sunset: formatTime(daily.sunset?.[0]),
    units: forecast.current_units ?? {},
  };
}

function useWeather(defaultCity = 'Tokyo') {
  const [city, setCity] = useState(defaultCity);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const searchCity = useCallback((nextCity) => {
    const cleanCity = nextCity.trim();
    if (cleanCity) {
      setCity(cleanCity);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchWeather() {
      try {
        setLoading(true);
        setError('');

        const geoUrl = new URL('https://geocoding-api.open-meteo.com/v1/search');
        geoUrl.searchParams.set('name', city);
        geoUrl.searchParams.set('count', '1');
        geoUrl.searchParams.set('language', 'en');
        geoUrl.searchParams.set('format', 'json');

        const geoResponse = await fetch(geoUrl, { signal: controller.signal });
        if (!geoResponse.ok) {
          throw new Error('Unable to find that city right now.');
        }

        const geoData = await geoResponse.json();
        const location = geoData.results?.[0];
        if (!location) {
          throw new Error('No matching city found. Try another search.');
        }

        const forecastUrl = new URL('https://api.open-meteo.com/v1/forecast');
        forecastUrl.searchParams.set('latitude', location.latitude);
        forecastUrl.searchParams.set('longitude', location.longitude);
        forecastUrl.searchParams.set(
          'current',
          'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',
        );
        forecastUrl.searchParams.set('daily', 'sunrise,sunset');
        forecastUrl.searchParams.set('timezone', 'auto');

        const forecastResponse = await fetch(forecastUrl, {
          signal: controller.signal,
        });
        if (!forecastResponse.ok) {
          throw new Error('Unable to load weather details.');
        }

        const forecastData = await forecastResponse.json();
        setWeather(normalizeWeather(location, forecastData));
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message || 'Weather data is unavailable.');
          setWeather(null);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchWeather();

    return () => controller.abort();
  }, [city]);

  return { city, weather, loading, error, searchCity };
}

export default useWeather;
