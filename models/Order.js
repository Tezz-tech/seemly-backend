const mongoose = require('mongoose');

// Define the schema for the order
const orderSchema = new mongoose.Schema({
  paymentResponse: {
    type: mongoose.Schema.Types.Mixed,  // This allows any type of data
    required: true,
  },
  items: {
    type: mongoose.Schema.Types.Mixed,  // This allows any type of data
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.String,
    required: true,
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
