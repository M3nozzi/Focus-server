
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

    //const {name, path, password} = req.body;
    // const loggedUser = req.user;
    // loggedUser.username = username;
    // loggedUser.campus = campus;
    // loggedUser.course = course;
        // loggerdUser.save()

    //const id = req.user._id;

   /* if (req.body.password) {

        const password = req.body.password;
        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);
   
    
        const {
            userId
        } = req.params;
      
    User.findByIdAndUpdate({ _id: userId }, {
                $set: {
                    password:hashPass,
             }
      }, {
            new: true
      })
      .then( () => {
        res.status(200).json({
            message: 'User updated!'
        })
    })
    .catch(error => res.status(500).json(error));

    } //closes if password */
    console.log(req.body)
        if(req.body.password) {
        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(req.body.password, salt);

            req.body.password = hashPass; 
            
            
        }
    console.log(req.body)
    
    User.findByIdAndUpdate( req.params.id, req.body, {new:true}
    ).then( () => {
        res.status(200).json({
            message: 'User updated!'
        })
    })
    .catch(error => res.status(500).json(error));
    
});


// PROFILE implement the delete route and redirect to /home

profileRoute.get('/profile-delete/:id', (req, res) => {
  
    User.findByIdAndRemove(req.params.id).then(response => {
      res.redirect('/');
    }).catch(error => console.log(error));
  });


// FILE UPLOAD

profileRoute.post("/upload", uploader.single("path"), (req, res, next) => {
    console.log("file is: ", req.file);
  
    if (!req.file) {
      next(new Error("No file uploaded!"));
      return;
    }
    // get secure_url from the file object and save it in the
    // variable 'secure_url', but this can be any name, just make sure you remember to use the same in frontend
    res.json({
      secure_url: req.file.secure_url,
      originalName: req.file.originalname,
    });
});
  

module.exports = profileRoute;