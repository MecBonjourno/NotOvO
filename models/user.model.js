const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name: { type: String, required: true}, 
    email: { type: String, required: true},
    password: { type: String, required: true}, 
    resetToken: String, 
    expireToken: Date,
    followers: [{ type:ObjectId, ref: "User"}],
    following: [{ type:ObjectId, ref: "User"}],
    pic: { type: String, default: "https://www.surgeinstitute.org/wp-content/uploads/2015/04/Facebook-no-profile-picture-icon-620x389-300x188.jpg"}
})

mongoose.model("User", userSchema)