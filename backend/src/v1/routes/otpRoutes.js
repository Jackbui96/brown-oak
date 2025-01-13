const express = require('express')
const twilio = require("twilio")

const router = express.Router()

const User = require("../models/User")

const twilioClient = twilio(
    process.env.TWILIO_SID,
    process.env.TWILIO_AUTH_TOKEN
);

router.get("/", async(req, res) => {
    res.send("otp is running!");
});

router.post("/send-otp", async (req, res) => {
    const { phoneNumber } = req.body;

    try {
       await twilioClient.verify.v2
            .services(process.env.TWILIO_VERIFICATIONS_SID)
            .verifications.create({
                channel: "sms",
                to: phoneNumber
            });
        res.status(200).send({ message: "OTP sent successfully" });
    } catch (err) {
        console.log(err)
        res.status(500).send({ error: "Failed to send OTP" });
    }
});

router.post("/verify-otp", async (req, res) => {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
        return res.status(400).send({ error: "Phone number and OTP are required "});
    }

    try {
        const verification = await twilioClient.verify.v2
            .services(process.env.TWILIO_VERIFICATIONS_SID)
            .verificationChecks.create({
                to: phoneNumber,
                code: otp,
            });

        if (verification.status === "approved") {
            let user = await User.findOne({ phoneNumber });
            if (!user) {
                user = new User({
                    phoneNumber: phoneNumber,
                    registered: new Date(),
                    lastLoggedIn: new Date()
                });
                await user.save();
            } else {
                user.lastLoggedIn = new Date();
                await user.save();
            }

            return res.status(200).send({
                message: "OTP verified successfully",
                user: {
                    id: user._id,
                    phoneNumber: user.phoneNumber,
                    registered: user.registered,
                    lastLoggedIn: user.lastLoggedIn,
                },
            });
        } else {
            return res.status(400).send({ error: "Invalid or expired OTP" });
        }
    } catch (err) {
        res.status(500).send({ error: "Failed to verify OTP" });
    }
});

module.exports = router;
