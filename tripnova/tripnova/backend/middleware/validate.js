const { validationResult } = require('express-validator');

/**
 * Runs after express-validator check(...) middlewares; short-circuits
 * with a 422 if any validation errors were collected.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }
  next();
};

module.exports = validate;
