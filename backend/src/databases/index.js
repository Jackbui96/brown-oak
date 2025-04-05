import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

const portfolioDb = mongoose.createConnection(process.env.ATLAS_URI_PORTFOLIO);
portfolioDb.once("open", () => console.log("✅ MongoDB Portfolio connected"));
portfolioDb.on("error", (err) => console.error("❌ MongoDB Portfolio error:", err));

const brownDustDb = mongoose.createConnection(process.env.ATLAS_URI_BROWNDUST);
brownDustDb.once("open", () => console.log("✅ MongoDB BrownDust connected"));
brownDustDb.on("error", (err) => console.error("❌ MongoDB BrownDust error:", err));

export { portfolioDb, brownDustDb };
