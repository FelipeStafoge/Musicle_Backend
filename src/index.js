require('dotenv').config();

const mongoose = require("mongoose");
const app = require("./endpoints");
const connectDB = require("./connectMongo");

connectDB();
const PORT = process.env.PORT;

app.listen(PORT, () => {
    
});