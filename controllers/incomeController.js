const Income = require('../models/Incomes');
const upload = require('../middleware/uploadMiddleware');
const fs = require('fs');
const path = require('path');

// @desc    Get all incomes for a user
// @route   GET /api/v1/incomes
// @access  user.id
exports.getIncomes = async (req, res, next) => {
    try {
        // Find all incomes associated with the authenticated user
        const incomes = await Income.find({ user: req.user.id });

        // Respond with the incomes data
        return res.status(200).json({
            success: true,
            count: incomes.length,
            data: incomes
        });
    } catch (err) {
        // Handle any server errors
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Add a new income
// @route   POST /api/v1/incomes
// @access  user.id
exports.addIncome = async (req, res, next) => {
    try {
        const { title, amount, date, category, description } = req.body;
        const image = req.file;

        // Create a new income record
        const income = await Income.create({
            title,
            amount,
            date,
            category,
            description,
            user: req.user.id,
            image: image ? image.filename : undefined
        });

        // Respond with the created income data
        return res.status(201).json({
            success: true,
            data: income
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            // Handle validation errors
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                error: messages
            });
        } else {
            // Handle any server errors
            return res.status(500).json({
                success: false,
                error: 'Server Error'
            });
        }
    }
};

// @desc    Delete an income
// @route   DELETE /api/v1/incomes/:id
// @access  user.id
exports.deleteIncome = async (req, res, next) => {
    try {
        // Find the income by ID and user
        const income = await Income.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!income) {
            // If no income found, respond with an error
            return res.status(404).json({
                success: false,
                error: 'No transaction found'
            });
        }

        // Delete the associated image file if it exists
        if (income.image) {
            const imagePath = path.join(__dirname, '../uploads', income.image);
            try {
                if (income.image) {
                    fs.unlinkSync(imagePath);
                }
            } catch (err) {
                console.error('Error deleting image file:', err.message);
            }
            
        }

        // Remove the income record
        await income.remove();

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

// @desc    Update an income
// @route   PATCH /api/v1/incomes/:id
// @access  user.id
exports.updateIncome = async (req, res, next) => {
    try {
        // Find the income by ID and user
        const income = await Income.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!income) {
            return res.status(404).json({
                success: false,
                error: 'No income found'
            });
        }

        // Update income fields with request data
        income.title = req.body.title || income.title;
        income.amount = req.body.amount || income.amount;
        income.date = req.body.date || income.date;
        income.category = req.body.category || income.category;
        income.description = req.body.description || income.description;

        // Handle image upload
        if (req.file) {
            // Delete the old image if it exists
            if (income.image) {
                try {
                    const oldImagePath = path.join(__dirname, '../uploads', income.image);
                    fs.unlinkSync(oldImagePath);
                } catch (err) {
                    console.error('Error deleting old image:', err.message);
                }
            }
            // Save the new image path
            income.image = req.file.filename;
        }

        // Save the updated income
        await income.save();

        return res.status(200).json({
            success: true,
            data: income
        });
    } catch (err) {
        console.error('Error updating income:', err.message);
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};