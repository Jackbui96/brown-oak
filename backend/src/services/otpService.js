import dotenv from "dotenv";
dotenv.config();

import twilioClient from "../api-clients/twilioClient.js";
import { findOrCreateUser } from "../databases/UserData.js";

const twillioSendOtp = async (phoneNumber) => {
    try {
        await twilioClient.verify.v2
            .services(process.env.TWILIO_VERIFICATIONS_SID)
            .verifications.create({
                channel: "sms",
                to: phoneNumber
            });
    } catch (error) {
        throw new Error("Send OTP failed: " + error);
    }
}

const twillioVerifyOtp = async (phoneNumber, otp) => {
    try {
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
    } catch (error) {
        throw new Error("Twillio Verification failed: " + error);
    }
};

export {
    twillioSendOtp,
    twillioVerifyOtp,
}
