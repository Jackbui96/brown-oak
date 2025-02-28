const userData = require("../databases/UserData")

const getOneUser = async (phoneNumber) => {
    return await userData.getOneUser(phoneNumber);
};

module.exports = {
    getOneUser,
};
