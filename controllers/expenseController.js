const Expense = require('../models/Expenses');
const upload = require('../middleware/uploadMiddleware');
const fs = require('fs');
const path = require('path');

// @desc    Get all expenses for the logged-in user
// @route   GET /api/v1/expenses
// @access  Private (user.id)
exports.getExpenses = async (req, res, next) => {
    try {
        // Fetch all expenses for the current user
        const expenses = await Expense.find({ user: req.user.id });

        // Send a successful response with the expenses data
        return res.status(200).json({
            success: true,
            count: expenses.length,
            data: expenses
        });
    } catch (err) {
        // Handle errors and send a server error response
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
}

// @desc    Add a new expense
// @route   POST /api/v1/expenses
// @access  Private (user.id)
exports.addExpense = async (req, res, next) => {
    try {
        const { title, amount, date, category, description } = req.body;
        const image = req.file ? req.file.filename : undefined;

        // Create a new expense document
        const expense = await Expense.create({
            title,
            amount,
            date,
            category,
            description,
            user: req.user.id,
            image
        });

        // Send a successful response with the created expense data
        return res.status(201).json({
            success: true,
            data: expense
        });
    } catch (err) {
        // Handle validation errors
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                error: messages
            });
        } else {
            // Handle other errors and send a server error response
            return res.status(500).json({
                success: false,
                error: 'Server Error'
            });
        }
    }
}

// @desc    Delete an expense
// @route   DELETE /api/v1/expenses/:id
// @access  Private (user.id)
exports.deleteExpense = async (req, res, next) => {
    try {
        // Find the expense by ID and user
        const expense = await Expense.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!expense) {
            // If no expense found, respond with an error
            return res.status(404).json({
                success: false,
                error: 'No transaction found'
            });
        }

        // Delete the associated image file if it exists
        if (expense.image) {
            const imagePath = path.join(__dirname, '../uploads', expense.image);
            try {
                if (expense.image) {
                    fs.unlinkSync(imagePath);
                }
            } catch (err) {
                console.error('Error deleting image file:', err.message);
            }
            
        }

        // Remove the expense record
        await expense.remove();

        // Respond with success
        return res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        // Handle any server errors
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};


// @desc    Update an existing expense
// @route   PATCH /api/v1/expenses/:id
// @access  Private (user.id)
exports.updateExpense = async (req, res, next) => {
    try {
        // Find the expense by ID and user
        const expense = await Expense.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!expense) {
            // If no expense is found, send a 404 response
            return res.status(404).json({
                success: false,
                error: 'No expense found'
            });
        }

        // Update the expense fields
        expense.title = req.body.title || expense.title;
        expense.amount = req.body.amount || expense.amount;
        expense.date = req.body.date || expense.date;
        expense.category = req.body.category || expense.category;
        expense.description = req.body.description || expense.description;

        // If a new image is uploaded, delete the old one and update the image field
        if (req.file) {
            if (expense.image) {
                try {
                    const oldImagePath = path.join(__dirname, '../uploads', expense.image);
                    fs.unlinkSync(oldImagePath);
                } catch (err) {
                    console.error('Error deleting old image:', err.message);
                }
            }
            expense.image = req.file.filename;
        }

        // Save the updated expense
        await expense.save();

        // Send a successful response with the updated expense data
        return res.status(200).json({
            success: true,
            data: expense
        });
    } catch (err) {
        // Handle errors and send a server error response
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
}