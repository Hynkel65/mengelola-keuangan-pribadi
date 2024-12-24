const express = require('express');
const { signupUser, signinUser, signoutUser, checkAuth } = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/signup').post(signupUser);

router.route('/signin').post(signinUser);

router.route('/signout').post(signoutUser);

router.route('/check-auth').get(requireAuth, checkAuth);

module.exports = router;