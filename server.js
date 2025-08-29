const express = require("express");
const path = require("path");

// For Node >= 18, fetch is built-in.
// For Node < 18, install node-fetch@2 → npm install node-fetch@2
let fetchFn;
try {
  fetchFn = fetch; // Node 18+
} catch (e) {
  fetchFn = require("node-fetch"); // Fallback
}

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname))); // Serve frontend

// ✅ Replace with your real OpenWeatherMap API Key
const API_KEY = "25ecd7ad6babb84b27651dc7b5f7f63d";

// Weather API endpoint
app.post("/api/weather", async (req, res) => {
  const { city } = req.body;
  if (!city) {
    return res.status(400).json({ error: "City is required" });
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${API_KEY}&units=metric`;

    const response = await fetchFn(url);
    const weatherData = await response.json();

    if (response.status !== 200) {
      return res.status(response.status).json({
        error: weatherData.message || "City not found",
      });
    }

    res.json({
      name: weatherData.name,
      temp: weatherData.main.temp,
      feels_like: weatherData.main.feels_like,
      humidity: weatherData.main.humidity,
      wind: weatherData.wind.speed,
      description: weatherData.weather[0].description,
      icon: weatherData.weather[0].icon,
    });
  } catch (error) {
    console.error("❌ Server error:", error.message);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

// Start backend server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
