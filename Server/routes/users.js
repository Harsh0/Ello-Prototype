var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;/* local Strategy for authentication */
var connectflash = require('connect-flash');
var User = require('../models/User');/* User models require for database access */
var auth = require('../methods/auth');/* encryption and decryption of password module */
var validation = require('../methods/validation');/* validation module for validation of data */
var errorMsg = 'Some error Occured!, Please try again';

router.use(require('express-session')({ secret: 'cricket', resave: true, saveUninitialized: true }));
router.use(passport.initialize());
router.use(passport.session());
router.use(connectflash());

/* User login route */
/* req.body object contain {"username":"user email","password":"user password"} */
router.post('/login',
  passport.authenticate('local', { failureFlash: 'Error',successFlash:'success' }),
  function(req, res) {
    res.send('Authorised');
    //console.log("in Login");
});
/* User logout route */
router.get('/logout',isLoggedIn,function(req,res,next){
//  console.log("Session Deleted");
  req.logout();
  res.send("logged out");
});

/* User sign up route */
/* req.body object contain name, email, mobile, encrypted(or non)(same method will be applied to login) password */
/* Response message need to be changed at later point of time as some code word so that less network traffic will occur for low latency */
router.post('/signup', function(req, res, next) {
  var msg = validation.userVal(req.body);
  if(msg==='OK'){
    var user = new User(req.body);
    user.password = auth.encryptBackEnd(auth.decryptFrontEnd(user.password));
    /* check whether email id previously exist */
    User.findOne({email:user.email},(err,data)=>{
      if(err) res.send(errorMsg);
      else if(data) res.send('You already have account with your Email Id');/* return email id already exist */
      else{
          /* check whether phone number already exist */
        User.findOne({mobile:user.mobile},(err,data)=>{
          if(err) res.send(errorMsg);
          else if(data) res.send('You already have account with your Mobile Number');/* return mobile number already exist */
          else{
            /* save user data into database */
            user.save(function(err){
              if(err) res.send(errorMsg);
              else res.send('Sign Up Successfull. Please Login to Continue');
            });
          }
        });
      }
    });
  }
  else{
    res.send(msg);
  }
});

/* User change password route */
router.post('/changepassword',isLoggedIn,function(req,res,next){
  var old_pass = req.body.password;
  var new_pass = req.body.newPassword;
  if(old_pass&&new_pass){
    User.findOne({email:req.user.email,password:auth.encryptBackEnd(auth.decryptFrontEnd(old_pass))},function(err,user){
      if(err) res.send(errorMsg);
      if(user){
        User.update({email:req.user.email,password:auth.encryptBackEnd(auth.decryptFrontEnd(old_pass))},{$set:{password:auth.encryptBackEnd(auth.decryptFrontEnd(new_pass))}},function(err){
          if(err) res.send(errorMsg);
          else{
            res.send('password updated');
          }
        });
      }
      else{
        res.send('invalid password');
      }
    })
  }
  else{
    res.send('field incompletion');
  }
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    var temp = User.findOne({ 'email': username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (user.password!==auth.encryptBackEnd(auth.decryptFrontEnd(password))) { return done(null, false);}
      else return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

/* User authentication checking */
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  else{
    res.send("User Unauthenticated");
  }
}
module.exports = router;
