const mongoose = require('mongoose');

// Define the schema for an Expense
const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true, // Remove whitespace from both sides
      required: true, // Title is required
      maxLength: 20, // Maximum length of 20 characters
    },
    amount: {
      type: Number,
      required: true, // Amount is required
      maxLength: 20, // Note: maxLength is not applicable for Number type, consider using min/max
    },
    type: {
      type: String,
      default: "expense", // Default value is 'expense'
    },
    date: {
      type: Date,
      trim: true, // Remove whitespace from both sides
      required: true, // Date is required
    },
    category: {
      type: String,
      trim: true, // Remove whitespace from both sides
      required: true, // Category is required
    },
    description: {
      type: String,
      trim: true, // Remove whitespace from both sides
      required: true, // Description is required
      maxLength: 50, // Maximum length of 50 characters
    },
    image: {
      type: String,
      trim: true, // Remove whitespace from both sides
      required: false, // Image is optional
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to User model
      required: true, // User is required
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
  }
);

// Export the Expense model
module.exports = mongoose.model('Expense', expenseSchema);