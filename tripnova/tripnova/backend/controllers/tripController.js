const asyncHandler = require('express-async-handler');
const Trip = require('../models/Trip');
const Itinerary = require('../models/Itinerary');
const { getChatCompletion, extractStructuredPayload } = require('../services/claudeService');
const { estimateTripCost } = require('../services/costEstimatorService');
const { geocode } = require('../services/googleMapsService');
const { getDailyForecast, deriveSafetyNotes } = require('../services/weatherService');

const daysBetween = (start, end) =>
  Math.max(1, Math.round((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)) + 1);

// @route POST /api/trips
const createTrip = asyncHandler(async (req, res) => {
  const { title, destinationName, startDate, endDate, travelers, budgetTier, interests } = req.body;

  const geo = await geocode(destinationName).catch(() => null);

  const trip = await Trip.create({
    user: req.user._id,
    title: title || `Trip to ${destinationName}`,
    destination: {
      city: destinationName,
      lat: geo?.lat,
      lng: geo?.lng,
      placeId: geo?.placeId,
    },
    startDate,
    endDate,
    travelers: travelers || 1,
    budgetTier: budgetTier || 'mid-range',
    interests: interests || [],
    estimatedCost: estimateTripCost({
      budgetTier,
      days: daysBetween(startDate, endDate),
      travelers: travelers || 1,
    }),
  });

  req.user.savedTrips.push(trip._id);
  await req.user.save();

  res.status(201).json({ success: true, trip });
});

// @route GET /api/trips
const listTrips = asyncHandler(async (req, res) => {
  const trips = await Trip.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, trips });
});

// @route GET /api/trips/:id
const getTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findOne({ _id: req.params.id, user: req.user._id }).populate('itinerary');
  if (!trip) {
    res.status(404);
    throw new Error('Trip not found');
  }
  res.json({ success: true, trip });
});

// @route POST /api/trips/:id/generate-itinerary
// Uses Claude to draft a full day-wise itinerary for an existing trip, enriched
// with a live weather snapshot and simple safety notes.
const generateItinerary = asyncHandler(async (req, res) => {
  const trip = await Trip.findOne({ _id: req.params.id, user: req.user._id });
  if (!trip) {
    res.status(404);
    throw new Error('Trip not found');
  }

  const numDays = daysBetween(trip.startDate, trip.endDate);

  const forecast = trip.destination.lat
    ? await getDailyForecast(trip.destination.lat, trip.destination.lng).catch(() => [])
    : [];
  const safetyNotes = deriveSafetyNotes(forecast);

  const prompt = `Create a ${numDays}-day itinerary for ${trip.destination.city}, for ${trip.travelers} traveler(s),
budget tier "${trip.budgetTier}", interests: ${trip.interests.join(', ') || 'general sightseeing'}.
Dates: ${trip.startDate.toDateString()} to ${trip.endDate.toDateString()}.
Return the structured JSON block as specified in your instructions.`;

  const replyText = await getChatCompletion([{ role: 'user', content: prompt }], {
    destination: trip.destination,
    budgetTier: trip.budgetTier,
    travelers: trip.travelers,
    weatherForecast: forecast,
  });

  const structured = extractStructuredPayload(replyText) || {};

  const itinerary = await Itinerary.create({
    trip: trip._id,
    generatedBy: 'ai',
    days: (structured.itinerary || []).map((d) => ({
      dayNumber: d.day,
      theme: d.theme,
      activities: d.activities || [],
    })),
    weatherSnapshot: forecast.map((f) => ({
      date: f.date,
      summary: f.summary,
      tempHighC: f.tempHighC,
      tempLowC: f.tempLowC,
      icon: f.icon,
    })),
    safetyNotes,
    rawModelResponse: replyText,
  });

  trip.itinerary = itinerary._id;
  if (structured.costEstimate) {
    trip.estimatedCost = structured.costEstimate;
  }
  await trip.save();

  res.json({ success: true, trip, itinerary, assistantReply: replyText });
});

// @route DELETE /api/trips/:id
const deleteTrip = asyncHandler(async (req, res) => {
  await Trip.deleteOne({ _id: req.params.id, user: req.user._id });
  res.json({ success: true, message: 'Trip deleted' });
});

module.exports = { createTrip, listTrips, getTrip, generateItinerary, deleteTrip };
