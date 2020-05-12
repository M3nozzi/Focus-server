const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const playlistSchema = new Schema(
    {
        playlistUrl:String,
        name: String,
        playlistImage: String,
        owner: { type: Schema.Types.ObjectId, ref: "User" },
    },
    {
        timestamps: true,
    }
);

const Playlist = mongoose.model("Playlist", playlistSchema);
module.exports = Playlist;