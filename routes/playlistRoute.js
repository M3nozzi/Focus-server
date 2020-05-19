const express = require('express');
const mongoose = require('mongoose');
const playlistRoute = express.Router();
const Playlist = require("../models/Playlist");
const Content = require('../models/Content');


playlistRoute.get("/contents/:contentId/playlist/:playlistId", (req, res) => {

    Playlist.find(req.params.playlistId)
        .populate({path: 'content', select: _id})
        .populate("videos")
        .sort({ createdAt: -1 })
        .then((thePlaylist) => res.json(thePlaylist))
        .catch((error) => res.status(500).json(error));

});

// POST route => to create a new playlist
playlistRoute.post("/playlist", (req, res, next) => {

    Playlist.create({
    name: req.body.name,
    playlistImage: req.body.playlistImage,
    playlistUrl: req.body.playlistUrl,
    owner: req.user._id,
    video: req.body.video,
    content:req.body.contentId,
  })
        .then((response) => {
            console.log("---->", response)
            console.log("contentId", req.body.contentId)
      Content.findByIdAndUpdate(
        req.body.contentId,
        {
          $push: { playlist: response._id },
        },
        { new: true }
      )
        .populate("playlist")
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

// DELETE route => to delete a specific task
playlistRoute.delete("/playlist/:id", (req, res, next) => {
  
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Playlist.findByIdAndRemove(req.params.id)
    .then(() => {
      res.json({
        message: `Task with ${req.params.id} is removed successfully.`,
      });
    })
    .catch((err) => {
      res.json(err);
    });
});

module.exports = playlistRoute;
