const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        name:String,
        username: {type: String, require:true, unique:true},
        password:{type:String,require:true},
        googleID: String,
        path: String,
        following: [{type: Schema.Types.ObjectId, ref:"Content"}],
    },
   
   
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);
module.exports = User;