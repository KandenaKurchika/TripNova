const asyncHandler = require('express-async-handler');
const { getCurrentWeather, getDailyForecast, deriveSafetyNotes } = require('../services/weatherService');

// @route GET /api/weather?lat=&lng=
const current = asyncHandler(async (req, res) => {
  const { lat, lng } = req.query;
  if (!lat || !lng) {
    res.status(422);
    throw new Error('lat and lng are required');
  }
  const weather = await getCurrentWeather(Number(lat), Number(lng));
  res.json({ success: true, weather });
});

// @route GET /api/weather/forecast?lat=&lng=
const forecast = asyncHandler(async (req, res) => {
  const { lat, lng } = req.query;
  const days = await getDailyForecast(Number(lat), Number(lng));
  const safetyNotes = deriveSafetyNotes(days);
  res.json({ success: true, forecast: days, safetyNotes });
});

module.exports = { current, forecast };
