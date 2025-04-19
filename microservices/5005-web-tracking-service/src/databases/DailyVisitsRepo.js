import { getDailyVisitsModel } from "../models/ModelFactory.js";

const createDailyVisits = async (ip, date, count, userAgents, paths, city, zip, dbName) => {
    try {
        const DailyVisit = getDailyVisitsModel(dbName);

        let dailyVisit = new DailyVisit({ ip, date, count, userAgents, paths, city, zip });

        return await dailyVisit.save();
    } catch (error) {
        console.error("Error creating daily visit record:", error);
        throw error;
    }
};

const updateDailyVisits = async (ip, date, path, userAgent, dbName) => {
    try {
        const DailyVisit = getDailyVisitsModel(dbName);

        return await DailyVisit.updateOne(
            { ip, date },
            {
                $inc: {count: 1},
                $addToSet: {
                    paths: path,
                    userAgents: userAgent
                }
            }
        );
    } catch (error) {
        console.error("Error updating visit record:", error);
        throw error;
    }
};

export {
    createDailyVisits,
    updateDailyVisits,
};
