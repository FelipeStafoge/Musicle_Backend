const mongoose = require("mongoose");
const app = require("./endpoints");

app.listen(3000, ()=>{
    mongoose.connect('mongodb+srv://felipestafoge11:EyA1K3Yk5mH9Rxyd@musicle.hop1c1g.mongodb.net/?retryWrites=true&w=majority');
    

    
})