var common = require('../common');
var config = common.config();

var twilio_account_sid = config.twilio_account_sid;
var twilio_auth_token = config.twilio_auth_token;
var twilio_number = config.twilio_number;

var express = require('express');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var rant = require("rantjs");
var client = require('twilio')(twilio_account_sid, twilio_auth_token);
var router = express.Router();
var passport = require('passport');

var initPassport = require('../passport/init');
initPassport(passport);

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Get Me Outta HERE!!', message: req.flash('message'), user: req.user });
});

router.get('/signup', function(req, res){
  res.render('signup',{message: req.flash('message'), user: req.user });
});

router.get('/home', isAuthenticated, function(req, res){
  res.render('home', { user: req.user, message: "" });
});

router.post('/login', passport.authenticate('login', {
  successRedirect: '/home',
  failureRedirect: '/',
  failureFlash : true  
}));

router.post('/signup', passport.authenticate('signup', {
  successRedirect: '/home',
  failureRedirect: '/signup',
  failureFlash : true  
}));

router.get('/signout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/sendtext', isAuthenticated, function(req, res, next){
  client.sendMessage({
      to:'+' + req.user.phonenumber,
      from: twilio_number,
      body: rant("<greet>, it's <firstname>, <firstname>'s <noun> has been <verb ed>! Hop in the <noun vehicle> and get to the <place> ASAP!!!")
  }, function(err, responseData) {
      if (!err) { 
        console.log(responseData.from);
        console.log(responseData.body);
      } else {
        console.log(err)
        req.user.escapes += 1
      }
    res.redirect('/home')
  });
});

module.exports = router;
