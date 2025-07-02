import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";  // ✅ Import CSS
import temperatureIcon from './assets/icons/Thermometer.png';


const WeatherApp = () => {
    const [weather, setWeather] = useState(null);
    const [city, setCity] = useState("");
    const [error, setError] = useState(null);

    // Fetch weather for current location
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    
                    try {
                        const response = await axios.get(`http://localhost:5000/weather?lat=${lat}&lon=${lon}`);
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
    }, []);

    // Fetch weather by city name
    const fetchCityWeather = async () => {
        if (!city) {
            setError("Please enter a city name.");
            return;
        }

        try {
            const response = await axios.get(`http://localhost:5000/weather?city=${city}`);
            setWeather(response.data);
            setError(null);
        } catch (err) {
            setError("City not found or API error.");
        }
    };

    return (
        <div className="app-container">
            {/* 🎥 Video Background */}
            <video autoPlay loop muted className="background-video">
                <source src="/vedios/bgvedio.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            <div className="weather-container">
                <h1>🌤️ Weather </h1>
                {error && <p className="error-message">{error}</p>}

                {/* City Search Input */}
                <div className="input">
                    <input 
                        type="text" 
                        placeholder="Enter city name" 
                        value={city} 
                        onChange={(e) => setCity(e.target.value)}
                    />
                    <button onClick={fetchCityWeather}>Get Weather</button>
                </div>

                {/* Display Weather */}
                {weather ? (
                    <div className="weather-info">
                        <h2>{weather.name} 🌍</h2>
                        <p>
                        <img
                            src={temperatureIcon}
                            alt="Temperature"
                            width="24"
                            height="24"
                            style={{ verticalAlign: 'middle', marginRight: '8px' }}
                        />
                        Temperature: {weather.main.temp}°C
                        </p>
                        <p>🌥️ Weather: {weather.weather[0].description}</p>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
};

export default WeatherApp;
