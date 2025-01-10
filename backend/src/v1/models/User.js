const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    phoneNumber: { type: String, unique: true },
    otp: String,
    otpExpire: Date,
    registered: { type: Date, default: Date.now() },
    lastLoggedIn: {type: Date, default: Date.now() },
})

module.exports = mongoose.model("User", userSchema, "users");
