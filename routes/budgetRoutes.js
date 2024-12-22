const express = require('express');
const { requireAuth } = require('../middleware/authMiddleware');
const { validateBudget, handleValidationErrors } = require('../middleware/budgetMiddleware');
const {
    createBudget,
    getBudgets,
    updateBudget,
    deleteBudget
} = require('../controllers/budgetController');

const router = express.Router();

// Create a new budget
router.post('/', requireAuth, validateBudget, handleValidationErrors, createBudget);

// Get all budgets for a user
router.get('/', requireAuth, getBudgets);

// Update a budget
router.patch('/:id', requireAuth, validateBudget, handleValidationErrors, updateBudget);

// Delete a budget
router.delete('/:id', requireAuth, deleteBudget);

module.exports = router;