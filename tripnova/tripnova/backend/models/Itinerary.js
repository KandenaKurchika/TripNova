const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    time: String,               // e.g. "09:00 AM"
    title: String,               // e.g. "Visit Eiffel Tower"
    category: { type: String, enum: ['sightseeing', 'food', 'transport', 'accommodation', 'shopping', 'leisure', 'other'], default: 'sightseeing' },
    location: {
      name: String,
      lat: Number,
      lng: Number,
      placeId: String,
    },
    estimatedCost: { type: Number, default: 0 },
    durationMinutes: { type: Number, default: 60 },
    notes: String,
  },
  { _id: false }
);

const daySchema = new mongoose.Schema(
  {
    dayNumber: { type: Number, required: true },
    date: Date,
    theme: String, // e.g. "Historic Old Town & Local Cuisine"
    activities: [activitySchema],
  },
  { _id: false }
);

const itinerarySchema = new mongoose.Schema(
  {
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true, index: true },
    generatedBy: { type: String, enum: ['ai', 'user', 'hybrid'], default: 'ai' },
    days: [daySchema],
    weatherSnapshot: [{
      date: Date,
      summary: String,
      tempHighC: Number,
      tempLowC: Number,
      icon: String,
    }],
    safetyNotes: [{ type: String }],
    rawModelResponse: { type: String }, // stored for auditability/debugging
  },
  { timestamps: true }
);

module.exports = mongoose.model('Itinerary', itinerarySchema);
