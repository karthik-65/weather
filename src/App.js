import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import temperatureIcon from './assets/icons/Thermometer.png';
import humidityIcon from './assets/icons/humidity.png';
import windIcon from './assets/icons/wind.png';
import earthIcon from './assets/icons/globe.png';
import cloudIcon from './assets/icons/cloudy.png';
import WeatherIcon from './assets/icons/sun.png';

const WeatherApp = () => {
    const [weather, setWeather] = useState(null);
    const [city, setCity] = useState("");
    const [error, setError] = useState(null);

    const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;

                    try {
                        const response = await axios.get(
                            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
                        );
                        setWeather(response.data);
                    } catch (err) {
                        setError("Failed to fetch weather data.");
                    }
                },
                () => setError("Location access denied. Please enable location.")
            );
        } else {
            setError("Geolocation is not supported by this browser.");
        }
    }, [API_KEY]);

    const fetchCityWeather = async () => {
        if (!city) {
            setError("Please enter a city name.");
            return;
        }

        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
            );
            setWeather(response.data);
            setError(null);
        } catch (err) {
            setError("City not found or API error.");
        }
    };

    return (
        <div className="app-container">
            <video autoPlay loop muted className="background-video">
                <source src="/vedios/bgvedio.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            <div className="weather-container">
                <h1>
                    <img
                        src={WeatherIcon}
                        alt="Weather"
                        width="40"
                        height="40"
                        style={{ verticalAlign: 'middle', marginRight: '8px' }}
                    />
                    Weather
                </h1>
                {error && <p className="error-message">{error}</p>}

                <div className="input">
                    <input
                        type="text"
                        placeholder="Enter city name"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                    <button onClick={fetchCityWeather}>Get Weather</button>
                </div>

                {weather ? (
                    <div className="weather-info">
                        <h2>{weather.name}
                            <img src={earthIcon} alt="Location" width="30" height="30" style={{ verticalAlign: 'middle', marginLeft: '10px' }} />
                        </h2>
                        <p><img src={temperatureIcon} alt="Temp" width="24" /> Temperature: {weather.main.temp}°C</p>
                        <p><img src={humidityIcon} alt="Humidity" width="24" /> Humidity: {weather.main.humidity}%</p>
                        <p><img src={windIcon} alt="Wind" width="24" /> Wind Speed: {weather.wind.speed} m/s</p>
                        <p><img src={cloudIcon} alt="Cloud" width="24" /> Weather: {weather.weather[0].description}</p>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
};

export default WeatherApp;
