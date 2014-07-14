// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var User = require('../models/user')();

// expose this function to our app using module.exports
module.exports = function(passport) {

    
 	// =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error
             console.log('looking');
            if (err){
                console.log(err);
                return done(err);
            }

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false);
            } else {

				// if there is no user with that email
                // create the user
                var newUser = new User();

                // set the user's local credentials
                newUser.local.email = email;
                newUser.generateKey(password, function(){
                    newUser.save(function(err) {
                        if (err){
                           console.log(err);
                           throw err; 
                        }
                        req.apiKey = newUser.local.apiKey;
                        req.isAuthenticate = true;
                        console.log('saved');
                        return done(null, newUser);
                    });
                });
            }

        });        

    }));

    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
     function(req, email, password, done){
        User.findOne({'local.email':email}, function(err, user){
            if(err) return done(err);

            if (!user) {
                done(null,false);
            };

            if (user.validatepassword(password)) {
                req.isAuthenticate = true;
                req.apiKey = user.local.apiKey;
                return done(null, user);    
            };

            return done(null, false);
        });
    }));

    passport.use('local-auth', new LocalStrategy({
        usernameField : '',
        passwordField : '',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
     function(req, email, password, done){
         console.log("searching for user");
        User.findOne({'local.apiKey':req.query.token}, function(err, user){
            if(err) return done(err);

            if (!user) {
                done(null,false);
            };

            req.isAuthenticate = true;
            req.user = user;
            return done(null, user);        
        });
    }));
};