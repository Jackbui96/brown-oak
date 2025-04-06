import { getOneUser } from "../databases/UserData.js";

const getOne = async (phoneNumber) => {
    return await getOneUser(phoneNumber);
};

export {
    getOne,
}
