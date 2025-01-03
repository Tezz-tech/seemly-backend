const express = require('express');
const { createOrder, paymentSuccess, paymentCancel } = require('../controllers/orderController');
const auth = require('../middlewares/auth');
const router = express.Router();

router.post('/', auth, createOrder);
router.get('/success', auth, paymentSuccess);
router.get('/cancel', auth, paymentCancel);

module.exports = router;
