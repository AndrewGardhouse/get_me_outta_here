var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');

var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function(passport){

  passport.use('signup', new LocalStrategy({
     usernameField: 'phonenumber', passReqToCallback : true
    },
    function(req, phonenumber, password, done) {
      findOrCreateUser = function(){
        // find a user in Mongo with provided phonenumber
        
        User.findOne({'phonenumber':phonenumber},function(err, user) {
          // In case of any error return
          console.log(user);
          if (err){
            console.log('Error in SignUp: '+err);
            return done(err);
          }
          // already exists
          if (user) {
            console.log('User already exists');
            return done(null, false, 
               req.flash('message','User Already Exists'));
          } else {
            // if there is no user with that email
            // create the user
            var newUser = new User();
            // set the user's local credentials
            newUser.phonenumber = phonenumber;
            newUser.password = createHash(password);
            newUser.email = req.body.email;
            newUser.name = req.body.name;
          
            // save the user
            newUser.save(function(err) {
              if (err){
                console.log('Error in Saving user: '+err);  
                throw err;  
              }
              console.log('User Registration succesful');    
              return done(null, newUser);
            });
          }
        });
      };
       
      // Delay the execution of findOrCreateUser and execute 
      // the method in the next tick of the event loop
      process.nextTick(findOrCreateUser);
      
    })
  );

  var createHash = function(password){
      return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
  }

}