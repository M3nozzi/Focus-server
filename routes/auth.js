const express = require("express");
const authRoutes = express.Router();

const passport = require("passport");
const bcrypt = require("bcryptjs");

const uploadCloud = require('../configs/cloudinary');

const User = require("../models/User");

const multer = require('multer');


authRoutes.post("/signup", (req, res, next) => {
  const { username, password, name} = req.body;


  if (!username || !password) {
    res.status(400).json({ message: "Provide username and password" });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({
      message:
        "Please make your password at least 5 characters long for security purposes.",
    });
    return;
  }

  User.findOne({ username }, (err, foundUser) => {
    if (err) {
      res.status(500).json({ message: "Username check went bad." });
      return;
    }

    if (foundUser) {
      res.status(400).json({ message: "Username taken. Choose another one." });
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    const aNewUser = new User({
      username: username,
      password: hashPass,
      name: name,
      path:process.env.DEFAULT_IMAGE,
      
    });

    aNewUser.save((err) => {
      if (err) {
        res
          .status(500)
          .json({ message: "Saving user to database went wrong." });
        return;
      }

      // Automatically log in user after sign up
      // .login() here is actually predefined passport method
      req.login(aNewUser, (err) => {
        if (err) {
          res.status(500).json({ message: "Login after signup went bad." });
          return;
        }

        // Send the user's information to the frontend
        // We can use also: res.status(200).json(req.user);
        res.status(200).json(aNewUser);
      });
    });
  });
});


authRoutes.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, theUser, failureDetails) => {
    console.log(theUser)
    if (err) {
      res
        .status(500)
        .json({ message: "Something went wrong authenticating user" });
      return;
    }

    if (!theUser) {
      // "failureDetails" contains the error messages
      // from our logic in "LocalStrategy" { message: '...' }.
      res.status(401).json(failureDetails);
      return;
    }

    // save user in session
    req.login(theUser, (err) => {
      if (err) {
        res.status(500).json({ message: "Session save went bad." });
        return;
      }

      // We are now logged in (that's why we can also send req.user)
      res.status(200).json(theUser);
    });
  })(req, res, next);
});



authRoutes.get("/logout", (req, res, next) => {
  // req.logout() is defined by passport
  req.logout();
  res.status(200).json({ message: "Log out success!" });
  res.redirect("/");
});


/*authRoutes.post('/upload', uploadCloud.single('imagePath'), (req, res) => {

    const loggedUser = req.user;
    loggedUser.imagePath = req.file;
    
    loggedUser
        .save()
        .then( () => {

            res.status(200).json(req.file);
        })
        .catch(error => console.log(error));
}) */


authRoutes.get("/loggedin", (req, res, next) => {
  // req.isAuthenticated() is defined by passport
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
    return;
  }
  res.status(403).json({ message: "Unauthorized" });
});

//SOCIAL LOGIN GOOGLE

// one way out to google 
authRoutes.get(
  // "/auth/google",
  "/auth/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email"
    ]
  })
);

// one way back from google

authRoutes.get(
  "/auth/google/callback",
  passport.authenticate("google", {
      successRedirect: "http://localhost:3000/main",
      failureRedirect: "http://localhost:3000/" ,
    }),
    function(req,res) {
      //var token = req.user.token;
      res.status(200).json({ message: 'Google auth done'});
    }
);

// SOCIAL LOGIN FACEBOOK

// one way out to facebook
// router.get("/auth/facebook",
//   passport.authenticate("facebook",
//     {
//       data: [
//         {
//           "permission": "public_profile",
//           "status": "granted"
//         }
//       ]
//     }));

//   // one way back from facebook
// router.get("/auth/facebook/callback",
//   passport.authenticate("facebook", {
//     successRedirect: "http://localhost:3000/main",
//     failureRedirect: "http://localhost:3000/"
//   }),
// );





module.exports = authRoutes;
