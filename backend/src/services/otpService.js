import twilioClient from "../api-clients/twilioClient.js";
import { findOrCreateUser } from "../databases/UserData.js";

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

    return await findOrCreateUser(phoneNumber);
};

export {
    sendOtp,
    verifyAndHandleUser,
}
