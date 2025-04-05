const Download = require("../models/Download");

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
    },
};

module.exports = resolvers;
