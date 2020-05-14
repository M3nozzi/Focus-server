const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const videosSchema = new Schema(
    {
        title:String,
        iconUrl: String,
        thumbnailUrl: String,
        description: String,
        videoPath: String,
        playlist: { type: Schema.Types.ObjectId, ref: "Playlist" },
    },
    {
        timestamps: true,
    }
);

const Videos = mongoose.model("Videos", videosSchema);
module.exports = Videos;