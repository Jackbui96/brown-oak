const User = require("../models/User");

const getOneUser = async (phoneNumber) => {
    try {
        return await User.findOne({ phoneNumber });
    } catch (e) {
        throw new Error("Database query failed: " + e.message);
    }
};

const findOrCreateUser = async (phoneNumber) => {
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
}

module.exports = {
    getOneUser,
    findOrCreateUser,
}
