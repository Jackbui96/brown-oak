import { getPublicResumeUrl } from "../services/downloadService.js";

const handleDownload = async (req, res) => {
    try {
        const url = await getPublicResumeUrl();
        res.status(200).json({ url });
    } catch (err) {
        console.error("Error in handleResumeDownload:", err.message);
        res.status(500).json({ error: "Unable to get resume link" });
    }
}

export {
    handleDownload,
}
