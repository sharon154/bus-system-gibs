const mongoose = require("mongoose")
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, 'User ID is required']
    },
    username:{
        type:String,
        required:[true, 'Username is required']
    },
    email:{
        type:String,
        required:[true,'email is required']
    },
    password:{
        type:String,
        required:[true,'password is required']
    },
    role: {
        type: String,
        default: 'user' // Default role is 'user'
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    isVerified: { 
        type: Boolean, 
        default: false 
    }, // Field to track if the user is verified
    verificationToken: {
        type: String, // Store the verification token
        default: null // Default to null
    },
    verificationTokenExpires: {
        type: Date // Store the expiration date of the verification token
    }

}, { timestamps: true });

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;