const mongoose = require("mongoose");

const downloadSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now,
    },
    ip: {
        type: String,
        required: false,
    },
    userAgent: {
        type: String,
        required: false,
    },
    source: {
        type: String,
        default: "unknown",
    },
});

const Download = mongoose.model("Download", downloadSchema, "resume_downloads");

module.exports = Download;
