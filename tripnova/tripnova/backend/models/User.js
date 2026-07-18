const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const preferenceSchema = new mongoose.Schema(
  {
    budgetTier: { type: String, enum: ['budget', 'mid-range', 'luxury'], default: 'mid-range' },
    travelStyle: [{ type: String }], // e.g. ['adventure', 'relaxation', 'culture', 'food', 'nightlife']
    dietary: [{ type: String }],     // e.g. ['vegetarian', 'halal', 'vegan']
    homeCurrency: { type: String, default: 'USD' },
    preferredTransport: [{ type: String }], // e.g. ['flight', 'train', 'car']
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true, minlength: 8, select: false },
    avatarUrl: { type: String, default: '' },
    preferences: { type: preferenceSchema, default: () => ({}) },
    savedTrips: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trip' }],
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeObject = function toSafeObject() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
