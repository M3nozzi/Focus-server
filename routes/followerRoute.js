const express = require("express");
const mongoose = require("mongoose");
const followerRoute = express.Router();
const Follower = require("../models/Follower");


followerRoute.post('/followersNumber', (req, res) => {
    
    Follower.find({'userTo': req.body.userTo})
            .exec((err, follower) => {
                if(err) return res.status(400).send(err);

                res.status(200).json({success: true, followersNumber: follower.length})
            })
});

followerRoute.post('/followed', (req, res) => {

    Follower.find({ 'contentFrom': req.body.contentFrom, 'userFrom': req.body.userFrom})
        .exec((err, follower) => {
            if (err) return res.status(400).send(err);
                let result = false;
                if(follower.length !== 0) {
                    result = true;
                }

            res.status(200).json({ success: true, followed: result })
        })
});

followerRoute.post('/follow', (req, res) => {

    const follow = new Follower(req.body);

    Follower.save((err, doc) => {
            if(err) return res.json({success: false, err})
            return res.status(200).json({success:true});
    })
});


followerRoute.post('/unfollow', (req, res) => {

    const follow = new Follower(req.body);

    Follower.findOneAndDelete({userTo: req.body.userTo, contentFrom: req.body.contentFrom})
            .exec((err, doc) => {
                if (err) return res.json({ success: false, err })
                return res.status(200).json({ success: true, doc });
            })
});



module.exports = followerRoute;