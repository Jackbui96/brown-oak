import express from "express";
import { handleDownloadAndTrack } from "../../controllers/downloadController.js";

const router = express.Router();

router.get("/", async(req, res) => {
    res.send("download is working!")
})

router.get("/resume", handleDownloadAndTrack);

export default router;
