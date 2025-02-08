const otpService = require("../services/otpService");

const sendOtp = async (req, res) => {
    const { phoneNumber } = req.body;

    try {
        await otpService.sendOtp(phoneNumber);
        res.status(200).send({ message: "OTP sent successfully" });
    } catch (err) {
        res.status(500).send({ error: "Failed to send OTP" });
    }
};

const verifyOtp = async (req, res) => {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
        return res.status(400).send({ error: "Phone number and OTP are required "});
    }

    try {
        const user = await otpService.verifyAndHandleUser(phoneNumber, otp);
        return res.status(200).send({
            message: "OTP verified successfully",
            user,
        });
    } catch (err) {
        res.status(500).send({ error: "Failed to verify OTP" });
    }
};

module.exports = {
    sendOtp,
    verifyOtp,
}
