const express = require('express');
const mongoose = require('mongoose');
const contentRoute = express.Router();
const Content = require("../models/Content");
const uploader = require("../configs/cloudinary");

contentRoute.get("/contents", (req, res, next) => {

    Content
        .find()
        .populate("playlist")
        .populate("users")
        .populate("owner")
        .sort({ createdAt: -1 })
        .then((content) => res.json(content))
        .catch((error) => res.status(500).json(error));

});


contentRoute.get("/contents/:id", (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ message: "Specified id is not valid" });
        return;
    }
    Content.findById(req.params.id)
        .populate("playlist")
        .populate("users")
        .populate("owner")
        .then((response) => {
            res.status(200).json(response);

        })
        .catch((error) => {
            res.json(error);
        });
});

//POST CREATE A NEW CONTENT

contentRoute.post("/contents", (req, res, next) => {
    
        if (Object.keys(req.body).length === 0) {
            res.status(400).json({ message: "no body provided" });
            return;
        }
    
    Content.create({
        name: req.body.name,
        icon: req.body.icon,
        banner: req.body.banner,
        playlist: [],
        owner: req.user || "5ec5a34d6c98637a683dd62d",
        users: []

    })
        .then((response) => {
            res.json(response)
        })
        .catch((error) => {
            res.status(500).json(error);
        });
    
})


//PUT to EDIT CONTENT

contentRoute.put("/contents/:id", (req, res, next) => {
    
    if (Object.keys(req.body).length === 0) {
        res.status(400).json({ message: "no body provided" });
        return;
    }

    Content.findByIdAndUpdate(req.params.id, req.body, {new:true})
        .then(() => {
        res.json({message:`Content with ${req.params.id} is update successfully.`})
        })

        .catch((error) => {
            res.status(500).json(error);
        })
})



// FILES UPLOAD

contentRoute.post("/contents-icon-upload", uploader.single("icon"), (req, res, next) => {
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


contentRoute.post("/contents-banner-upload", uploader.single("banner"), (req, res, next) => {
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

module.exports = contentRoute;