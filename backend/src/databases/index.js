import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connections = {
    portfolio: null,
    brownOak: null
}

const initDatabaseConnections = async() => {
    try {
        // Portfolio DB connection
        if (!connections.portfolio) {
            connections.portfolio = mongoose.createConnection(process.env.ATLAS_URI_PORTFOLIO);
            connections.portfolio.once("open", () => console.log("✅ MongoDB Portfolio connected"));
            connections.portfolio.on("error", (err) => console.error("❌ MongoDB Portfolio error:", err));
            connections.portfolio.on("disconnected", () => {

                console.log("MongoDB Portfolio disconnected, attempting to reconnect...");
            });
        }

        // BrownDust DB connection
        if (!connections.brownOak) {
            connections.brownOak = mongoose.createConnection(process.env.ATLAS_URI_BROWNOAK);
            connections.brownOak.once("open", () => console.log("✅ MongoDB BrownOak connected"));
            connections.brownOak.on("error", (err) => console.error("❌ MongoDB BrownOak error:", err));
            connections.brownOak.on("disconnected", () => {
                // TODO: implement a retry mechanism for prod
                console.log("MongoDB BrownOak disconnected, attempting to reconnect...");
            });
        }

        return connections;
    } catch (error) {
        console.error("Failed to initialize database connections:", error);
        throw error;
    }
};

const getConnection = (dbName) => {
    if (!connections[dbName]) {
        throw new Error(`Connection to ${dbName} not established`);
    }
    return connections[dbName];
}


export {
    initDatabaseConnections,
    getConnection,
}
