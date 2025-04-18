import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
dayjs.extend(utc);
dayjs.extend(timezone);

import { getUserModel } from "../../models/modelFactory.js";

const getOneUser = async (firebaseId) => {
    try {
        const User = getUserModel("moodie");
        return await User.findOne({ firebaseId })
    } catch (e) {
        throw new Error("Database query failed: " + e.message);
    }
};

const findOrCreateUser = async (firebaseId, email, displayName, photoURL) => {
    try {
        const User = getUserModel("moodie");
        let user = await User.findOne({ firebaseId });
        const now = dayjs().tz("America/Los_Angeles").toDate();

        if (!user) {
            user = new User({
                firebaseId: firebaseId,
                email: email,
                displayName: displayName,
                photoURL: photoURL,
                favoriteMovies: [],
                registered: now,
                lastLoggedIn: now
            });
            await user.save();
        } else {
            user.lastLoggedIn = now;
            await user.save();
        }

        return {
            id: user.firebaseId,
            email: email,
            displayName: displayName,
            photoURL: photoURL,
            favoriteMovies: user.favoriteMovies,
            registered: user.registered,
            lastLoggedIn: user.lastLoggedIn,
        }
    } catch (error) {
        console.log("Error in findOrCreateUser:", error);
        throw error;
    }
}

const updateOne = async (firebaseId, update) => {
    try {
        const User = getUserModel("moodie");
        const result = await User.updateOne({ firebaseId }, update);

        return result.modifiedCount > 0;
    } catch (error) {
        console.error("❌ Error updating user:", error);
        throw error;
    }
}

export {
    getOneUser,
    findOrCreateUser,
    updateOne,
}
