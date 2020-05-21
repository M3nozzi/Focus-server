require("dotenv").config();

const User          = require('../models/User');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt        = require('bcryptjs'); 
const passport      = require('passport');



// social login
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
      callbackURL: "http://localhost:5000/api/auth/google/callback"
    },
    (accessToken, refreshToken, profile, done) => {
     
      //console.log("Google account details:", profile);
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
            //token:accessToken,
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



// //FACEBOOK
// passport.use(new FacebookStrategy({
//   clientID: process.env.FACEBOOK_APP_ID,
//   clientSecret: process.env.FACEBOOK_APP_SECRET,
//   callbackURL: process.env.FACEBOOK_CALLBACK
// },
// function(accessToken, refreshToken, profile, done) {
  
// console.log("Facebook account details:", profile);

  
// User.findOne({
//     facebookID: profile.id
//   })
//   .then(user => {
//     if (user) {
//       done(null, user);
//       return;
//     }

//     User.create({
//       name: profile.displayName,
//       username: profile.email,
//       facebookID: profile.id,
//       path:process.env.DEFAULT_IMAGE,
//       })
//       .then(newUser => {
//         done(null, newUser);
//       })
//       .catch(err => done(err)); // closes User.create()
//   })
//   .catch(err => done(err)); // closes User.findOne()
// }
// )
// );