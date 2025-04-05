const { getPublicResumeUrl } = require("../services/downloadService.js");
const Download = require("../models/Download")

const handleDownloadAndTrack = async (req, res) => {
    try {
        // Log the download
        await Download.create({
            timestamp: new Date(),
            ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
            userAgent: req.headers["user-agent"],
            source: "landing-page"
        })

        const url = await getPublicResumeUrl();
        res.status(200).json({ url });
    } catch (err) {
        console.error("Error in handleResumeDownload:", err.message);
        res.status(500).json({ error: "Unable to get resume link" });
    }
}

module.exports = {
    handleDownloadAndTrack,
}
