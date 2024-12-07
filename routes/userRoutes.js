const express = require('express');
const userRouter = express.Router();

const { requireAuth } = require('../middleware/authMiddleware');

const{
    login,
    signup,
    logout,
    auth,
    getuser
} = require('../controllers/authController');

userRouter
    .route('/user/login')
    .post(login);

userRouter
    .route('/user/signup')
    .post(signup);

userRouter
    .route('/user/auth')
    .get(auth);

userRouter
    .route('/user/getprofile')
    .get(requireAuth, getuser);

userRouter
    .route('/user/logout')
    .get(logout);

module.exports = userRouter;