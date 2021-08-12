var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');

var User = require('../models/User'); 

passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
  ));


  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(username, password, done) {
    // ...
  }
));


passport.use(new GoogleStrategy({
    clientID : process.env.GOOGLE_CLIENT_ID,
    clientSecret : process.env.GOOGLE_CLIENT_SECRET,
    callbackURL : "/auth/google/callback"
  },
  (accessToken, refreshToken, profile, done) => {
      console.log(profile);
    //   done(null, false)

      var profileData = {
          name : profile.displayName,
          photo : profile._json.picture,
          email : profile._json.email
      }
      
    User.findOne({email : profile._json.email },  (err, user) => {
        if(err) return done(err);
        if(!user) {
            User.create(profileData, (err, addedUser) => {
                if(err) return done(err);
                return done(null, addedUser);
            })
        } else {
            return done(null, user);
        }

    });
  }
));



passport.use(new GitHubStrategy({
    clientID : process.env.CLIENT_ID,
    clientSecret : process.env.CLIENT_SECRET,
    callbackURL : "/auth/github/callback",
}, (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    // done(null, false)

    var profileData = {
        name : profile.displayName,
        username : profile.username,
        email :  profile._json.email,
        photo : profile._json.avatar_url
    }

    User.findOne({email : profile._json.email}, (err, user) => {
        if(err) return done(err);
        if(!user) {
            User.create(profileData, (err, addedUser) => {
                if(err) return done(err);
                return done(null, addedUser)
            })
        } else {
            return done(null, user);
        }

    })
}))

passport.serializeUser((user, done) => {
    done(null,user.id);
})

passport.deserializeUser((id, done) => {
    User.findById(id, "name email username", (err, user) => {
        done(err, user)
    })
})