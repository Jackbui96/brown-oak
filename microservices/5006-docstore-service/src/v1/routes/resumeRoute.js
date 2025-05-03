import express from "express";
import { handleDownload } from "../../controllers/resumeController.js";

const router = express.Router();

router.get("/", handleDownload);

export default router;
