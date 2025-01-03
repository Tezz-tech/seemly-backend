// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const { 
  updateCart, 
  getCart, 
  clearCart, 
  updateProductQuantity, 
  removeProductFromCart 
} = require('../controllers/cartController');
const authenticateJWT = require('../middlewares/auth');

// Route to update cart (add or update product)
router.post('/', authenticateJWT, updateCart);

// Route to get cart by user ID
router.get('/', authenticateJWT, getCart);

// Route to clear the cart
router.delete('/', authenticateJWT, clearCart);

// Route to update the quantity of a specific product in the cart
router.put('/update-quantity', authenticateJWT, updateProductQuantity);

// Route to remove a product from the cart
router.delete('/remove-product', authenticateJWT, removeProductFromCart);

module.exports = router;
