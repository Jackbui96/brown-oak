import getDailyVisit from "../models/DailyVisit.js";

const createDailyVisit = async (ip, date, count, userAgents, paths, city, zip) => {
    try {
        const DailyVisit = getDailyVisit();

        let dailyVisit = new DailyVisit({ ip, date, count, userAgents, paths, city, zip });

        return await dailyVisit.save();
    } catch (error) {
        console.error("Error creating daily visit record:", error);
        throw error;
    }
};

const updateVisit = async (ip, date, path, userAgent) => {
    try {
        const DailyVisit = getDailyVisit();

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
    createDailyVisit,
    updateVisit,
};
