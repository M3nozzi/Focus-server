require("dotenv").config();

const User          = require('../models/User');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt        = require('bcryptjs'); 
const passport      = require('passport');


const GoogleStrategy = require("passport-google-oauth2").Strategy;


passport.serializeUser((loggedInUser, cb) => {
  cb(null, loggedInUser._id);
});

passport.deserializeUser((userIdFromSession, cb) => {
  User.findById(userIdFromSession, (err, userDocument) => {
    if (err) {
      cb(err);
      return;
    }
    cb(null, userDocument);
  });
});

passport.use(new LocalStrategy((username, password, next) => {
  User.findOne({ username }, (err, foundUser) => {
    if (err) {
      next(err);
      return;
    }

    if (!foundUser) {
      next(null, false, { message: 'Incorrect username.' });
      return;
    }

    if (!bcrypt.compareSync(password, foundUser.password)) {
      next(null, false, { message: 'Incorrect password.' });
      return;
    }

    next(null, foundUser);
  });
}));


//GOOGLE

passport.use(
  new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.RCT_API_URL}/auth/google/callback`
    },
    (accessToken, refreshToken, profile, done) => {
     
  let name = profile.given_name + ' ' + profile.family_name
      
      User.findOne({
          googleID: profile.id
        })
        .then(user => {
          if (user) {
            done(null, user);
            return;
          }

          User.create({
            name: name,
            username: profile.email,
            googleID: profile.id,
            path: profile.picture,
          
            })
            .then(newUser => {
              done(null, newUser);
            })
            .catch(err => done(err)); // closes User.create()
        })
        .catch(err => done(err)); // closes User.findOne()
    }
  )
);



