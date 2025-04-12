import { getUserModel } from "../models/modelFactory.js";

const getOneUser = async (phoneNumber, dbName) => {
    try {
        const User = getUserModel(dbName);
        return await User.findOne({ phoneNumber });
    } catch (e) {
        throw new Error("Database query failed: " + e.message);
    }
};

const findOrCreateUser = async (phoneNumber, dbName) => {
    try {
        const User = getUserModel(dbName);
        let user = await User.findOne({ phoneNumber });

        if (!user) {
            user = new User({
                phoneNumber: phoneNumber,
                registered: new Date(),
                lastLoggedIn: new Date()
            });
            await user.save();
        } else {
            user.lastLoggedIn = new Date();
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
