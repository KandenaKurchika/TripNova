const express = require('express');
const { protect } = require('../middleware/auth');
const { current, forecast } = require('../controllers/weatherController');

const router = express.Router();

router.use(protect);

router.get('/', current);
router.get('/forecast', forecast);

module.exports = router;
