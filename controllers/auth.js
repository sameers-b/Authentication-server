const crypto = require('crypto');
const User = require("../models/User");

// Login user
exports.login = async (req, res, next) => {
   const { mobile, password } = req.body;
   console.log(mobile, password);
   // Check if email and password is provided
   if (!mobile || !password) {
     return next(new ErrorResponse("Please provide an mobile no. and password", 400));
   }
 
   try {
     // Check that user exists by email
     const user = await User.findOne({ mobile }).select("+password");
 
     if (!user) {
       return next(new ErrorResponse("Invalid credentials", 401));
     }
 
     // Check that password match
     const isMatch = await user.matchPassword(password);
 
     if (!isMatch) {
       return next(new ErrorResponse("Invalid credentials", 401));
     }
 
     sendToken(user, 200, res,()=>console.log("login sucessful"));
   } catch (err) {
     next(err);
   }
 };
 

//  signUp user
exports.signup = async (req, res, next) => {
   const { name, mobile, password } = req.body;
   // console.log(name ,mobile)
   try{
      const user = await User.create({
         name,
         mobile,
         password
      });

      sendToken(user, 200, res);
   } catch (err){
      next(err);
   }
};

const sendToken = (user, statusCode, res) => {
   const token = user.getSignedJwtToken();
   res.status(statusCode).json({ sucess: true, token });
 };