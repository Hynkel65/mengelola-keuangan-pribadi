const mongoose = require('mongoose');

const connectDB = async () => {
    mongoose.set('strictQuery', true);
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    } catch (err) {
        process.exit(1);
    }
}

module.exports = connectDB;