import { getConnection } from "../databases/index.js";
import getUserSchema from "./User.js"

const modelCache = {} // Map to store models per DB

const getUserModel = (appName) => {
    if (!modelCache[appName]) {
        const connection = getConnection(appName);
        modelCache[appName] = connection.model("User", getUserSchema(appName));
    }

    return modelCache[appName];
};

export {
    getUserModel
}
