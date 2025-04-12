import { getOneUser } from "../databases/userRepo.js";

const getOne = async (phoneNumber, dbName) => {
    return await getOneUser(phoneNumber, dbName);
};

export {
    getOne,
}
