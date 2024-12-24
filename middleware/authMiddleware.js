const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ success: false, error: 'Unauthorized: Token not found' });
    }
    try {
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        req.user = await User.findById(decodedToken.id);
        if (!req.user) {
            return res.status(401).json({ success: false, error: 'Unauthorized: User not found' });
        }
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).json({ success: false, error: 'Unauthorized: Invalid token' });
    }
};

module.exports = { requireAuth };