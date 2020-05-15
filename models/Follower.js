const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const followerSchema = new Schema(
    {
        userTo: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        userFrom: {
            type: Schema.Types.ObjectId, 
            ref:'User'
        },
        contentFrom: {
            type: Schema.Types.ObjectId,
            ref: 'Content'
        },
    },
    {
        timestamps: true,
    }
);

const Follower = mongoose.model("Follower", followerSchema);
module.exports = Follower;