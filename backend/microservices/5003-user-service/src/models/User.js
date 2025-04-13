import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
dayjs.extend(utc);
dayjs.extend(timezone);

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    phoneNumber: { type: String, unique: true, required: true },
    registered: {
        type: Date,
        default: () => dayjs().tz("America/Los_Angeles").toDate()
    },
    lastLoggedIn: {
        type: Date,
        default: () => dayjs().tz("America/Los_Angeles").toDate()
    },
});

export default userSchema;
