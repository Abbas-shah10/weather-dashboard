import React, { useState } from "react";
import axios from "axios";
import "./WeatherDashboard.css";

const WeatherDashboard = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClick = async (e) => {
    e && e.preventDefault();
    if (!city) return setError("Please enter a city name");
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `http://api.weatherapi.com/v1/current.json?key=6d86e5072c6f4c8ca5420923261701&q=${encodeURIComponent(
          city
        )}`
      );
      setWeatherData(res.data);
    } catch (err) {
      setError("Could not fetch weather. Try a different city.");
      setWeatherData(null);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const formatIcon = (icon) => {
    if (!icon) return null;
    if (icon.startsWith("//")) return `https:${icon}`;
    return icon;
  };

  return (
    <div className="weather-dashboard">
      <header className="wd-header">
        <h1 className="wd-title">Weather Dashboard</h1>
        <p className="wd-sub">
          Beautiful, fast and informative weather overview
        </p>
      </header>

      <form className="wd-search" onSubmit={handleClick}>
        <input
          className="wd-input"
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name (e.g. London)"
        />
        <button className="wd-button" type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <div className="wd-error">{error}</div>}

      {weatherData && weatherData.location ? (
        <section className="wd-card">
          <div className="wd-card-left">
            <div className="wd-location">
              <h2>{weatherData.location.name}</h2>
              <p className="wd-region">{weatherData.location.region}</p>
              <p className="wd-time">{weatherData.location.localtime}</p>
            </div>

            <div className="wd-temp">
              <img
                src={formatIcon(weatherData.current.condition.icon)}
                alt={weatherData.current.condition.text}
                className="wd-icon"
              />
              <div>
                <div className="wd-temp-value">
                  {weatherData.current.temp_c}°C
                </div>
                <div className="wd-condition">
                  {weatherData.current.condition.text}
                </div>
              </div>
            </div>
          </div>

          <div className="wd-card-right">
            <ul className="wd-details">
              <li>Feels like: {weatherData.current.feelslike_c}°C</li>
              <li>Humidity: {weatherData.current.humidity}%</li>
              <li>Wind: {weatherData.current.wind_kph} kph</li>
              <li>Pressure: {weatherData.current.pressure_mb} mb</li>
            </ul>
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default WeatherDashboard;
