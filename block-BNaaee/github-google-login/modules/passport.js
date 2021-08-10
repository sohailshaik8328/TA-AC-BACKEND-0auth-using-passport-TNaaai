var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var GoogleStrategy = require('passport-google-oauth').Strategy;

var User = require('../models/User');   

passport.use(new GoogleStrategy({
    consumerKey: process.env.GOOGLE_CLIENT_ID,
    consumerSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  function(token, tokenSecret, profile, cb) {
      console.log(profile);
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
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
        }
        done(null, user);
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