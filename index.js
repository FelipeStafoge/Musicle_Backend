require('dotenv').config();
const app = require("./src/endpoints");
const connectDB = require("./src/connectMongo");
const cors = require('cors')
connectDB();
const PORT = process.env.PORT;


app.use(cors());
app.listen(PORT, () => {
    
    
});