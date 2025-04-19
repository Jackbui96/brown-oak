import { getOneUser } from "../../databases/traffic-monitor/userRepo.js";

const getOne = async (phoneNumber, dbName) => {
    return await getOneUser(phoneNumber, dbName);
};

export {
    getOne,
}
