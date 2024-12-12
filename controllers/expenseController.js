const Expense = require('../models/Expenses');
const upload = require('../middleware/uploadMiddleware');


// @desc    Get all expense
// @route   GET /api/v1/expenses
// @access  Public
exports.getExpenses = async (req, res, next) => {
    try {
        const expense = await Expense.find();

        return res.status(200).json({
            success: true,
            count: expense.length,
            data: expense
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
} 

// @desc    Add expense
// @route   POST /api/v1/expenses
// @access  Public
exports.addExpense = async (req, res, next) => {
    try {
        const { title, amount, date, category, description } = req.body;
        const image = req.file;

        const expense = await Expense.create({
            title,
            amount,
            date,
            category,
            description,
            image: req.file ? req.file.filename : undefined
        });

        return res.status(201).json({
            success: true,
            data: expense
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

// @desc    Delete expense
// @route   DELETE /api/v1/expenses/:id
// @access  Public
exports.deleteExpense= async (req, res, next) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if(!expense) {
            return res.status(404).json({
                success: false,
                error: 'No transaction found'
            });
        }

        await expense.remove();

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

// @desc    Update expense
// @route   PATCH /api/v1/expenses/:id
// @access  Public
exports.updateExpense = async (req, res, next) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if(!expense) {
            return res.status(404).json({
                success: false,
                error: 'No expense found'
            });
        }

        expense.title = req.body.title;
        expense.amount = req.body.amount;
        expense.date = req.body.date;
        expense.category = req.body.category;
        expense.description = req.body.description;
        
        await expense.save();

        return res.status(200).json({
            success: true,
            data: expense
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
}
