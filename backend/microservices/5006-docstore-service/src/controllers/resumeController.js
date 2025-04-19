import { getPublicResumeUrl } from "../services/downloadService.js";
import { createDownload } from "../databases/ResumeRepo.js";

const handleDownloadAndTrack = async (req, res) => {
    try {
        const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").split(",")[0].trim();
        const userAgent = req.headers["user-agent"]?.substring(0, 500);
        const source = req.query.source || "landing-page";

        // Log the download
        await createDownload(
            new Date(),
            ip,
            userAgent,
            source
        )

        const url = await getPublicResumeUrl();
        res.status(200).json({ url });
    } catch (err) {
        console.error("Error in handleResumeDownload:", err.message);
        res.status(500).json({ error: "Unable to get resume link" });
    }
}

export {
    handleDownloadAndTrack,
}
