const mongoose = require("mongoose");
const app = require("./endpoints");

PORT = process.env.PORT;

app.listen(PORT, ()=>{
    mongoose.connect(process.env.MONGODB_CONNECT_URI);
    

    
})