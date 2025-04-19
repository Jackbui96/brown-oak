import mongoose from "mongoose";

const dailyVisitsSchema = new mongoose.Schema({
    ip: String,
    date: Date,
    count: { type: Number, default: 1 },
    userAgents: [String],
    paths: [String],
    city: String,
    zip: String
});

export default dailyVisitsSchema;
