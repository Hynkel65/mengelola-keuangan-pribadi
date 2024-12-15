const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
        maxLength: 20
    },
    amount: {
        type: Number,
        required: true,
        maxLength: 20
    },
    type: {
        type: String,
        default: "income"
    },
    date: {
        type: Date,
        trim: true,
        required: true
    },
    category: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true,
        maxLength: 50
    },
    image: {
        type: String,
        trim: true,
        required: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Income', incomeSchema);