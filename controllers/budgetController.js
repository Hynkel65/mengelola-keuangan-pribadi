const Budget = require('../models/Budget');

// @desc    Create a new budget
// @route   POST /api/v1/budgets
// @access  Private
exports.createBudget = async (req, res) => {
    try {
        const { category, amount } = req.body;
        const budget = await Budget.create({
            category,
            amount,
            user: req.user.id
        });
        return res.status(201).json({ success: true, data: budget });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get all budgets for a user
// @route   GET /api/v1/budgets
// @access  Private
exports.getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({ user: req.user.id });
        return res.status(200).json({ success: true, data: budgets });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Update a budget
// @route   PATCH /api/v1/budgets/:id
// @access  Private
exports.updateBudget = async (req, res) => {
    try {
        const budget = await Budget.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!budget) {
            return res.status(404).json({ success: false, error: 'Budget not found' });
        }
        return res.status(200).json({ success: true, data: budget });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Delete a budget
// @route   DELETE /api/v1/budgets/:id
// @access  Private
exports.deleteBudget = async (req, res) => {
    try {
        const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!budget) {
            return res.status(404).json({ success: false, error: 'Budget not found' });
        }
        return res.status(200).json({ success: true, data: {} });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Server Error' });
    }
};