import mongoose from "mongoose";

const connections = {
    portfolio: null,
}

const initDatabaseConnections = async() => {
    try {
        // Portfolio DB connection
        if (!connections.portfolio) {
            connections.portfolio = mongoose.createConnection(process.env.ATLAS_URI_PORTFOLIO_SITE);
            connections.portfolio.once("open", () => console.log("✅ MongoDB Portfolio connected"));
            connections.portfolio.on("error", (err) => console.error("❌ MongoDB Portfolio error:", err));
            connections.portfolio.on("disconnected", () => {

                console.log("MongoDB Portfolio disconnected, attempting to reconnect...");
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
