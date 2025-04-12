import { twillioSendOtp, twillioVerifyOtp } from "../services/otpService.js";

const handleOtpHandshake = async (req, res) => {
    const { phoneNumber } = req.body;

    try {
        await twillioSendOtp(phoneNumber);
        res.status(200).send({ message: "OTP sent successfully" });
    } catch (err) {
        res.status(500).send({ error: "Failed to send OTP" });
    }
};

const handleVerifyOtp = async (req, res) => {
    const { phoneNumber, otp } = req.body;
    const dbName = req.headers["x-tenant-id"];

    if (!phoneNumber || !otp || !dbName) {
        return res.status(400).send({ error: "Missing phone number, OTP, or tenant ID" });
    }

    try {
        const user = await twillioVerifyOtp(phoneNumber, otp, dbName);
        return res.status(200).send({
            message: "OTP verified successfully",
            user,
        });
    } catch (err) {
        res.status(500).send({ error: "Failed to verify OTP" });
    }
};

export {
    handleOtpHandshake,
    handleVerifyOtp,
}
