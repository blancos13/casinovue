const mongoose = require('mongoose');

// Set mongoose mode to strict and deactive auto indexing
mongoose.set('strictQuery', true);
mongoose.set('autoIndex', false);

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.DATABASE_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch(err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
}

module.exports = connectDB;
