const userService = require("../services/userService")

const getOneUser = async (req, res) => {
    const { phoneNumber } = req.params;

    if (!phoneNumber) {
        return res.status(400).send({ error: 'Phone number is required' });
    }

    try {
        const user = await userService.getOneUser(phoneNumber);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        return res.status(200).send(user);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

module.exports = {
    getOneUser,
}
