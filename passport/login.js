var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');

var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function(passport){

  passport.use('login', new LocalStrategy({
      usernameField: 'email', passReqToCallback: true
    },
    function(req, email, password, done) { 
      // check in mongo if a user with email exists or not
      User.findOne({ 'email' :  email }, 
        function(err, user) {
          // In case of any error, return using the done method
          if (err)
            return done(err);
          // Username does not exist, log error & redirect back
          if (!user){
            console.log('User Not Found with email '+ email);
            return done(null, false, 
                  req.flash('message', 'User Not found.'));                 
          }
          // User exists but wrong password, log the error 
          if (!isValidPassword(user, password)){
            console.log('Invalid Password');
            return done(null, false, 
                req.flash('message', 'Invalid Password'));
          }
          // User and password both match, return user from 
          // done method which will be treated like success
          return done(null, user);
        }
      );
  }));

  var isValidPassword = function(user, password){
    return bCrypt.compareSync(password, user.password);
  }

}