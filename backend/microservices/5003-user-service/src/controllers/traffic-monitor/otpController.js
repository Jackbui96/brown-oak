import { twillioSendOtp, twillioVerifyOtp } from "../../services/traffic-monitor/otpService.js";

const handleOtpHandshake = async (req, res) => {
    const { phoneNumber } = req.body;

    try {
        await twillioSendOtp(phoneNumber);
        res.status(200).send({ message: "OTP sent successfully" });
    } catch (err) {
        console.error("err: ", err)
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
