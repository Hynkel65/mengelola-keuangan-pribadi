const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');

const {
    getExpenses,
    addExpense,
    deleteExpense,
    updateExpense
} = require('../controllers/expenseController');

router
    .route('/')
    .get(getExpenses)
    .post(upload.single('image'), addExpense);

router
    .route('/:id')
    .delete(deleteExpense)
    .patch(upload.single('image'), (req, res, next) => {
        if (req.file && req.file.mimetype.startsWith('image/')) {
            next();
        } else if (req.file) {
            return res.status(400).json({ success: false, error: 'Invalid file type. Only images are allowed.' });
        } else {
            next();
        }
    }, updateExpense);

module.exports = router;