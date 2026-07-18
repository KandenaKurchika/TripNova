const axios = require('axios');

const BASE = 'https://api.openweathermap.org/data/2.5';

/** Current weather for a destination by lat/lng. */
async function getCurrentWeather(lat, lng) {
  const { data } = await axios.get(`${BASE}/weather`, {
    params: { lat, lon: lng, appid: process.env.OPENWEATHER_API_KEY, units: 'metric' },
  });
  return {
    summary: data.weather?.[0]?.description,
    icon: data.weather?.[0]?.icon,
    tempC: data.main?.temp,
    feelsLikeC: data.main?.feels_like,
    humidity: data.main?.humidity,
    windSpeed: data.wind?.speed,
  };
}

/** 5-day / 3-hour forecast, condensed into one entry per day for itinerary display. */
async function getDailyForecast(lat, lng) {
  const { data } = await axios.get(`${BASE}/forecast`, {
    params: { lat, lon: lng, appid: process.env.OPENWEATHER_API_KEY, units: 'metric' },
  });

  const byDay = {};
  for (const entry of data.list || []) {
    const day = entry.dt_txt.split(' ')[0];
    if (!byDay[day]) byDay[day] = { temps: [], icons: [], summaries: [] };
    byDay[day].temps.push(entry.main.temp);
    byDay[day].icons.push(entry.weather?.[0]?.icon);
    byDay[day].summaries.push(entry.weather?.[0]?.description);
  }

  return Object.entries(byDay).map(([date, v]) => ({
    date,
    tempHighC: Math.max(...v.temps),
    tempLowC: Math.min(...v.temps),
    icon: v.icons[Math.floor(v.icons.length / 2)],
    summary: v.summaries[Math.floor(v.summaries.length / 2)],
  }));
}

/**
 * Lightweight travel-safety heuristic combining weather extremes.
 * For production, wire this to a real advisory feed (e.g. Travel-Advisory API)
 * and government sources (US State Dept / UK FCDO) rather than deriving from weather alone.
 */
function deriveSafetyNotes(forecastDays) {
  const notes = [];
  for (const d of forecastDays) {
    if (d.tempHighC >= 38) notes.push(`Extreme heat expected ${d.date} (${d.tempHighC.toFixed(0)}°C) — stay hydrated, plan indoor activities midday.`);
    if (d.tempLowC <= 0) notes.push(`Near/below-freezing temperatures on ${d.date} — pack layers.`);
    if (/storm|thunder/i.test(d.summary || '')) notes.push(`Thunderstorms possible on ${d.date} — keep indoor backup plans.`);
  }
  return notes;
}

module.exports = { getCurrentWeather, getDailyForecast, deriveSafetyNotes };
