const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const playlistSchema = new Schema(
    {
        name: String,
        playlistImage: String,
        playlistUrl:String,
        owner: { type: Schema.Types.ObjectId, ref: "User" },
        content: { type: Schema.Types.ObjectId, ref: "Content" },
    },
    {
        timestamps: true,
    }
);

const Playlist = mongoose.model("Playlist", playlistSchema);
module.exports = Playlist;