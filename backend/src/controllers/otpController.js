import { sendOtp, verifyAndHandleUser } from "../services/otpService";

const handleSendOtp = async (req, res) => {
    const { phoneNumber } = req.body;

    try {
        await sendOtp(phoneNumber);
        res.status(200).send({ message: "OTP sent successfully" });
    } catch (err) {
        res.status(500).send({ error: "Failed to send OTP" });
    }
};

const handleVerifyOtp = async (req, res) => {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
        return res.status(400).send({ error: "Phone number and OTP are required "});
    }

    try {
        const user = await verifyAndHandleUser(phoneNumber, otp);
        return res.status(200).send({
            message: "OTP verified successfully",
            user,
        });
    } catch (err) {
        res.status(500).send({ error: "Failed to verify OTP" });
    }
};

export {
    handleSendOtp,
    handleVerifyOtp,
}
