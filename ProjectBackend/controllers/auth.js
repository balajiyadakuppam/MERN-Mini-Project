const User = require("../models/user");
const { check, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var expressJwt = require("express-jwt");

exports.signup = (req,res)=>{

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg, 
            param:errors.array()[0].param
        });
    }
    const user = new User(req.body);
    user.save((err,user)=>{
        if(err)
        {
            return res.status(400).json({
                err: "NOT able to write to DB"
            });
        }
        res.json({
            name:user.name,
            email:user.email,
            id:user._id
        });
    })
};

exports.signin = (req,res)=>{
  const {email,password} = req.body;
  //console.log(email);
 
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).json({
        error: errors.array()[0].msg, 
        param:errors.array()[0].param
    });
   }
   
   User.findOne({email}, (err,user)=>{
       if(err || !user){
           return res.status(400).json({
               error:"USER not found"
           });
       }

       if(!user.authenticate(password)){
           return res.status(401).json({
               error:"Email and Password do not match"
           });
       }
       //CREATE TOKEN
       const token = jwt.sign({_id:user._id},process.env.SECRET);
       
       //PUT TOKEN IN COOKIE
       res.cookie("token",token,{expire:new Date()+9999});

       //SEND RESPONSE TO FRONT END
       const {_id,name,email,role} = user;
       return res.json({
           token:token,user:{_id,name,email,role}
       });
   });

};


exports.signout = (req,res)=>{
    res.clearCookie("token");
    res.send("Account signed out successfully");
};

//protected routes
exports.isSignedIn = expressJwt({
    secret : "secret",
    userProperty: "auth"
});


//custom middleware
exports.isAuthenticated = (req,res,next)=>{

    let checker = req.profile && req.auth && req.profile._id==req.auth._id;
    if(!checker){
        return res.status(403).json({
            error:"access denied"
        });
    }
    next();
};

exports.isAdmin = (req,res,next)=>{
    if(req.profile.role ==0){
        return res.status(403).json({
            error:"you're not a admin"
        });
    }
    next();
};