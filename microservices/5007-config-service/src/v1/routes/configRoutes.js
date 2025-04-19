import express from "express";
import { getFrontendConfig } from "../../controllers/configController.js";

const router = express.Router();

router.get("/:project/firebase", getFrontendConfig);

export default router;
