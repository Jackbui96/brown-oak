const express = require("express");
const { handleDownloadAndTrack } = require("../../controllers/downloadController");

const router = express.Router();

router.get("/", async(req, res) => {
    res.send("download is working!")
})

router.get("/resume", handleDownloadAndTrack);

module.exports = router;
