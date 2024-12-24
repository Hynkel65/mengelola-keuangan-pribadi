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

router.post('/', requireAuth, validateBudget, handleValidationErrors, createBudget);

router.get('/', requireAuth, getBudgets);

router.patch('/:id', requireAuth, validateBudget, handleValidationErrors, updateBudget);

router.delete('/:id', requireAuth, deleteBudget);

module.exports = router;