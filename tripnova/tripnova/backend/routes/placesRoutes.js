const express = require('express');
const { protect } = require('../middleware/auth');
const { search, details, distance } = require('../controllers/placesController');

const router = express.Router();

router.use(protect);

router.get('/search', search);
router.get('/distance', distance);
router.get('/:placeId', details);

module.exports = router;
