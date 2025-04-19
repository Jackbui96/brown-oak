import twilio from "twilio";

// Wrap Twilio Client in a factory function to prevent it from init before SSM has loaded

let client= null;

export const getTwilioClient = () => {
    if (!client) {
        const sid = process.env.TWILIO_SID;
        const token = process.env.TWILIO_AUTH_TOKEN;

        if (!sid || !token) {
            throw new Error("Twilio SID or token not available in env");
        }

        client = twilio(sid, token);
    }

    return client;
}
