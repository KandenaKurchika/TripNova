require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const tripRoutes = require('./routes/tripRoutes');
const placesRoutes = require('./routes/placesRoutes');
const weatherRoutes = require('./routes/weatherRoutes');

const app = express();

// --- Serve rebuilt landing page as static files ---
// Access the bot at http://localhost:10000
app.use(express.static(path.join(__dirname, '../../../tripnova-rebuilt')));

// --- Core middleware ---
app.use(helmet());
const ALLOWED_ORIGINS = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5500',   // VS Code Live Server (landing-preview.html)
  'http://127.0.0.1:5500',  // VS Code Live Server (alternate)
  'http://localhost:5501',   // VS Code Live Server (if 5500 is taken)
  'http://localhost:10000',  // Hosted port (main)
  'http://127.0.0.1:10000', // Hosted port (alternate)
  'null',                    // Local file system double-click (file:/// origin is null)
];
app.use(cors({
  origin: (origin, cb) => {
    // Allow no-origin requests (curl, Postman) and explicitly listed origins
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// --- Rate limiting (protects Claude API + DB from abuse) ---
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please slow down.' }
});
app.use('/api', apiLimiter);

// --- Health check ---
app.get('/api/health', (req, res) => {
  res.json({ success: true, service: 'TripNova API', status: 'ok', timestamp: new Date().toISOString() });
});

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/places', placesRoutes);
app.use('/api/weather', weatherRoutes);

// --- 404 handler ---
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// --- Centralized error handler (must be last) ---
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB(process.env.MONGODB_URI);
  app.listen(PORT, () => {
    console.log(`TripNova API running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
};

start();

module.exports = app;
