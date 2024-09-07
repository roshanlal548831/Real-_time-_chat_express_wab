const express = require("express");
const app = express();
const dotenv = require("dotenv")
dotenv.config()
const port = process.env.PORT || 3000;
const http = require("http").Server(app)
const path = require("path");
const hbs = require("hbs");
require("./db/conn");
const Client = require("./models/mySchema");
const bcrypt = require("bcrypt");
const cookiesParser = require("cookie-parser")
const auth = require("./middleware/auth")


const tampltes = path.join(__dirname,"../tamplates/views")
const partials = path.join(__dirname,"../tamplates/partials")

app.set("view engine","hbs");
app.set("views",tampltes);
hbs.registerPartials(partials);

app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(cookiesParser())

app.use(express.static("public"))

app.get("/",(req,res)=>{
    res.render("index")
});
app.get("/chat",auth, async(req,res)=>{
    try {
        res.render("chat")
    } catch (error) {
        res.send(error)
    }
});
app.get("/register",(req,res)=>{
    res.render("register")
});
app.get("/login",(req,res)=>{
    res.render("login")
});
app.get("/logout",auth, async(req,res)=>{
     try {
        console.log(req.user)

        req.user.tokens = req.user.tokens.filter((currentElement)=>{
            return currentElement.token !== req.token
        })
        // req.user.tokens = [];

        res.clearCookie("jwt");


        console.log("logout")

       await req.user.save();
       res.render("login")

     } catch (error) {
        res.status(401).send(error)
     }
});

app.post("/register",async(req,res)=>{
       try {
         
        const password = req.body.password;
        const cpassword = req.body.cpassword;
        if(password === cpassword){
            const submit = new Client({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: password,
                cpassword: cpassword,
            });
          console.log("the success part ",submit);

        const token = await submit.genrateAuthToken()
        console.log("the token part = ",token)
           res.cookie("jwt",token,{
            //    expires: new Date(Date.now()+30000),
               httpOnly:true
           })

           const result = await submit.save();
           res.status(201).render("chat")

        }else{
            res.send("password are not matching")
        }

       } catch (error) {
        res.status(404).send(error)
        console.log("the error part")
       }
});

app.post("/login", async(req,res)=>{
   
     try {
      const password = req.body.password;
      const email = req.body.email;
      const urlemail = await Client.findOne({email: email});
      const ismail = await bcrypt.compare(password , urlemail.password);
    
      const token = await urlemail?.genrateAuthToken()
      console.log("the token part = ",token)
      
      res.cookie("jwt",token,{
        // expires: new Date(Date.now()+500000),
        httpOnly:true
    })

      if(ismail){
            res.render("chat");
      }else{
        // res.send("password are not matching")
        res.render("login")
      }

     } catch (error) {
        // console.log(error)
        res.render("login")
     }
    
});

//use chat wab socket.io 
const io = require("socket.io")(http);
const users = {};

io.on("connection", socket =>{
      socket.on("new-user-joined",name =>{
          console.log("new user ",name)
        //   function name (value){
        //           return name
        //   }
          users[socket.id] = name;
          socket.broadcast.emit("user-joined",name)
      });
      socket.on("send",message =>{
        socket.broadcast.emit("receive",{message: message, name: users[socket.id]})
    })

})







http.listen(port,()=>{
    console.log(`server success fully run ${port}`)
})
