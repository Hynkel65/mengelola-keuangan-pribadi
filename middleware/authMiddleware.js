const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to check if the user is authenticated
const requireAuth = async (req, res, next) => {
    // Retrieve token from cookies
    const token = req.cookies.jwt;

    // If no token is found, return an unauthorized error
    if (!token) {
        return res.status(401).json({ success: false, error: 'Unauthorized: Token not found' });
    }

    try {
        // Verify the token using the secret key
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

        // Find the user by ID from the decoded token
        req.user = await User.findById(decodedToken.id);

        // If no user is found, return an unauthorized error
        if (!req.user) {
            return res.status(401).json({ success: false, error: 'Unauthorized: User not found' });
        }

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // Log the error and return an unauthorized error if token verification fails
        console.error('Error verifying token:', error);
        res.status(401).json({ success: false, error: 'Unauthorized: Invalid token' });
    }
};

module.exports = { requireAuth };