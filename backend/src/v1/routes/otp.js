const express = require('express')
const twilio = require("twilio");

const router = express.Router();

const User = require("../models/User")

const twilioClient = twilio(
    process.env.TWILIO_SID,
    process.env.TWILIO_AUTH_TOKEN
);

router.post("/send-otp", async (req, res) => {
    const { phoneNumber } = req.body;

    try {
        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP to DB
        const otpExpire = new Date(new Date().getTime() + 5 * 60000); // 5 minutes
        await User.updateOne({ phoneNumber }, { otp, otpExpire }, { upsert: true })

        await twilioClient.messages.create({
            body: `Your OTP is ${otp}`,
            to: phoneNumber,
        });

        res.status(200).send({ message: "OTP sent successfully" });
    } catch (err) {
        res.status(500).send({ error: "Failed to send OTP" });
    }
})

router.post("/verify-otp", async (req, res) => {
    const { phoneNumber, otp } = req.body;

    try {
        const user = await User.findOne({ phoneNumber });

        if (!user || user.otp !== otp || new Date() > user.otpExpire) {
            return res.status(400).send({ message: "Invalid or expired OTP" });
        }

        res.status(200).send({ message: "OTP verified successfully" });
    } catch (err) {
        res.status(500).send({ error: "Failed to verify OTP" });
    }
});

module.exports = router;
