const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = 'dbf38918e385afac09206632f06e543b430eeb4dfd1d1fa9acbe97efbd0b96d499e871dbe0cf943799f679e8a52c317c69ad0f83626a94303dc26612d1567a56';

const UserSchema = new mongoose.Schema({
   name: {
     type: String,
     required: [true, "Please provide name"],
   },
   mobile: {
     type: Number,
     required: [true, "Please provide Mobile no."],
     unique: true,
   },
   password: {
     type: String,
     required: [true, "Please add a password"],
     minlength: 6,
     select: false,
   },
   resetPasswordToken: String,
   resetPasswordExpire: Date,
 });
 
 UserSchema.pre("save", async function (next) {
   if (!this.isModified("password")) {
     next();
   }
 
   const salt = await bcrypt.genSalt(10);
   this.password = await bcrypt.hash(this.password, salt);
   next();
 });
 
 UserSchema.methods.matchPassword = async function (password) {
   return await bcrypt.compare(password, this.password);
 };
 
 UserSchema.methods.getSignedJwtToken = function () {
   return jwt.sign({ id: this._id },JWT_SECRET, {
     expiresIn: '30s',
   });
 };
 
 UserSchema.methods.getResetPasswordToken = function () {
   const resetToken = crypto.randomBytes(20).toString("hex");
 
   // Hash token (private key) and save to database
   this.resetPasswordToken = crypto
     .createHash("sha256")
     .update(resetToken)
     .digest("hex");
 
   // Set token expire date
   this.resetPasswordExpire = Date.now() + 10 * (60 * 1000); // Ten Minutes
 
   return resetToken;
 };
 
 const User = mongoose.model("User", UserSchema);
 
 module.exports = User;
 