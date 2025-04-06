import getDownloadModel from "../models/Download.js";

const createDownload = async (timestamp, ip, userAgent, source) => {
    try {
        const Download = getDownloadModel();

        let download = new Download({
            timestamp: timestamp,
            ip: ip,
            userAgent: userAgent,
            source: source
        });
        return await download.save();
    } catch (error) {
        console.error("Error creating download record:", error);
        throw error;
    }
};

export {
    createDownload,
};
