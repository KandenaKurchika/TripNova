const express = require('express');
const { protect } = require('../middleware/auth');
const {
  createTrip, listTrips, getTrip, generateItinerary, deleteTrip,
} = require('../controllers/tripController');

const router = express.Router();

router.use(protect);

router.post('/', createTrip);
router.get('/', listTrips);
router.get('/:id', getTrip);
router.post('/:id/generate-itinerary', generateItinerary);
router.delete('/:id', deleteTrip);

module.exports = router;
