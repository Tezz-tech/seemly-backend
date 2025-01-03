const mongoose = require('mongoose');
require('dotenv').config();  // Load environment variables from .env

const db = process.env.MONGO_URI;  // Get MongoDB URI from .env

// Function to connect to MongoDB
const connectDB = async () => {
    try {
        // Attempt to connect to the MongoDB database
        await mongoose.connect(db, {
            useNewUrlParser: true,     // Use new MongoDB URL parser
            useUnifiedTopology: true,  // Use MongoDB's new connection engine
        });

        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);  // Exit the process if there's an error
    }
};

module.exports = connectDB;
