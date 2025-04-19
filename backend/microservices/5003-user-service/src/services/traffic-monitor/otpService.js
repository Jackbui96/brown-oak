import { getTwilioClient } from "../../api-clients/twilioClient.js";
import { findOrCreateUser } from "../../databases/traffic-monitor/userRepo.js";

const twillioSendOtp = async (phoneNumber) => {
    try {
        const client = getTwilioClient();
        await client.verify.v2
            .services(process.env.TWILIO_VERIFICATIONS_SID)
            .verifications.create({
                channel: "sms",
                to: phoneNumber
            });
    } catch (error) {
        throw new Error("Send OTP failed: " + error);
    }
}

const twillioVerifyOtp = async (phoneNumber, otp, dbName) => {
    try {
        const client = getTwilioClient();
        const verification = await client.verify.v2
            .services(process.env.TWILIO_VERIFICATIONS_SID)
            .verificationChecks.create({
                to: phoneNumber,
                code: otp,
            });

        if (verification.status !== "approved") {
            throw new Error("Invalid or expired OTP");
        }
        return await findOrCreateUser(phoneNumber, dbName);
    } catch (error) {
        throw new Error("Twillio Verification failed: " + error);
    }
};

export {
    twillioSendOtp,
    twillioVerifyOtp,
}
