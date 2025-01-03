const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');
const config = require('config');
const paypal = require('paypal-rest-sdk');
const cors = require('cors');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json()); // Parse JSON data
app.use(cors());         // Enable CORS

// API Routes
app.use('/api/auth', authRoutes);     // Authentication routes
app.use('/api/user', userRoutes);     // User-related routes
app.use('/api/cart', cartRoutes);     // Cart routes
app.use('/api/order', orderRoutes);   // Order routes
app.use('/api/product', productRoutes); // Product routes

// PayPal Configuration
// paypal.configure({
//   mode: 'sandbox', // Use 'live' for production
//   client_id: config.get('PAYPAL_CLIENT_ID'),
//   client_secret: config.get('PAYPAL_SECRET'),
// });

// // PayPal Payment Route Example
// app.post('/api/paypal/create-payment', (req, res) => {
//   const { total, currency } = req.body;

//   const create_payment_json = {
//     intent: "sale",
//     payer: {
//       payment_method: "paypal"
//     },
//     transactions: [{
//       amount: {
//         total: total,
//         currency: currency
//       },
//       description: "E-commerce Payment"
//     }],
//     redirect_urls: {
//       return_url: "http://localhost:5000/api/paypal/success",
//       cancel_url: "http://localhost:5000/api/paypal/cancel"
//     }
//   };

//   paypal.payment.create(create_payment_json, (error, payment) => {
//     if (error) {
//       console.error(error);
//       return res.status(500).json({ error: 'Payment creation failed' });
//     } else {
//       for (let i = 0; i < payment.links.length; i++) {
//         if (payment.links[i].rel === 'approval_url') {
//           return res.json({ forwardLink: payment.links[i].href });
//         }
//       }
//     }
//   });
// });

// // PayPal Success Route
// app.get('/api/paypal/success', (req, res) => {
//   const payerId = req.query.PayerID;
//   const paymentId = req.query.paymentId;

//   const execute_payment_json = {
//     payer_id: payerId,
//     transactions: [{
//       amount: {
//         currency: "USD", // Use dynamic currency if needed
//         total: "10.00"   // Use dynamic total if needed
//       }
//     }]
//   };

//   paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
//     if (error) {
//       console.error(error.response);
//       return res.status(500).json({ error: 'Payment execution failed' });
//     } else {
//       res.status(200).json({ message: 'Payment successful', payment });
//     }
//   });
// });

// // PayPal Cancel Route
// app.get('/api/paypal/cancel', (req, res) => res.status(200).json({ message: 'Payment cancelled' }));

// Root route for testing
app.get('/', (req, res) => {
  res.send('E-commerce API is running');
});

// Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
