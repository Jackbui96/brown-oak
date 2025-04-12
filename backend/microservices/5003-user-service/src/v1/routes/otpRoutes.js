import express from "express";
import { handleOtpHandshake, handleVerifyOtp } from "../../controllers/otpController.js";

const router = express.Router();

router.get("/", async(req, res) => {
    res.send("otp is running!");
});

router.post("/send-otp", handleOtpHandshake);
router.post("/verify-otp", handleVerifyOtp);

export default router;
