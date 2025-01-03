const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth'); // JWT auth middleware

// @route    POST /api/user/register
// @desc     Register a new user
router.post('/register', userController.registerUser);

// @route    POST /api/user/login
// @desc     Login a user
router.post('/login', userController.loginUser);

// @route    GET /api/user/me
// @desc     Get current user (protected)
router.get('/me', auth, userController.getUserById);

// @route    PUT /api/user/me
// @desc     Update current user (protected)
router.put('/me', auth, userController.updateUser);

// @route    DELETE /api/user/delete/:id
// @desc     Delete a user by ID (protected)
// @access   Private/Admin (you can add admin check here if needed)
router.delete('/delete/:id', auth, userController.deleteUserById);

// @route    GET /api/user/all
// @desc     Get all users (protected, admin functionality can be added)
// @access   Private
router.get('/all', auth, userController.getAllUsers);

module.exports = router;
