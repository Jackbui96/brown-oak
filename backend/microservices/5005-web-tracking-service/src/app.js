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

// Swagger Docs
import { swaggerDocs as V1SwaggerDocs } from "./swagger.js";

const app = express();
const httpServer = http.createServer(app);

// Middlewares
app.use(cors());
app.use(express.json());

app.use(
    cors(),
    bodyParser.json(),
);

await loadConfigFromSSM([
    "databases",
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
        "/web-tracking/graphql",
        cors(),
        bodyParser.json(),
        expressMiddleware(server, {
            context: async ({ req }) => {
                const dbName = req.headers["x-db-name"];
                if (!dbName) throw new Error("Missing x-db-name header");
                return { req, dbName };
            }
        })
    );
}

await initDatabaseConnections();
await startApolloServer();

const webTrackingPort = 5005;
httpServer.listen(webTrackingPort, () => {
    console.log(`Server running on port ${webTrackingPort}`);
    V1SwaggerDocs(app, webTrackingPort)
});
