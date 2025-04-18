import { getOne } from "../../services/traffic-monitor/userService.js";

const handleGetOneUser = async (req, res) => {
    const { phoneNumber } = req.params;

    if (!phoneNumber) {
        return res.status(400).send({ error: 'Phone number is required' });
    }

    try {
        const user = await getOne(phoneNumber);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        return res.status(200).send(user);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

export {
    handleGetOneUser,
}
