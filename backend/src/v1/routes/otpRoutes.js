import express from "express";
import { sendOtp, verifyAndHandleUser } from "../../services/otpService.js";

const router = express.Router();

router.get("/", async(req, res) => {
    res.send("otp is running!");
});

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyAndHandleUser);

export default router;
