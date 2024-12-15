const mongoose = require('mongoose');

// Define the schema for the Income model
const incomeSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true, // Remove whitespace from both ends
        required: true, // Field is required
        maxLength: 20 // Maximum length of 20 characters
    },
    amount: {
        type: Number,
        required: true, // Field is required
        maxLength: 20 // Maximum length of 20 characters
    },
    type: {
        type: String,
        default: "income" // Default value is "income"
    },
    date: {
        type: Date,
        trim: true, // Remove whitespace from both ends
        required: true // Field is required
    },
    category: {
        type: String,
        trim: true, // Remove whitespace from both ends
        required: true // Field is required
    },
    description: {
        type: String,
        trim: true, // Remove whitespace from both ends
        required: true, // Field is required
        maxLength: 50 // Maximum length of 50 characters
    },
    image: {
        type: String,
        trim: true, // Remove whitespace from both ends
        required: false // Field is optional
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true // Field is required
    }
}, {
    timestamps: true // Automatically add createdAt and updatedAt timestamps
});

// Export the Income model
module.exports = mongoose.model('Income', incomeSchema);