// controllers/cartController.js
const Cart = require('../models/Cart');

// Create or update cart for a user
exports.updateCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id; // Use authenticated userId from JWT

  try {
    let cart = await Cart.findOne({ userId });

    if (cart) {
      // Check if the product already exists in the cart
      const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));

      if (itemIndex > -1) {
        // Update quantity if the product exists
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Add new product to the cart
        cart.items.push({ productId, quantity });
      }
    } else {
      // Create a new cart if it doesn't exist
      cart = new Cart({ userId, items: [{ productId, quantity }] });
    }

    await cart.save();
    res.status(200).json({ message: 'Cart updated successfully', cart });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get cart by user ID
exports.getCart = async (req, res) => {
  const userId = req.user.id; // Use authenticated userId from JWT

  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.status(200).json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Clear the cart for a user
exports.clearCart = async (req, res) => {
  const userId = req.user.id; // Use authenticated userId from JWT

  try {
    await Cart.deleteOne({ userId });
    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update the quantity of a specific product in the cart
exports.updateProductQuantity = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id; // Use authenticated userId from JWT

  try {
    let cart = await Cart.findOne({ userId });

    if (cart) {
      // Find the product in the cart
      const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));

      if (itemIndex > -1) {
        // Update the quantity of the product
        cart.items[itemIndex].quantity = quantity;

        // Remove the product if quantity becomes zero
        if (quantity === 0) {
          cart.items.splice(itemIndex, 1);
        }
        
        await cart.save();
        return res.status(200).json({ message: 'Cart updated successfully', cart });
      } else {
        return res.status(404).json({ message: 'Product not found in cart' });
      }
    } else {
      return res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Remove a product from the cart
exports.removeProductFromCart = async (req, res) => {
  const { productId } = req.body; // Product ID to remove
  const userId = req.user.id; // Use authenticated userId from JWT

  try {
    let cart = await Cart.findOne({ userId });

    if (cart) {
      // Find the product in the cart
      const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));

      if (itemIndex > -1) {
        // Remove the product from the cart
        cart.items.splice(itemIndex, 1);

        await cart.save();
        return res.status(200).json({ message: 'Product removed successfully', cart });
      } else {
        return res.status(404).json({ message: 'Product not found in cart' });
      }
    } else {
      return res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    console.error('Error removing product:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};