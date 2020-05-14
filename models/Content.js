const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contentSchema = new Schema(
    {
        name:String,
        icon: String,
        banner: String,
        owner: { type: Schema.Types.ObjectId, ref: "User" },
        playlist: [{type: Schema.Types.ObjectId, ref: "Playlist"}]
    },
    {
        timestamps: true,
    }
);

const Content = mongoose.model("Content", contentSchema);
module.exports = Content;