import express from "express";
import { handleDownloadAndTrack } from "../../controllers/resumeController.js";

const router = express.Router();

router.get("/download", handleDownloadAndTrack);

export default router;
