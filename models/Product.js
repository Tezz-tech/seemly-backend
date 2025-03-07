// models/Product.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { type: String,  required: true},
  image: { type: String, required: false }, // URL for the image
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);
