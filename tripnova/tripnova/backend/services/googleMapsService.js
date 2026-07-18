const axios = require('axios');

const BASE = 'https://maps.googleapis.com/maps/api';
const key = () => process.env.GOOGLE_MAPS_API_KEY;

/** Text search for places (hotels, restaurants, attractions) near a destination. */
async function searchPlaces(query, { lat, lng, radiusMeters = 8000, type } = {}) {
  const params = {
    query,
    key: key(),
    ...(lat && lng ? { location: `${lat},${lng}`, radius: radiusMeters } : {}),
    ...(type ? { type } : {}),
  };
  const { data } = await axios.get(`${BASE}/place/textsearch/json`, { params });
  return (data.results || []).map((p) => ({
    placeId: p.place_id,
    name: p.name,
    address: p.formatted_address,
    rating: p.rating,
    priceLevel: p.price_level,
    lat: p.geometry?.location?.lat,
    lng: p.geometry?.location?.lng,
    types: p.types,
  }));
}

/** Resolve a place_id into full details (phone, hours, website, reviews summary). */
async function getPlaceDetails(placeId) {
  const params = {
    place_id: placeId,
    key: key(),
    fields: 'name,formatted_address,geometry,rating,opening_hours,website,formatted_phone_number,price_level',
  };
  const { data } = await axios.get(`${BASE}/place/details/json`, { params });
  return data.result;
}

/** Driving/walking/transit distance & duration between two points. */
async function getDistanceMatrix(origin, destination, mode = 'driving') {
  const params = {
    origins: origin,
    destinations: destination,
    mode,
    key: key(),
  };
  const { data } = await axios.get(`${BASE}/distancematrix/json`, { params });
  return data.rows?.[0]?.elements?.[0];
}

/** Geocode a free-text destination (city, landmark) into lat/lng + place_id. */
async function geocode(address) {
  const params = { address, key: key() };
  const { data } = await axios.get(`${BASE}/geocode/json`, { params });
  const first = data.results?.[0];
  if (!first) return null;
  return {
    placeId: first.place_id,
    formattedAddress: first.formatted_address,
    lat: first.geometry.location.lat,
    lng: first.geometry.location.lng,
  };
}

module.exports = { searchPlaces, getPlaceDetails, getDistanceMatrix, geocode };
