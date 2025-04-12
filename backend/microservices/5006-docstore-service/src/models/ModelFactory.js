import { getConnection } from "../databases/index.js";
import downloadSchema from "./Download.js"

const modelCache = {} // Map to store models per DB

const getDownloadModel = (dbName) => {
    if (!modelCache[dbName]) {
        const connection = getConnection("portfolio");
        modelCache[dbName] = connection.model("Download", downloadSchema, "resume_downloads");
    }

    return modelCache[dbName];
};

export {
    getDownloadModel
}
