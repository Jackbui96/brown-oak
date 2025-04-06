import getUserModel from "../models/User.js";

const getOneUser = async (phoneNumber) => {
    try {
        const User = getUserModel();
        return await User.findOne({ phoneNumber });
    } catch (e) {
        throw new Error("Database query failed: " + e.message);
    }
};

const findOrCreateUser = async (phoneNumber) => {
    try {
        const User = getUserModel();
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
