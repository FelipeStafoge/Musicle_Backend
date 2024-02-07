require('dotenv').config();

const mongoose = require("mongoose");
const app = require("./src/endpoints");
const connectDB = require("./src/connectMongo");

connectDB();
const PORT = process.env.PORT;

app.listen(PORT, () => {
    
});