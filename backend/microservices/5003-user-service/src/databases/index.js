import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connections = {
    brownOak: null,
    moodie: null
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
        setupEvents(connections.brownOak, "BrownOak", process.env.ATLAS_URI_BROWNOAK);
    }

    if (!connections.moodie) {
        connections.moodie = mongoose.createConnection(
            process.env.ATLAS_URI_MOODIE,
            connectionOptions
        );
        setupEvents(connections.moodie, "Moodie", process.env.ATLAS_URI_MOODIE);
    }

    return connections;
};

const getConnection = (dbName) => {
    if (!connections[dbName]) {
        throw new Error(`Mongo connection for ${dbName} not initialized`);
    }
    return connections[dbName];
};

const setupEvents = (conn, label, uri) => {
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
