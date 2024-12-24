const { body, validationResult } = require('express-validator');

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

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
};

module.exports = { validateBudget, handleValidationErrors };