const asyncHandler = require('express-async-handler');
const ChatSession = require('../models/ChatSession');
const { getChatCompletion, extractStructuredPayload } = require('../services/claudeService');

// @route POST /api/chat/:sessionId?  (creates a session if sessionId omitted)
const sendMessage = asyncHandler(async (req, res) => {
  const { message, tripContext } = req.body;
  if (!message?.trim()) {
    res.status(422);
    throw new Error('message is required');
  }

  let session;
  if (req.params.sessionId) {
    session = await ChatSession.findOne({ _id: req.params.sessionId, user: req.user._id });
    if (!session) {
      res.status(404);
      throw new Error('Chat session not found');
    }
  } else {
    session = await ChatSession.create({
      user: req.user._id,
      title: message.slice(0, 60),
      messages: [],
    });
  }

  session.messages.push({ role: 'user', content: message });

  // Claude expects alternating user/assistant turns without our internal fields
  const history = session.messages.map(({ role, content }) => ({ role, content }));

  const replyText = await getChatCompletion(history, tripContext);
  const structured = extractStructuredPayload(replyText);

  session.messages.push({ role: 'assistant', content: replyText });
  await session.save();

  res.json({
    success: true,
    sessionId: session._id,
    reply: replyText,
    structured, // parsed itinerary/costEstimate JSON, if the model included one
  });
});

// @route POST /api/chat/guest
// Stateless assistant for unauthenticated visitors (e.g. the landing-page floating bot).
// The client keeps its own short-lived history and resends it each turn; nothing is
// persisted to the database. Intended for light guidance ("where should I go on a
// budget?"), not full itinerary generation — that still requires an account.
const sendGuestMessage = asyncHandler(async (req, res) => {
  const { message, history = [] } = req.body;
  if (!message?.trim()) {
    res.status(422);
    throw new Error('message is required');
  }

  // Cap history sent from an untrusted client to keep token usage bounded.
  const trimmedHistory = history.slice(-10).map(({ role, content }) => ({ role, content }));
  const turn = [...trimmedHistory, { role: 'user', content: message }];

  const replyText = await getChatCompletion(turn);
  const structured = extractStructuredPayload(replyText);

  res.json({ success: true, reply: replyText, structured });
});

// @route GET /api/chat
const listSessions = asyncHandler(async (req, res) => {
  const sessions = await ChatSession.find({ user: req.user._id })
    .sort({ updatedAt: -1 })
    .select('title updatedAt createdAt');
  res.json({ success: true, sessions });
});

// @route GET /api/chat/:sessionId
const getSession = asyncHandler(async (req, res) => {
  const session = await ChatSession.findOne({ _id: req.params.sessionId, user: req.user._id });
  if (!session) {
    res.status(404);
    throw new Error('Chat session not found');
  }
  res.json({ success: true, session });
});

// @route DELETE /api/chat/:sessionId
const deleteSession = asyncHandler(async (req, res) => {
  await ChatSession.deleteOne({ _id: req.params.sessionId, user: req.user._id });
  res.json({ success: true, message: 'Session deleted' });
});

module.exports = { sendMessage, sendGuestMessage, listSessions, getSession, deleteSession };
