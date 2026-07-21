import { useState } from 'react';
import ApiErrorMessage from '../components/ApiErrorMessage.jsx';
import Loader from '../components/Loader.jsx';
import useWeather from '../hooks/useWeather.js';

// Edit this text to personalize your weather page.
const weatherText = {
  smallTitle: 'Open-Meteo weather search',
  title: 'Weather Dashboard',
  label: 'Search city',
  placeholder: 'Try Cape Town, Tokyo, London...',
  button: 'View Weather',
  loading: 'Loading weather...',
  errorTitle: 'Unable to load weather.',
};

function Weather() {
  const { city, weather, loading, error, searchCity } = useWeather('Tokyo');
  const [query, setQuery] = useState(city);

  function handleSubmit(event) {
    event.preventDefault();
    searchCity(query);
  }

  return (
    <main className="nexus-page data-page">
      <section className="data-header">
        <img
          className="page-art page-art--weather"
          src="/painting-blindfold.png"
          alt=""
          aria-hidden="true"
        />
        <p className="nexus-kicker">{weatherText.smallTitle}</p>
        <h1>{weatherText.title}</h1>
        <form className="nexus-search" onSubmit={handleSubmit}>
          <label htmlFor="weather-city">{weatherText.label}</label>
          <div>
            <input
              id="weather-city"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={weatherText.placeholder}
            />
            <button type="submit">{weatherText.button}</button>
          </div>
        </form>
      </section>

      {loading && <Loader label={weatherText.loading} />}
      {error && <ApiErrorMessage title={weatherText.errorTitle} message={error} />}

      {weather && !loading && !error && (
        <section className="weather-panel">
          <article className="weather-hero-card">
            <p>{weather.city}, {weather.country}</p>
            <h2>
              {Math.round(weather.temperature)}
              {weather.units.temperature_2m}
            </h2>
            <span>{weather.condition}</span>
          </article>

          <div className="metric-grid">
            <article className="metric-card">
              <span>Wind speed</span>
              <strong>
                {weather.windSpeed} {weather.units.wind_speed_10m}
              </strong>
            </article>
            <article className="metric-card">
              <span>Humidity</span>
              <strong>
                {weather.humidity ?? 'Unavailable'}
                {weather.humidity == null ? '' : weather.units.relative_humidity_2m}
              </strong>
            </article>
            <article className="metric-card">
              <span>Sunrise</span>
              <strong>{weather.sunrise}</strong>
            </article>
            <article className="metric-card">
              <span>Sunset</span>
              <strong>{weather.sunset}</strong>
            </article>
          </div>
        </section>
      )}
    </main>
  );
}

export default Weather;
