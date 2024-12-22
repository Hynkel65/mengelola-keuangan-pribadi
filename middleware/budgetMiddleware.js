const { body, validationResult } = require('express-validator');

// Middleware to validate budget data
const validateBudget = [
    body('category')
        .notEmpty()
        .withMessage('Category is required'),
    body('amount')
        .isNumeric()
        .withMessage('Amount must be a number')
        .notEmpty()
        .withMessage('Amount is required'),
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
};

module.exports = { validateBudget, handleValidationErrors };