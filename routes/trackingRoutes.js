const express = require('express');
const { trackOrder } = require('../controllers/trackingController');
const auth = require('../middlewares/auth');
const router = express.Router();

router.get('/:trackingNumber', auth, trackOrder);

module.exports = router;
