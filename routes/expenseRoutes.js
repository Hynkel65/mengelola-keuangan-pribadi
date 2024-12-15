const express = require('express');
const expenseRouter = express.Router();

const upload = require('../middleware/uploadMiddleware');

const {
    getExpenses,
    addExpense,
    deleteExpense,
    updateExpense
} = require('../controllers/expenseController');

expenseRouter
    .route('/')
    .get(getExpenses)
    .post(upload.single('image'), addExpense);

expenseRouter
    .route('/:id')
    .delete(deleteExpense)
    .patch(updateExpense);

module.exports = expenseRouter;
