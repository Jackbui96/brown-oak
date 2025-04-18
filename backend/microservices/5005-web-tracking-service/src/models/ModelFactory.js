import { getConnection } from "../databases/index.js";
import dailyVisitsSchema from "./DailyVisits.js"

const modelCache = {} // Map to store models per DB

const getDailyVisitsModel = (dbName) => {
    if (!modelCache[dbName]) {
        const connection = getConnection(dbName);
        modelCache[dbName] = connection.model("DailyVisits", dailyVisitsSchema, "daily_visits");
    }

    return modelCache[dbName];
};

export {
    getDailyVisitsModel,
}
