import { getConnection } from "../databases/index.js";
import userSchema from "./User.js"

const modelCache = {} // Map to store models per DB

const getUserModel = (dbName) => {
    if (!modelCache[dbName]) {
        const connection = getConnection(dbName);
        modelCache[dbName] = connection.model("User", userSchema);
    }

    return modelCache[dbName];
};

export {
    getUserModel
}
