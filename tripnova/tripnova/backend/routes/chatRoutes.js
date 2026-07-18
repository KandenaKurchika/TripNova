const express = require('express');
const rateLimit = require('express-rate-limit');
const { protect } = require('../middleware/auth');
const {
  sendMessage, sendGuestMessage, listSessions, getSession, deleteSession,
} = require('../controllers/chatController');

const router = express.Router();

// Tighter limit for the unauthenticated floating assistant, to control AI spend.
const guestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many messages — please sign in to continue chatting.' },
});

// Public: floating assistant bot, available before signup.
router.post('/guest', guestLimiter, sendGuestMessage);

// Everything below requires auth.
router.use(protect);

router.get('/', listSessions);
router.post('/', sendMessage);             // start a new session
router.post('/:sessionId', sendMessage);   // continue an existing session
router.get('/:sessionId', getSession);
router.delete('/:sessionId', deleteSession);

module.exports = router;
