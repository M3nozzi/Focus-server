
const express = require("express");
const mongoose = require("mongoose");
const profileRoute = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const uploader = require("../configs/cloudinary");

const bcryptSalt = 10;
//GET PROFILE

profileRoute.get('/profile/:id', (req, res) => {
    User.findById(req.params.id)
        .then((response) => {
            res.status(200).json(response);
        })

        .catch((error) => res.json(error));

})


profileRoute.put('/profile/:id', (req, res, next) => {

        if(req.body.password) {
        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(req.body.password, salt);

            req.body.password = hashPass; 
            
            
        }
  
    
    User.findByIdAndUpdate( req.params.id, req.body, {new:true}
    ).then( (response) => {
      res.json(response);
     
    })
    .catch(error => res.status(500).json(error));
    
});


// PROFILE implement the delete route and redirect to /home

profileRoute.get('/profile-delete/:id', (req, res) => {
  
    User.findByIdAndDelete(req.params.id).then(response => {
      res.json({message: "user Deleted"});
    }).catch(error => res.status(500).json(error));
  });


// FILE UPLOAD

profileRoute.post("/upload", uploader.single("path"), (req, res, next) => {
    console.log("file is: ", req.file);
  
    if (!req.file) {
      next(new Error("No file uploaded!"));
      return;
    }
 
    res.json({
      secure_url: req.file.secure_url,
      originalName: req.file.originalname,
    });
});
  

module.exports = profileRoute;