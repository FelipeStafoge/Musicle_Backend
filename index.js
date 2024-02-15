require('dotenv').config();
const app = require("./src/endpoints");
const connectDB = require("./src/connectMongo");

connectDB();
const PORT = process.env.PORT;


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

app.listen(PORT, () => {
    
    
});