const twilioClient = require('../api-clients/twilioClient');
const userData = require('../databases/UserData');

const sendOtp = async (phoneNumber) => {
    try {
        await twilioClient.verify.v2
            .services(process.env.TWILIO_VERIFICATIONS_SID)
            .verifications.create({
                channel: "sms",
                to: phoneNumber
            });
    } catch (error) {
        throw new Error("Send OTP failed: " + error.message);
    }
}

const verifyAndHandleUser = async (phoneNumber, otp) => {
    const verification = await twilioClient.verify.v2
        .services(process.env.TWILIO_VERIFICATIONS_SID)
        .verificationChecks.create({
            to: phoneNumber,
            code: otp,
        });

    if (verification.status !== "approved") {
        throw new Error("Invalid or expired OTP");
    }

    return await userData.findOrCreateUser(phoneNumber);
};

module.exports = {
    sendOtp,
    verifyAndHandleUser,
}
