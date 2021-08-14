const GoogleUser = require('../models/googleAuth.model');
// const _ = require('lodash');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');


const client = new OAuth2Client()
//Google Login 
exports.googleController = (req, res) =>{
   const {idToken} = req.body;
  //  console.log(idToken);
    client
    .verifyIdToken({ idToken, audience: '1028936227097-nqg74um6car90q3u5ibuge5fg6sl7om2.apps.googleusercontent.com' })
    .then(response => {
      console.log('GOOGLE LOGIN RESPONSE',response)
      const { email_verified, name, email } = response.payload;
      if (email_verified) {
        GoogleUser.findOne({ email }).exec((err, user) => {
          if (user) {
            const token = jwt.sign({ _id: user._id }, "mynameissameersinghiambuildloginwithgoogle", {
              expiresIn: '7d'
            });
            const { _id, email, name, role } = user;
            return res.json({
              token,
              user: { _id, email, name, role }
            });
          } else {
            let password = email + 'mynameissameersinghiambuildloginwithgoogle';
            user = new GoogleUser({ name, email, password });
            user.save((err, data) => {
              if (err) {
                console.log('ERROR GOOGLE LOGIN ON USER SAVE', err);
                return res.status(400).json({
                  error: 'GoogleUser signup failed with google'
                });
              }
              const token = jwt.sign(
                { _id: data._id },
                'mynameissameersinghiambuildloginwithgoogle',
                { expiresIn: '7d' }
              );
              const { _id, email, name, role } = data;
              return res.json({
                token,
                user: { _id, email, name, role }
              });
            });
          }
        });
      } else {
        return res.status(400).json({
          error: 'Google login failed. Try again'
        });
      }
    });
}