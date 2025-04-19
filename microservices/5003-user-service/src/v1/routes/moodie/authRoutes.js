import express from "express";
import handleGoogleSignin from "../../../controllers/moodie/authController.js";

const router = express.Router();

router.get("/", async(req, res) => {
    res.send("Moodie auth is running!");
});

router.post("/google-signin", handleGoogleSignin);

export default router;
