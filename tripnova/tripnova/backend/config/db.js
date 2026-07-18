const mongoose = require('mongoose');

/**
 * Connects to MongoDB (Atlas or self-hosted) using Mongoose.
 * Retries are handled by the platform/process manager on failure.
 */
const connectDB = async (uri) => {
  if (!uri || uri.includes('<user>') || uri.includes('<password>')) {
    console.warn('⚠️  MONGODB_URI not configured — running without database. Auth and trip-save features will be unavailable.');
    return;
  }
  try {
    mongoose.set('strictQuery', true);
    const conn = await mongoose.connect(uri, { maxPoolSize: 10 });
    console.log(`✅ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err.message);
    });
  } catch (err) {
    console.warn(`⚠️  MongoDB connection failed (${err.message}) — running without database. Auth and trip-save features will be unavailable.`);
  }
};

module.exports = connectDB;
