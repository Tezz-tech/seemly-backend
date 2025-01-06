const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
  },
  products: [
    {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      totalPrice: { type: Number, required: true },
    }
  ],
  totalPrice: { type: Number, required: true },
  address: { type: String, required: true },
  paymentReference: { type: String, required: true },
  paymentStatus: { type: String, default: 'Pending' },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);
