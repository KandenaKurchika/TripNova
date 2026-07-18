const asyncHandler = require('express-async-handler');
const { searchPlaces, getPlaceDetails, getDistanceMatrix } = require('../services/googleMapsService');

// @route GET /api/places/search?query=hotels+in+lisbon&lat=&lng=&type=lodging
const search = asyncHandler(async (req, res) => {
  const { query, lat, lng, radius, type } = req.query;
  if (!query) {
    res.status(422);
    throw new Error('query is required');
  }
  const results = await searchPlaces(query, {
    lat: lat ? Number(lat) : undefined,
    lng: lng ? Number(lng) : undefined,
    radiusMeters: radius ? Number(radius) : undefined,
    type,
  });
  res.json({ success: true, results });
});

// @route GET /api/places/:placeId
const details = asyncHandler(async (req, res) => {
  const place = await getPlaceDetails(req.params.placeId);
  res.json({ success: true, place });
});

// @route GET /api/places/distance?origin=&destination=&mode=driving
const distance = asyncHandler(async (req, res) => {
  const { origin, destination, mode } = req.query;
  const result = await getDistanceMatrix(origin, destination, mode);
  res.json({ success: true, result });
});

module.exports = { search, details, distance };
