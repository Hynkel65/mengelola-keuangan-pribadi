const Income = require('../models/Incomes');
const upload = require('../middleware/uploadMiddleware');

const fs = require('fs');
const path = require('path');

// @desc    Get all incomes
// @route   GET /api/v1/incomes
// @access  Public
exports.getIncomes = async (req, res, next) => {
    try {
        const income = await Income.find();

        return res.status(200).json({
            success: true,
            count: income.length,
            data: income
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
} 

// @desc    Add income
// @route   POST /api/v1/incomes
// @access  Public
exports.addIncome = async (req, res, next) => {
    try {
        const { title, amount, date, category, description } = req.body;
        const image = req.file;

        const income = await Income.create({
            title,
            amount,
            date,
            category,
            description,
            image: image ? image.filename : undefined
        });

        return res.status(201).json({
            success: true,
            data: income
        });
    } catch (err) {
        if(err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.messages);

            return res.status(400).json({
                success: false,
                error: messages
            });
        } else {
            return res.status(500).json({
                success: false,
                error: 'Server Error'
            });
        }
    }
} 

// @desc    Delete income
// @route   DELETE /api/v1/incomes/:id
// @access  Public
exports.deleteIncome= async (req, res, next) => {
    try {
        const income = await Income.findById(req.params.id);

        if(!income) {
            return res.status(404).json({
                success: false,
                error: 'No transaction found'
            });
        }

        if (income.image) {
            const imagePath = path.join(__dirname, '../uploads', income.image);
            fs.unlinkSync(imagePath);
          }

        await income.remove();

        return res.status(200).json({
            success: true,
            data: {}
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
}

// @desc    Update income
// @route   PATCH /api/v1/incomes/:id
// @access  Public
exports.updateIncome = async (req, res, next) => {
    try {
        const income = await Income.findById(req.params.id);
        if(!income) {
            return res.status(404).json({
                success: false,
                error: 'No income found'
            });
        }
        
        income.title = req.body.title;
        income.amount = req.body.amount;
        income.date = req.body.date;
        income.category = req.body.category;
        income.description = req.body.description;

        await income.save();
        
        return res.status(200).json({
            success: true,
            data: income
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
}
