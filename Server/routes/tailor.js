var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;/* local Strategy for authentication */
var connectflash = require('connect-flash');
var Tailor = require('../models/Tailor');/* User models require for database access */
var auth = require('../methods/auth');/* encryption and decryption of password module */
var validation = require('../methods/validation');/* validation module for validation of data */
var errorMsg = 'Some error Occured!, Please try again';


router.use(require('express-session')({ secret: 'hockey', resave: true, saveUninitialized: true }));
router.use(passport.initialize());
router.use(passport.session());
router.use(connectflash());

/* Tailor login route */
/* req.body object contain {"username":"tailor username","password":"tailor password"} */
router.post('/login',
  passport.authenticate('local', { failureFlash: 'Error',successFlash:'success' }),
  function(req, res) {
    res.send('Authorised');
    //console.log("in Login");
});
/* tailor logout route */
router.get('/logout',isLoggedIn,function(req,res,next){
//  console.log("Session Deleted");
  req.logout();
  res.send("logged out");
});

/* Tailor sign up route */
/* req.body object contain name:{first:'first name',last:'last name'}, email, mobile, encrypted(or non)(same method will be applied to login) password */
/* Response message need to be changed at later point of time as some code word so that less network traffic will occur for low latency */
router.post('/signup', function(req, res, next) {
  var msg = validation.tailorVal(req.body);
  if(msg==='OK'){
    var tailor = new Tailor(req.body);
    tailor.status = 'unapproved';
    tailor.password = auth.encryptBackEnd(auth.decryptFrontEnd(tailor.password));
    /* check whether username previously exist */
    Tailor.findOne({username:tailor.username},(err,data)=>{
      if(err) res.send(errorMsg);
      else if(data) res.send('Another tailor has already this username ! try again with diffrent username');
      else{
          /* check whether emailid previously exist */
        Tailor.findOne({email:tailor.email},(err,data)=>{
          if(err) res.send(errorMsg);
          else if(data) res.send('You already have account with your Email Id');/* return email id already exist */
          else{
              /* check whether phone number already exist */
            Tailor.findOne({mobile:tailor.mobile},(err,data)=>{
              if(err) res.send(errorMsg);
              else if(data) res.send('You already have account with your Mobile Number');/* return mobile number already exist */
              else{
                /* save user data into database */
                tailor.save(function(err){
                  if(err) res.send(errorMsg);
                  else res.send('Sign Up Successfull. Please Login to Continue');
                });
              }
            });
          }
        })
      }
    });
  }
  else{
    res.send(msg);
  }
});

/* change password */
router.post('/changepassword',isLoggedIn,function(req,res,next){
  var old_pass = req.body.password;
  var new_pass = req.body.newPassword;
  if(old_pass&&new_pass){
    Tailor.findOne({username:req.user.username,password:auth.encryptBackEnd(auth.decryptFrontEnd(old_pass))},function(err,user){
      if(err) res.send(errorMsg);
      if(user){
        Tailor.update({username:req.user.username,password:auth.encryptBackEnd(auth.decryptFrontEnd(old_pass))},{$set:{password:auth.encryptBackEnd(auth.decryptFrontEnd(new_pass))}},function(err){
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
/* create order */
router.post('/createorder',isLoggedIn,function(req,res,next){

    
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    var temp = Tailor.findOne({ 'username': username,'status':'approved' }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (user.password!==auth.encryptBackEnd(auth.decryptFrontEnd(password))) { return done(null, false);}
     return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  Tailor.findById(id, function (err, user) {
    done(err, user);
  });
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  else{
    res.send("Tailor Unauthenticated");
  }
}
module.exports = router;
