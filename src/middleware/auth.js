const jwt = require("jsonwebtoken");
const Client = require("../models/mySchema");

const auth = async(req,res,next)=>{
  const token = req.cookies.jwt;
  if(!token){
    return res.render("login")
  }else{
    const varifyUser = jwt.verify(token,process.env.SECRET);
    console.log(varifyUser)
    const user = await Client.findOne({_id:varifyUser._id});
    console.log(user);
  
    req.token = token;
    req.user = user;
  
    next()
  }
 

};


module.exports = auth