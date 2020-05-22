const express = require('express');
const mongoose = require('mongoose');
const videoRoute = express.Router();
const Playlist = require("../models/Playlist");
const Content = require('../models/Content');
const Video = require('../models/Videos');



videoRoute.get('/videos/:id', (req, res, next) => {

    Video.find({playlist: req.params.id})
        .then(theVideo => res.json(theVideo))
        .catch((error) => res.status(500).json(error))
})

// POST route => to create a new playlist
videoRoute.post("/videos", (req, res, next) => {

    Video.create({
        title: req.body.name,
        videoUrl: req.body.videoUrl,
        thumbnailUrl: req.body.thumbnailUrl,
        description: req.body.description,
        playlist: req.body.playlist,
    })
    .then((response) => {
      
        Playlist.findByIdAndUpdate( req.body.playlist, {
            $push: { video: response._id },
            },
            { new: true }
        )
        .populate("video")
        .then((theResponse) => {
        res.json(theResponse);
        })
        .catch((err) => {
        res.status(500).json(err);
        });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});


videoRoute.post("/getContentFollowed", (req, res) => {


    //Need to find all of the Users that I am subscribing to From Subscriber Collection 

    User.find({ 'userFrom': req.body.userFrom })
        .exec((err, followers) => {
            if (err) return res.status(400).send(err);

            let followerUser = [];

            followers.map((follower, i) => {
                followerUser.push(follower.userTo)
            })


            //Need to Fetch all of the Videos that belong to the Users that I found in previous step. 
            User.find({ follow: { $in: followerUser } })
                .populate('follow')
                .exec((err, contents) => {
                    if (err) return res.status(400).send(err);
                    res.status(200).json({ success: true, contents })
                })
            })
});

module.exports = videoRoute;