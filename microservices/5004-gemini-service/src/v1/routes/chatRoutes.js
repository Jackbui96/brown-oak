import express from "express";
import { handleChatRequest } from "../../controllers/geminiController.js";

const router = express.Router();

router.get("/", async(req, res) => {
    res.send("chat is running!");
});

router.post("/chat", handleChatRequest);

export default router;
