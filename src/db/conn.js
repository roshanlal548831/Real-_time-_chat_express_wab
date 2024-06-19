const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/Roshandb")
.then(() =>{
    console.log("data connected");
})
.catch(()=>{
    console.log("No connection data")
});