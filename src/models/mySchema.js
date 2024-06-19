const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const clientSchema = new mongoose.Schema({
    firstname:{
        type: String,
        require:true
    },
    lastname:{
        type: String,
        require:true
    },
    email:{
        type: String,
        require:true,
        unique: true
    },
    password:{
        type: String,
        require:true,
    },
    cpassword:{
        type: String,
        require:true,
    },
    tokens:[{
        token:{
            type: String,
            require:true,
        }
    }]
   
});

clientSchema.methods.genrateAuthToken = async function(){
    try {
        const token = jwt.sign({_id: this._id.toString()},process.env.SECRET);
        this.tokens = this.tokens.concat({token:token})
        await this.save()
        return token

    } catch (error) {
       
        console.log("the error part => ",error)
    }
}

clientSchema.pre("save", async function(next){
     if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10)
        this.cpassword = await bcrypt.hash(this.cpassword,10)
       
     };
     next()
})

const Client = new mongoose.model("client",clientSchema);

module.exports = Client;