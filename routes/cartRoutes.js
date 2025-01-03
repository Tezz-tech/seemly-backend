// routes/cartRoutes.js
const express = require("express");
const router = express.Router();
const {
  updateCart,
  getCart,
  clearCart,
  updateProductQuantity,
  removeProductFromCart,
  createCart,
  getMycart,
  deleteItemFromCart,
  deleteAllCartItems,
} = require("../controllers/cartController");
const authenticateJWT = require("../middlewares/auth");

router.post("/create-cart", authenticateJWT, createCart);
router.post("/get-user-cart", authenticateJWT, getMycart);
router.put("/update-user-cart", authenticateJWT, updateCart);
router.delete("/delete-from-cart", authenticateJWT, deleteItemFromCart);
router.delete("/delete-user-cart", authenticateJWT, deleteAllCartItems);
// Route to update cart (add or update product)
// router.post('/', authenticateJWT, updateCart);

// Route to get cart by user ID
router.get("/", authenticateJWT, getCart);

// Route to clear the cart
router.delete("/", authenticateJWT, clearCart);

// Route to update the quantity of a specific product in the cart
router.put("/update-quantity", authenticateJWT, updateProductQuantity);

// Route to remove a product from the cart
router.delete("/remove-product", authenticateJWT, removeProductFromCart);

module.exports = router;
