const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { generateToken, setTokenCookie } = require('../utils/generateToken');

// @route POST /api/auth/signup
const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(422);
    throw new Error('name, email and password are required');
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    res.status(409);
    throw new Error('An account with this email already exists');
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);
  setTokenCookie(res, token);

  res.status(201).json({ success: true, user: user.toSafeObject(), token });
});

// @route POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email?.toLowerCase() }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  user.lastLoginAt = new Date();
  await user.save();

  const token = generateToken(user._id);
  setTokenCookie(res, token);

  res.json({ success: true, user: user.toSafeObject(), token });
});

// @route POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out' });
});

// @route GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user.toSafeObject() });
});

// @route PATCH /api/auth/preferences
const updatePreferences = asyncHandler(async (req, res) => {
  req.user.preferences = { ...req.user.preferences.toObject(), ...req.body };
  await req.user.save();
  res.json({ success: true, user: req.user.toSafeObject() });
});

module.exports = { signup, login, logout, getMe, updatePreferences };
