const express = require('express');
const { signupUser, signinUser, signoutUser, checkAuth } = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// Route for user signup
router.route('/signup').post(signupUser);

// Route for user signin
router.route('/signin').post(signinUser);

// Route for user signout
router.route('/signout').post(signoutUser);

// Route to check user authentication status, requires authentication
router.route('/check-auth').get(requireAuth, checkAuth);

module.exports = router;