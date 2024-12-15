const express = require('express');
const incomeRouter = express.Router();

const upload = require('../middleware/uploadMiddleware');

const {
    getIncomes,
    addIncome,
    deleteIncome,
    updateIncome
} = require('../controllers/incomeController');

incomeRouter
    .route('/')
    .get(getIncomes)
    .post(upload.single('image'), addIncome);

incomeRouter
    .route('/:id')
    .delete(deleteIncome)
    .patch(updateIncome);

module.exports = incomeRouter;