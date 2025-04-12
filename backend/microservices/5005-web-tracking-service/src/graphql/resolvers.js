import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
dayjs.extend(utc);
dayjs.extend(timezone);

import { getClientIp, getGeoInfo } from "../services/ipLookupService.js";
import { createDailyVisits, updateDailyVisits } from "../databases/DailyVisitsRepo.js";
import { getDailyVisitsModel } from "../models/ModelFactory.js";

const resolvers = {
    Query: {

    },
    Mutation: {
        trackVisit: async (_, { path, userAgent }, { req, dbName }) => {
            const ip = getClientIp(req);
            const date = dayjs().tz("America/Los_Angeles").format("YYYY-MM-DD");

            const DailyVisit = getDailyVisitsModel(dbName);
            const exist = await DailyVisit.findOne({ ip, date });

            if (exist) {
                await updateDailyVisits(ip, date, path, userAgent, dbName);
            } else {
                const { city, zip } = await getGeoInfo(ip);

                await createDailyVisits(
                    ip, date, 1, [userAgent], [path], city, zip, dbName
                );
            }

            return true;
        }
    },
};

export default resolvers;
