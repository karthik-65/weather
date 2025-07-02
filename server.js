require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = 5000;
const API_KEY = process.env.WEATHER_API_KEY;

// Route for weather by location (lat, lon) or city name
app.get('/weather', async (req, res) => {
    const { lat, lon, city } = req.query;
    
    let url = '';
    if (city) {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    } else if (lat && lon) {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    } else {
        return res.status(400).json({ error: "Provide a city name or coordinates (lat, lon)." });
    }

    try {
        console.log("Fetching weather from:", url);  // ✅ Log the request URL
        const response = await axios.get(url);
        console.log("Weather Data:", response.data); // ✅ Log the API response
        res.json(response.data);
    } catch (error) {
        console.error("API Error:", error.response?.data || error.message); // ✅ Log the error
        res.status(500).json({ error: "Failed to fetch weather data" });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
