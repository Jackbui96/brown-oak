const express = require("express");
const { handleChatRequest } = require("../../controllers/geminiController");

const router = express.Router();

router.get("/", async(req, res) => {
    res.send("chat is running!");
});

router.post("/chatRequest", handleChatRequest);

module.exports = router;
