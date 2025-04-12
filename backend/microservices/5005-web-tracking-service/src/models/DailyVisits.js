import mongoose from "mongoose";

const dailyVisitsSchema = new mongoose.Schema({
    ip: String,
    date: String,
    count: { type: Number, default: 1 },
    userAgents: [String],
    paths: [String],
    city: String,
    zip: String
});

export default dailyVisitsSchema;
