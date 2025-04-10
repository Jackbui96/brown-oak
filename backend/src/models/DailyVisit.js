import mongoose from "mongoose";
import { getConnection } from "../databases/index.js";

const dailyVisitSchema = new mongoose.Schema({
    ip: String,
    date: String,
    count: { type: Number, default: 1 },
    userAgents: [String],
    paths: [String],
    city: String,
    zip: String
});

let DailyVisit = null;

const getDailyVisit = () => {
    if (!DailyVisit) {
        const connection = getConnection("portfolio");
        DailyVisit = connection.model("DailyVisit", dailyVisitSchema);
    }
    return DailyVisit;
};

export default getDailyVisit;
