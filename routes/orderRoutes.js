const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Define routes
router.post('/', orderController.createOrder); // Ensure this function exists
router.get('/user/:userId', orderController.getOrdersByUser); // Ensure this function exists

module.exports = router;
