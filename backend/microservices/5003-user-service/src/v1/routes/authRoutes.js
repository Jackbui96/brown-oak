import express from "express";
import { handleOtpHandshake, handleVerifyOtp } from "../../controllers/otpController.js";

const router = express.Router();

router.get("/", async(req, res) => {
    res.send("auth is running!");
});

router.post("/otp", handleOtpHandshake);
router.post("/otp/verify", handleVerifyOtp);

export default router;
