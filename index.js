require('dotenv').config();
const app = require("./src/endpoints");
const connectDB = require("./src/connectMongo");

connectDB();
const PORT = process.env.PORT;

app.listen(PORT, () => {
    
    
});