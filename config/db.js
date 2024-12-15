const mongoose = require('mongoose');

// Function to connect to the MongoDB database
const connectDB = async () => {
    // Enable strict query mode to enforce strict validation on queries
    mongoose.set('strictQuery', true);

    try {
        // Attempt to connect to the MongoDB database using the connection string from environment variables
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true, // Use the new URL parser
            useUnifiedTopology: true // Use the new server discovery and monitoring engine
        });

        // Log a success message with the host name of the connected server
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
    } catch (err) {
        // Log an error message and exit the process with a failure code
        console.log(`Error: ${err.message}`.red);
        process.exit(1);
    }
}

// Export the connectDB function to be used in other parts of the application
module.exports = connectDB;