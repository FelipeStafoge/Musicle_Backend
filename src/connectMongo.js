require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECT_URI);
        console.log("Conectado!");
    } catch (error) {
        console.log("Connect failed " + error.message);
    }
}

module.exports = connectDB;