const express = require('express')
const router = express.Router()

const { googleController } = require('../controllers/googleAuth.controller')
const { signup } = require('../controllers/auth');
const { login } = require('../controllers/auth');
const {sendOTP, verifyOTP} = require('../controllers/otp')
// Google Login
router.post('/googlelogin',googleController);
//signUp
router.post('/signup',signup);
// login
router.post('/login',login);
// mobile otp
router.post('/sendOTP',sendOTP);
// verify otp
router.post('/verifyOTP',verifyOTP);

module.exports = router