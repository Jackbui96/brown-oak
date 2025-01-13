const express = require('express');
const router = express.Router();
const axios = require('axios');
const firebaseAdmin = require('firebase-admin')

// Initialize Firebase Admin SDK
const serviceAccount = require("./path-to-firebase-service-account.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

router.post("/send-otp", async (req, res) => {
    const { phone } = req.body;
    try {
        const session = await admin.auth().createSessionCookie(phone, { expiresIn: 600000 });
        res.status(200).json({ success: true, session });
    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post("/verify-otp", async (req, res) => {
    const { phone, otp } = req.body;
    try {
        // Verify OTP with Firebase Admin
        const user = await admin.auth().verifyIdToken(otp);
        if (user.phone_number === phone) {
            res.status(200).json({ success: true, user });
        } else {
            res.status(400).json({ success: false, message: "Invalid OTP" });
        }
    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ success: false, message: error.message });
    }
})
