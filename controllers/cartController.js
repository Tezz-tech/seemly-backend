// controllers/cartController.js
const Cart = require("../models/Cart");
const User = require("../models/User");
const Product = require("../models/Product");

exports.createCart = async (req, res) => {
  let { userId, productId } = req.body;
  try {
    const user = await User.findById(userId);
    const product = await Product.findById(productId);
    if (!user || !product) {
      return res.status(404).json({ message: "invalid details" });
    }

    const checkIfProductExist = await Cart.findOne({ productId });

    if (checkIfProductExist) {
      return res.status(301).json({ message: "Product already exist in cart" });
    } else {
      const cart = new Cart({ userId, productId });
      await cart.save();

      user.cart.push(cart._id);
      await user.save();

      return res
        .status(201)
        .json({ message: "Product Added Cart successfully", cart: cart });
    }
  } catch (error) {
    console.error("Error creating cart:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getMycart = async (req, res) => {
  const { userId, cartId } = req.body;

  try {
    const user = await User.findById(userId).populate("cart");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cart = await User.findById(userId).populate({
      path: "cart",
      populate: {
        path: "productId",
        model: "Product",
      },
    });
    if (!cart) {
      return res
        .status(404)
        .json({ message: "Cart not found or doesn't belong to the user" });
    }

    return res.status(200).json({ message: "Here is your cart details", cart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

exports.updateCart = async (req, res) => {
  let { userId, cartId, quantity } = req.body;

  try {
    const user = await User.findById(userId);
    const cart = await Cart.findById(cartId);
    if (!user || !cart) {
      return res.status(404).json({ message: "invalid  details  not found" });
    }

    await Cart.findByIdAndUpdate(cartId, { quantity }, { new: true });
    cart.save();

    return res.status(200).json({ message: "Cart updated successfully", cart });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

exports.deleteItemFromCart = async (req, res) => {
  const { userId, cartId } = req.body;

  try {
    let user = await User.findById(userId);
    let cart = await Cart.findById(cartId);
    if (!user || !cart) {
      return res.status(404).json({ message: "invalid details" });
    }
    await Cart.findByIdAndDelete(cartId);

    return res.status(200).json({ message: "Item deleted from successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

exports.deleteAllCartItems = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await Cart.deleteMany({ userId });

    user.cart = [];
    await user.save();

    return res
      .status(200)
      .json({ message: "All cart items have been deleted successfully" });
  } catch (error) {
    console.error("Error deleting cart items:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};



// Get cart by user ID
exports.getCart = async (req, res) => {
  const userId = req.user.id; // Use authenticated userId from JWT

  try {
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Clear the cart for a user
exports.clearCart = async (req, res) => {
  const userId = req.user.id; // Use authenticated userId from JWT

  try {
    await Cart.deleteOne({ userId });
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Server error", error });
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
      const itemIndex = cart.items.findIndex((item) =>
        item.productId.equals(productId)
      );

      if (itemIndex > -1) {
        // Update the quantity of the product
        cart.items[itemIndex].quantity = quantity;

        // Remove the product if quantity becomes zero
        if (quantity === 0) {
          cart.items.splice(itemIndex, 1);
        }

        await cart.save();
        return res
          .status(200)
          .json({ message: "Cart updated successfully", cart });
      } else {
        return res.status(404).json({ message: "Product not found in cart" });
      }
    } else {
      return res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: "Server error", error });
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
      const itemIndex = cart.items.findIndex((item) =>
        item.productId.equals(productId)
      );

      if (itemIndex > -1) {
        // Remove the product from the cart
        cart.items.splice(itemIndex, 1);

        await cart.save();
        return res
          .status(200)
          .json({ message: "Product removed successfully", cart });
      } else {
        return res.status(404).json({ message: "Product not found in cart" });
      }
    } else {
      return res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    console.error("Error removing product:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
