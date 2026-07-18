const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { signup, login, logout, getMe, updatePreferences } = require('../controllers/authController');

const router = express.Router();

router.post(
  '/signup',
  [body('name').trim().notEmpty(), body('email').isEmail(), body('password').isLength({ min: 8 })],
  validate,
  signup
);

router.post('/login', [body('email').isEmail(), body('password').notEmpty()], validate, login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.patch('/preferences', protect, updatePreferences);

module.exports = router;
