const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contentSchema = new Schema(
    {
        nameContent:String,
        iconContent: String,
        bannerContent: String,
        owner: { type: Schema.Types.ObjectId, ref: "User" },
    },
    {
        timestamps: true,
    }
);

const Content = mongoose.model("Content", contentSchema);
module.exports = Content;