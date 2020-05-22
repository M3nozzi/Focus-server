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

      req.login(aNewUser, (err) => {
        if (err) {
          res.status(500).json({ message: "Login after signup went bad." });
          return;
        }

        res.status(200).json(aNewUser);
      });
    });
  });
});


authRoutes.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, theUser, failureDetails) => {
  
    if (err) {
      res
        .status(500)
        .json({ message: "Something went wrong authenticating user" });
      return;
    }

    if (!theUser) {

      res.status(401).json(failureDetails);
      return;
    }

    req.login(theUser, (err) => {
      if (err) {
        res.status(500).json({ message: "Session save went bad." });
        return;
      }

       res.status(200).json(theUser);
    });
  })(req, res, next);
});



authRoutes.get("/logout", (req, res, next) => {
  req.logout();
  res.status(200).json({ message: "Log out success!" });
  res.redirect("/");
});



authRoutes.get("/loggedin", (req, res, next) => {
   if (req.isAuthenticated()) {
    res.status(200).json(req.user);
    return;
  }
  res.status(403).json({ message: "Unauthorized" });
});

//SOCIAL LOGIN GOOGLE

authRoutes.get(
   "/auth/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email"
    ]
  })
);



authRoutes.get(
  "/auth/google/callback",
  passport.authenticate("google", {
      successRedirect: "https://focusplay.herokuapp.com/main",
      failureRedirect: "https://focusplay.herokuapp.com" ,
    }),
    function(req,res) {
  
      res.status(200).json({ message: 'Google auth done'});
    }
);


module.exports = authRoutes;
