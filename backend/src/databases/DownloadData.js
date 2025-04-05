import Download from "../models/Download.js";

const createDownload = async (timestamp, ip, userAgent, source) => {
    let download = new Download({
        timestamp: timestamp,
        ip: ip,
        userAgent: userAgent,
        source: source
    });
    await download.save();
}

export {
    createDownload,
}
