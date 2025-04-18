import mongoose from "mongoose";

const connections = {
    brownOak: null,
    moodie: null,
    portfolio: null,
};

const connectionOptions = {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000
};

const initDatabaseConnections = async () => {
    if (!connections.brownOak) {
        connections.brownOak = mongoose.createConnection(
            process.env.ATLAS_URI_BROWNOAK,
            connectionOptions
        );
        setupEvents(connections.brownOak, "BrownOak");
    }

    if (!connections.moodie) {
        connections.moodie = mongoose.createConnection(
            process.env.ATLAS_URI_MOODIE,
            connectionOptions
        );
        setupEvents(connections.moodie, "Moodie");
    }

    if (!connections.portfolio) {
        connections.portfolio = mongoose.createConnection(
            process.env.ATLAS_URI_PORTFOLIO_SITE,
            connectionOptions
        );
        setupEvents(connections.portfolio, "PortfolioSite");
    }

    return connections;
};

const getConnection = (dbName) => {
    if (!connections[dbName]) {
        throw new Error(`Mongo connection for ${dbName} not initialized`);
    }
    return connections[dbName];
};

const setupEvents = (conn, label) => {
    conn.once("open", () => console.log(`✅ MongoDB ${label} connected`));

    conn.on("error", (err) => {
        console.error(`❌ MongoDB ${label} error:`, err.message);
    });

    conn.on("disconnected", () => {
        console.warn(`❗ MongoDB ${label} disconnected. Retrying in 3s...`);
    });
};

export {
    initDatabaseConnections,
    getConnection
};
