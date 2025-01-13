const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    phoneNumber: { type: String, unique: true, required: true },
    registered: { type: Date, default: Date.now },
    lastLoggedIn: {type: Date, default: Date.now },
})

module.exports = mongoose.model("User", userSchema, "users");
