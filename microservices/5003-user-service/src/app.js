import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import http from "http";

// Get Config from AWS SSM
import { loadConfigFromSSM } from "./utils/loadConfig.js";

// MongoDB Server
import { initDatabaseConnections } from "./databases/index.js";

// Apollo Server
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

// GraphQL Schemas and Resolvers per app
import moodieTypeDefs from "./graphql/moodie/schema.js";
import moodieResolvers from "./graphql/moodie/resolvers.js";
import trafficTypeDefs from "./graphql/traffic-monitor/schema.js";
import trafficResolvers from "./graphql/traffic-monitor/resolvers.js";

// REST Routes
import v1_TrafficMonitorAuthRoutes from "./v1/routes/traffic-monitor/authRoutes.js";
import v1_MoodieAuthRoutes from "./v1/routes/moodie/authRoutes.js";
import v1_UserRoutes from "./v1/routes/traffic-monitor/userRoutes.js";

const app = express();
const httpServer = http.createServer(app);

// First, load all necessary configurations from SSM
console.log("Loading configurations from SSM...");
await loadConfigFromSSM([
    "databases",
    "keys/twilio",
    "keys/firebase",
]);

import { setupFirebaseAuth, verifyFirebaseToken } from "./middlewares/moodie/firebaseAuth.js";
await setupFirebaseAuth();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(verifyFirebaseToken); // Now using Firebase auth after it's properly initialized

// Health check
app.get("/", (req, res) => {
    res.send("Backend is running!");
});

// REST Routes
app.use("/v1/traffic-monitor/auth", v1_TrafficMonitorAuthRoutes);
app.use("/v1/moodie/auth", v1_MoodieAuthRoutes);
app.use("/v1/user", v1_UserRoutes);

// Apollo Server Setup (separate GraphQL servers for each app)
async function startApolloServers() {
    const moodieServer = new ApolloServer({
        typeDefs: moodieTypeDefs,
        resolvers: moodieResolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    const trafficServer = new ApolloServer({
        typeDefs: trafficTypeDefs,
        resolvers: trafficResolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    await moodieServer.start();
    await trafficServer.start();

    const moodieMiddleware = expressMiddleware(moodieServer, {
        context: async ({ req }) => ({
            user: req.user,
        }),
    });

    const trafficMiddleware = expressMiddleware(trafficServer, {
        context: async ({ req }) => ({ req }),
    });

    app.use("/v1/moodie/graphql", cors(), bodyParser.json(), moodieMiddleware);
    app.use("/v1/traffic-monitor/graphql", cors(), bodyParser.json(), trafficMiddleware);
}

await initDatabaseConnections();
await startApolloServers();

const userServicePort = 5003;
httpServer.listen(userServicePort, () => {
    console.log(`Server running on port ${userServicePort}`);
});

process.on("SIGINT", () => {
    console.log("Received SIGINT. Shutting down...");
    httpServer.close(() => {
        console.log("Server closed.");
        process.exit(0);
    });
});

process.on("SIGTERM", () => {
    console.log("Received SIGTERM. Shutting down...");
    httpServer.close(() => {
        console.log("Server closed.");
        process.exit(0);
    });
});
