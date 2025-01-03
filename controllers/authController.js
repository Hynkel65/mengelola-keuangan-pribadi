const User = require('../models/User');
const jwt = require('jsonwebtoken');

const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();

    const cookieOptions = {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    };
    res.cookie('jwt', token, cookieOptions);
    res.status(statusCode).json({ success: true, token, user: user.username });
};

exports.checkAuth = async (req, res) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ success: false, isAuthenticated: false });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decodedToken.id);

        if (!user) {
            return res.status(401).json({ success: false, isAuthenticated: false });
        }
        return res.status(200).json({ success: true, isAuthenticated: true, user: user.username });
    } catch (error) {
        return res.status(401).json({ success: false, isAuthenticated: false });
    }
};

exports.signupUser = async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Username sudah digunakan' });
        }
        const user = await User.create({ username, password });
        sendTokenResponse(user, 201, res);
    } catch (err) {
        next(err);
    }
};

exports.signinUser = async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Username tidak ditemukan!' });
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Password Salah!' });
        }
        sendTokenResponse(user, 200, res);
    } catch (err) {
        next(err);
    }
};

exports.signoutUser = async (req, res) => {
    try {
        res.clearCookie('jwt');
        return res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (err) {
        next(err);
    }
};