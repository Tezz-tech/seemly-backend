const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
  try {
    const { user, address, cart, paymentReference } = req.body;

    // Validate request data
    if (!user || !address || !cart || !paymentReference) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Prepare order details
    const orderDetails = {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      products: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
      })),
      totalPrice: cart.reduce((total, item) => total + item.totalPrice, 0),
      address,
      paymentReference,
    };

    // Save order to the database
    const newOrder = new Order(orderDetails);
    await newOrder.save();

    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ 'user.id': userId });
    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
