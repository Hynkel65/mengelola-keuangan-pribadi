const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = async (req, res, next) => {
    console.log('Checking authentication...'); // Log when the middleware is invoked

    // Get the token from the cookies
    const token = req.cookies.jwt; 
    console.log('Token from cookies:', token); // Log the token

    if (!token) {
        console.log('No token found. User is unauthorized.'); // Log if no token is found
        return res.status(401).json({ success: false, error: 'Unauthorized: Token not found' });
    }

    try {
        // Verify the token
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        console.log('Decoded token:', decodedToken); // Log the decoded token

        // Find the user associated with the token
        req.user = await User.findById(decodedToken.id);
        console.log('User  found:', req.user); // Log the user found

        if (!req.user) {
            console.log('User  not found.'); // Log if user is not found
            return res.status(401).json({ success: false, error: 'Unauthorized: User not found' });
        }

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Error verifying token:', error); // Log any errors during verification
        res.status(401).json({ success: false, error: 'Unauthorized: Invalid token' });
    }
};

module.exports = { requireAuth };