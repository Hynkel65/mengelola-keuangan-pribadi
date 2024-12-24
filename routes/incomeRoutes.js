const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');

const {
    getIncomes,
    addIncome,
    deleteIncome,
    updateIncome
} = require('../controllers/incomeController');

router
    .route('/')
    .get(getIncomes)
    .post(upload.single('image'), addIncome);

router
    .route('/:id')
    .delete(deleteIncome)
    .patch(upload.single('image'), (req, res, next) => {
        if (req.file && req.file.mimetype.startsWith('image/')) {
            next();
        } else if (req.file) {
            return res.status(400).json({ success: false, error: 'Invalid file type. Only images are allowed.' });
        } else {
            next();
        }
    }, updateIncome);

module.exports = router;