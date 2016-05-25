var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var User = require('../app/models/user');

var configAuth = require('./auth');

module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use(new FacebookStrategy({

      clientID: configAuth.facebookAuth.clientID,
      clientSecret: configAuth.facebookAuth.clientSecret,
      callbackURL: configAuth.facebookAuth.callbackURL

    },

    function(token, refreshToken, profile, done) {

      process.nextTick(function() {

        User.findOne({ 'facebook.id': profile.id }, function(err, user) {

          if (err)
            return done(err);

          if (user) {

            console.log(user);
            console.log('kjkjs ksjkjd kdnsknk');
            return done(null, user);
          } else {
            var newUser = new User();
            console.log(profile);
            newUser.facebook.id = profile.id;
            newUser.facebook.token = token;
            newUser.facebook.name = profile.displayName;
            newUser.facebook.email = profile.emails;

            newUser.save(function(err) {
              if (err)
                throw err;
              return done(null, newUser);
            });
          }

        });
      });

    }));

};
