import mongoose from "mongoose";
import { getConnection } from "../databases/index.js"

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

// Lazy-load the model
let Download = null;

const getDownloadModel = () => {
    if (!Download) {
        const connection = getConnection("portfolio");
        Download = connection.model("Download", downloadSchema, "resume_downloads");
    }
    return Download;
}

export default getDownloadModel;
