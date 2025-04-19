import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
dayjs.extend(utc);
dayjs.extend(timezone);

import Download from "../models/Download.js";
import { getClientIp, getGeoInfo } from "../services/ipLookupService.js";
import getDailyVisit from "../models/DailyVisit.js";
import { createDailyVisit, updateVisit } from "../databases/VisitData.js";

const resolvers = {
    Query: {
        downloads: async (_, { limit }) => {
            return await Download.find().sort({ timestamp: -1 }).limit(limit || 10);
        },
        downloadCount: async () => {
            return await Download.countDocuments();
        }
    },
    Mutation: {
        recordResumeDownload: async (_, { source }, { req }) => {
            const newDownload = new Download({
                ip: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
                userAgent: req.headers["user-agent"],
                source: source || "unknown",
            });

            await newDownload.save();
            return newDownload;
        },

        trackVisit: async (_, { path, userAgent }, { req }) => {
            const ip = getClientIp(req);
            const date = dayjs().tz("America/Los_Angeles").format("YYYY-MM-DD");

            const DailyVisit = getDailyVisit();
            const exist = await DailyVisit.findOne({ ip, date });

            if (exist) {
                await updateVisit(ip, date, path, userAgent);
            } else {
                const { city, zip } = await getGeoInfo(ip);

                await createDailyVisit(
                    ip, date, 1, [userAgent], [path], city, zip
                );
            }

            return true;
        }
    },
};

export default resolvers;
