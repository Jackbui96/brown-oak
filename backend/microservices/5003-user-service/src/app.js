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

// GraphQL schema and resolvers
import typeDefs from "./graphql/schema.js";
import resolvers from "./graphql/resolvers.js";

// REST Routes
import v1_AuthRoutes from "./v1/routes/authRoutes.js";
import v1_UserRoutes from "./v1/routes/userRoutes.js"

// Swagger Docs
import { swaggerDocs as V1SwaggerDocs } from "./v1/swagger.js";

const app = express();
const httpServer = http.createServer(app);

// Middlewares
app.use(cors());
app.use(express.json());

// REST endpoint for health-check
app.get("/", (req, res) => {
    res.send("Backend is running!");
})

// REST routes
app.use("/v1/auth", v1_AuthRoutes);
app.use("/v1/user", v1_UserRoutes);

await loadConfigFromSSM([
    "databases",
    "keys/twilio"
]);

// Setup Apollo Server with Express
async function startApolloServer() {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        plugins:[
            ApolloServerPluginDrainHttpServer({ httpServer })
        ],
    });
    await server.start();

    // Mount GraphQL middleware at /graphql
    app.use(
        "/graphql",
        cors(),
        bodyParser.json(),
        expressMiddleware(server, {
            context: async ({ req }) => ({ req }),
        })
    );
}

await initDatabaseConnections();
await startApolloServer();

const userServicePort = 5003;
httpServer.listen(userServicePort, () => {
    console.log(`Server running on port ${userServicePort}`);
    V1SwaggerDocs(app, userServicePort)
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
