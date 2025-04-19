import mongoose from "mongoose";

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

export default downloadSchema;
