var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var connectflash = require('connect-flash');
var User = require('../models/User');
var auth = require('../methods/auth');
var validation = require('../methods/validation');
var errorMsg = 'Some error Occured!, Please try again';

router.use(require('express-session')({ secret: 'cricket', resave: true, saveUninitialized: true }));
router.use(passport.initialize());
router.use(passport.session());
router.use(connectflash());

router.post('/login',
  passport.authenticate('local', { failureFlash: 'Error',successFlash:'success' }),
  function(req, res) {
    res.json({responseText:'Authorised'});
    console.log("in Login");
});

router.get('/logout',function(req,res,next){
  console.log("Session Deleted");
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
              if(err) {
                res.send(errorMsg);
                console.log(err);
              }
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

passport.use(new LocalStrategy(
  function(username, password, done) {
    var temp = User.findOne({ 'email': username }, function (err, user) {
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
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

module.exports = router;
