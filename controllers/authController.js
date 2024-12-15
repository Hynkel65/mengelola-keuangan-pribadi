const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to send a token response
const sendTokenResponse = (user, statusCode, res) => {
    // Generate JWT token
    const token = user.getSignedJwtToken();
    
    // Set cookie options
    const cookieOptions = {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    };

    // Send cookie and JSON response
    res.cookie('jwt', token, cookieOptions);
    res.status(statusCode).json({ success: true, token, user: user.username });
};

// Middleware to check user authentication
exports.checkAuth = async (req, res) => {
    const token = req.cookies.jwt;

    // If no token is found, user is not authenticated
    if (!token) {
        return res.status(401).json({ success: false, isAuthenticated: false });
    }

    try {
        // Verify token and find user
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decodedToken.id);

        // If user is not found, respond with failure
        if (!user) {
            return res.status(401).json({ success: false, isAuthenticated: false });
        }

        // Respond with success if user is authenticated
        return res.status(200).json({ success: true, isAuthenticated: true, user: user.username });
    } catch (error) {
        // Catch any errors and respond with failure
        return res.status(401).json({ success: false, isAuthenticated: false });
    }
};

// Register a new user
exports.signupUser = async (req, res, next) => {
    const { username, password } = req.body;

    try {
        // Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Username is already taken' });
        }

        // Create new user and send token response
        const user = await User.create({ username, password });
        sendTokenResponse(user, 201, res);
    } catch (err) {
        // Pass any errors to the next middleware
        next(err);
    }
};

// Sign in an existing user
exports.signinUser = async (req, res, next) => {
    const { username, password } = req.body;

    try {
        // Find user by username and include password
        const user = await User.findOne({ username }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Username or password not found!' });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Username or password not found!' });
        }

        // Send token response
        sendTokenResponse(user, 200, res);
    } catch (err) {
        // Pass any errors to the next middleware
        next(err);
    }
};

// Sign out the user
exports.signoutUser = async (req, res) => {
    try {
        // Clear the JWT cookie
        res.clearCookie('jwt');
        return res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (err) {
        // Pass any errors to the next middleware
        next(err);
    }
};