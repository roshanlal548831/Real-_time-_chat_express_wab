const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL)
.then(() =>{
    console.log("data connected");
})
.catch(()=>{
    console.log("No connection data")
});