const Order = require('../models/Order');
const Cart = require('../models/Cart');
const paypal = require('paypal-rest-sdk');

// Create order
exports.createOrder = async (req, res) => {
  const { address } = req.body;

  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('products.product');
    if (!cart) return res.status(404).json({ msg: 'Cart not found' });

    const newOrder = new Order({
      user: req.user.id,
      products: cart.products,
      totalPrice: cart.totalPrice,
      address
    });

    await newOrder.save();

    // Create PayPal payment
    const payment = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal'
      },
      redirect_urls: {
        return_url: 'http://localhost:5000/api/order/success', // Redirect URL after payment success
        cancel_url: 'http://localhost:5000/api/order/cancel' // Redirect URL if payment is canceled
      },
      transactions: [{
        amount: {
          total: cart.totalPrice,
          currency: 'USD'
        },
        description: 'Order from e-commerce site'
      }]
    };

    paypal.payment.create(payment, async (error, payment) => {
      if (error) {
        console.error(error);
        return res.status(500).send('PayPal payment creation failed');
      } else {
        // Save payment id in order
        newOrder.paymentId = payment.id;
        await newOrder.save();
        const approvalUrl = payment.links.find(link => link.rel === 'approval_url');
        res.json({ approvalUrl: approvalUrl.href });
      }
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Success callback after PayPal payment
exports.paymentSuccess = async (req, res) => {
  const { paymentId, PayerID } = req.query;
  
  paypal.payment.execute(paymentId, { payer_id: PayerID }, async (error, payment) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Payment execution failed');
    }

    // Update order status
    const order = await Order.findOneAndUpdate({ paymentId }, { paymentStatus: 'Completed' }, { new: true });
    
    // Clear cart after successful payment
    await Cart.findOneAndDelete({ user: req.user.id });
    
    res.json({ order });
  });
};

// Cancel callback for PayPal payment
exports.paymentCancel = (req, res) => {
  res.status(400).json({ msg: 'Payment canceled' });
};
