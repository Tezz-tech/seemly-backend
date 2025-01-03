const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

// Register a new user
exports.registerUser = async (req, res) => {
  const { firstName, lastName, email, password, address } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({ firstName, lastName, email, password, address });

    await user.save();
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error(error); // Log the error
    res.status(500).json({ message: 'Server error', error: error.message }); // Send the error message to the client
  }
};

// Login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create a payload for JWT (with user id)
    const payload = {
      user: {
        id: user.id,
      },
    };

    // Sign the JWT
    const token = jwt.sign(
      payload, 
      process.env.JWT_SECRET, // Use a secure JWT secret from environment variables
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Log the token to the console
    console.log('Generated JWT:', token);

    // Send token and user data in response
    res.status(200).json({ 
      message: 'Login successful', 
      token, 
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      }
    });

  } catch (error) {
    console.error(error); // Log the actual error
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Get user by ID (protected)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update user by ID (protected)
exports.updateUser = async (req, res) => {
  const { firstName, lastName, address } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName, address },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete user by ID (protected)
exports.deleteUserById = async (req, res) => {
  try {
    const userId = req.params.id; // Extract user ID from the route parameters
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


// Get all users (protected)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
