import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
dayjs.extend(utc);
dayjs.extend(timezone);

import mongoose from 'mongoose';

function getUserSchema(appName) {
    if (appName === "moodie") {
        return new mongoose.Schema({
            firebaseId: { type: String, unique: true, required: true },
            email: { type: String, required: true },
            displayName:  String ,
            photoURL: String,
            favoriteMovies: [String] ,
            registered: {
                type: Date,
                default: () => dayjs().tz("America/Los_Angeles").toDate()
            },
            lastLoggedIn: {
                type: Date,
                default: () => dayjs().tz("America/Los_Angeles").toDate()
            },
        })
    } else if (appName === "traffic-monitor") {
        return new mongoose.Schema({
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
    } else {
        throw new Error("No suitable schema for requested application!")
    }
}

export default getUserSchema;
