// netlify/functions/weather.js

exports.handler = async (event) => {
  try {
    const { city } = JSON.parse(event.body || "{}");

    if (!city) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "City is required" }),
      };
    }

    const API_KEY = process.env.WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${API_KEY}&units=metric`;

    // ✅ Use built-in fetch (no node-fetch needed)
    const response = await fetch(url);
    const weatherData = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: weatherData.message || "City not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        name: weatherData.name,
        temp: weatherData.main.temp,
        feels_like: weatherData.main.feels_like,
        humidity: weatherData.main.humidity,
        wind: weatherData.wind.speed,
        description: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon,
      }),
    };
  } catch (err) {
    console.error("❌ Function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch weather data" }),
    };
  }
};
