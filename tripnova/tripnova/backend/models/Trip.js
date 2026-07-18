const mongoose = require('mongoose');

const budgetBreakdownSchema = new mongoose.Schema(
  {
    accommodation: { type: Number, default: 0 },
    food: { type: Number, default: 0 },
    transport: { type: Number, default: 0 },
    activities: { type: Number, default: 0 },
    miscellaneous: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
  },
  { _id: false }
);

const tripSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    destination: {
      city: String,
      country: String,
      lat: Number,
      lng: Number,
      placeId: String, // Google Places place_id
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    travelers: { type: Number, default: 1, min: 1 },
    budgetTier: { type: String, enum: ['budget', 'mid-range', 'luxury'], default: 'mid-range' },
    interests: [{ type: String }],
    estimatedCost: { type: budgetBreakdownSchema, default: () => ({}) },
    itinerary: { type: mongoose.Schema.Types.ObjectId, ref: 'Itinerary' },
    status: { type: String, enum: ['draft', 'planned', 'confirmed', 'completed', 'archived'], default: 'draft' },
  },
  { timestamps: true }
);

tripSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Trip', tripSchema);
