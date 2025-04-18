import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
dayjs.extend(utc);
dayjs.extend(timezone);

import { getUserModel } from "../../models/modelFactory.js";

const getOneUser = async (phoneNumber) => {
    try {
        const User = getUserModel("traffic-monitor");
        return await User.findOne({ phoneNumber });
    } catch (e) {
        throw new Error("Database query failed: " + e.message);
    }
};

const findOrCreateUser = async (phoneNumber) => {
    try {
        const User = getUserModel("traffic-monitor");
        let user = await User.findOne({ phoneNumber });
        const now = dayjs().tz("America/Los_Angeles").toDate();

        if (!user) {
            user = new User({
                phoneNumber: phoneNumber,
                registered: now,
                lastLoggedIn: now
            });
            await user.save();
        } else {
            user.lastLoggedIn = now;
            await user.save();
        }

        return {
            id: user._id,
            phoneNumber: user.phoneNumber,
            registered: user.registered,
            lastLoggedIn: user.lastLoggedIn,
        }
    } catch (error) {
        console.log("Error in findOrCreateUser:", error);
        throw error;
    }
}

export {
    getOneUser,
    findOrCreateUser,
}
