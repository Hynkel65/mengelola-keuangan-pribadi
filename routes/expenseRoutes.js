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
    .route('/expenses')  // Change this route from /incomes to /expenses
    .get(getExpenses)
    .post(upload.single('image'), addExpense);

expenseRouter
    .route('/expenses/:id')  // Change this route from /incomes/:id to /expenses/:id
    .delete(deleteExpense)
    .patch(updateExpense);

module.exports = expenseRouter;
